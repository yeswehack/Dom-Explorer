import { z } from "zod";
import { stateParser } from "~/types";

const message = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("info"),
    name: z.string(),
    id: z.string(),
  }),
  z.object({
    type: z.literal("getState"),
  }),
  z.object({
    type: z.literal("state"),
    value: stateParser,
  }),
]);

type RTCMessage = z.infer<typeof message>;
type MessageCallback = (con: RTCConnection, message: RTCMessage) => void;
export interface RTCConnection {
  pc: RTCPeerConnection;

  id: string;
  name: string;
  followInput: boolean;
  followPipelines: boolean;
  state: RTCPeerConnectionState;

  send(data: RTCMessage): void;
  onMessage(callback: MessageCallback): void;
  onOpen(callback: () => void): void;
  onClose(callback: () => void): void;
  close(): void;
}
const tabName = ref(getBrowserName());
const connections = ref<RTCConnection[]>([]);
const onMessage = new Set<MessageCallback>();

function createRTCConnection(stunServers: string[]) {
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: stunServers,
      },
    ],
  });
  const dc = pc.createDataChannel("write");

  const onOpen = new Set<() => void>();
  const onClose = new Set<() => void>();
  const onMessage = new Set<MessageCallback>();

  const con: RTCConnection = reactive({
    followInput: false,
    followPipelines: false,
    pc,
    id: "",
    name: "<disconnected>",
    state: pc.connectionState,

    send(data: RTCMessage) {
      if (con.state !== "connected") return;
      dc.send(JSON.stringify(data));
    },
    onMessage(callback: MessageCallback) {
      onMessage.add(callback);
    },
    onClose(callback: () => void) {
      onClose.add(callback);
    },
    onOpen(callback: () => void) {
      onOpen.add(callback);
    },
    close() {
      pc.close();
    },
  });

  pc.addEventListener("connectionstatechange", () => {
    con.state = pc.connectionState;
  });

  dc.addEventListener("open", () => {
    con.send({
      type: "info",
      name: getBrowserName(),
      id: con.id,
    });
    if (con.followInput || con.followPipelines) {
      con.send({ type: "getState" });
    }

    onOpen.forEach((callback) => callback());
  });

  dc.addEventListener("close", () => {
    onClose.forEach((callback) => callback());
  });

  pc.addEventListener("datachannel", (event) => {
    const remoteDc = event.channel;
    remoteDc.addEventListener("message", (event) => {
      const msg = message.safeParse(JSON.parse(event.data));
      if (msg.error) {
        console.error(msg.error);
        return;
      }

      if (msg.data.type === "info") {
        con.name = msg.data.name;
      }

      for (const callback of onMessage) {
        callback(con, msg.data);
      }
    });
  });

  watch(
    [() => con.followInput, () => con.followPipelines],
    ([followInput, followPipelines]) => {
      if (!followInput && !followPipelines) return;
      con.send({
        type: "getState",
      });
    },
  );

  return con;
}

async function getPairingOffer(connection: RTCConnection): Promise<string> {
  const { promise, resolve } = Promise.withResolvers<string>();
  const pc = connection.pc;
  await pc.setLocalDescription(await pc.createOffer());
  pc.addEventListener("icecandidate", async ({ candidate }) => {
    if (candidate || !pc.localDescription?.sdp) return;
    resolve(pc.localDescription.sdp);
  });
  return promise;
}

async function getPairingReply(
  con: RTCConnection,
  offer: string,
): Promise<string> {
  const { promise, resolve } = Promise.withResolvers<string>();

  await con.pc.setRemoteDescription({
    type: "offer",
    sdp: offer,
  });

  const answer = await con.pc.createAnswer();
  await con.pc.setLocalDescription(answer);

  con.pc.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate || !con.pc.localDescription?.sdp) return;
    resolve(con.pc.localDescription.sdp);
  });
  return promise;
}

async function waitForReply(supabase: SupabaseClient, con: RTCConnection) {
  while (true) {
    const { data, error } = await supabase.rpc("sync_room_get", {
      uuid: con.id,
    });

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error("Invalid ID");
    }

    const row = data as Database["public"]["Tables"]["sync_room"]["Row"];

    if (row.reply) {
      await con.pc.setRemoteDescription({
        type: "answer",
        sdp: row.reply,
      });
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

export function useSyncTabs() {
  const supabase = getSupabaseClient();
  function createConnection() {
    const connection = createRTCConnection(["stun:stun.l.google.com:19302"]);

    connection.onClose(() => {
      const index = connections.value.indexOf(connection);
      if (index !== -1) {
        connections.value.splice(index, 1);
        triggerRef(connections);
      }
    });

    connection.onMessage((con, message) => {
      for (const callback of onMessage) {
        callback(con, message);
      }
    });

    return connection;
  }

  async function createRoom() {
    const connection = createConnection();
    const offer = await getPairingOffer(connection);
    const { data, error } = await supabase.rpc("sync_room_create", {
      offer,
    });

    if (error || !data) {
      console.error(error?.message);
      throw new Error("Failed to create room");
    }
    connection.id = data;
    connections.value.push(connection);
    triggerRef(connections);
    waitForReply(supabase, connection);

    return;
  }

  async function joinRoom(roomId: string) {
    const connection = createConnection();
    connection.id = roomId;

    const { data, error } = await supabase.rpc("sync_room_get", {
      uuid: roomId,
    });
    if (error || !data) {
      console.error(error?.message);
      throw new Error("Failed to join room");
    }
    const row = data as Database["public"]["Tables"]["sync_room"]["Row"];

    const reply = await getPairingReply(connection, row.offer);

    await supabase.rpc("sync_room_join", {
      uuid: roomId,
      new_reply: reply,
    });

    connections.value.push(connection);
    triggerRef(connections);

    return connection;
  }

  function send(message: RTCMessage) {
    for (const connection of connections.value) {
      connection.send(message);
    }
  }

  watch(tabName, (name) => {
    for (const connection of connections.value) {
      connection.send({
        type: "info",
        name,
        id: connection.id,
      });
    }
  });

  return {
    tabName,
    connections,
    createRoom,
    joinRoom,
    send,
    onMessage(callback: MessageCallback) {
      onMessage.add(callback);
    },
  };
}
