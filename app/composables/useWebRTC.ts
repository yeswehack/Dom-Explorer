import { z } from "zod";
import { stateParser } from "~/types";
import { detect } from "detect-browser";

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
  id: string;
  name: string;
  followInput: boolean;
  followPipelines: boolean;
  pc: RTCPeerConnection;
  state: RTCPeerConnectionState;
  startPairing(): Promise<string>;
  joinPairing(offer: string): Promise<string>;
  acceptAnswer(answer: string): Promise<void>;
  send(data: RTCMessage): void;
  onMessage(callback: MessageCallback): void;
  onOpen(callback: () => void): void;
  onClose(callback: () => void): void;
  close(): void;
}

export interface RTCConnections {
  connections: Ref<RTCConnection[]>;
  createConnection(): RTCConnection;
  onMessage(callback: MessageCallback): void;
  send(data: RTCMessage): void;
}

function getBrowserName() {
  const browser = detect(navigator.userAgent);
  if (!browser) return "Unknown";
  return `${browser.name} ${browser.version ?? ""}`;
}

export function useRTCConnection(): RTCConnection {
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
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
    id: randomId(16),
    name: "<disconnected>",
    state: pc.connectionState,
    async startPairing() {
      const { promise, resolve } = Promise.withResolvers<string>();

      await pc.setLocalDescription(await pc.createOffer());
      pc.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate || !pc.localDescription?.sdp) return;
        const sdp = pc.localDescription.sdp;
        resolve(btoa(sdp));
      });
      return promise;
    },
    async joinPairing(offer: string) {
      await pc.setRemoteDescription({
        type: "offer",
        sdp: atob(offer),
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const { promise, resolve } = Promise.withResolvers<string>();

      pc.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate || !pc.localDescription?.sdp) return;
        resolve(btoa(pc.localDescription.sdp));
      });

      return promise;
    },
    async acceptAnswer(answer: string) {
      pc.setRemoteDescription({
        type: "answer",
        sdp: atob(answer),
      });
    },
    send(data: RTCMessage) {
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

  dc.addEventListener("open", () => {
    con.send({
      type: "info",
      name: getBrowserName(),
      id: con.id,
    });
    if (con.followInput || con.followPipelines) {
      con.send({
        type: "getState",
      });
    }
    for (const callback of onOpen) {
      callback();
    }
  });

  dc.addEventListener("close", () => {
    for (const callback of onClose) {
      callback();
    }
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
        con.id = msg.data.id;
      }

      for (const callback of onMessage) {
        callback(con, msg.data);
      }
    });
  });

  pc.addEventListener("connectionstatechange", () => {
    con.state = pc.connectionState;
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
const connections = shallowRef<RTCConnection[]>([]);
const onMessage = new Set<MessageCallback>();

export function useRTCConnections(): RTCConnections {
  function createConnection() {
    const connection = useRTCConnection();
    connections.value.push(connection);
    connection.onClose(() => {
      const index = connections.value.indexOf(connection);
      connections.value.splice(index, 1);
      triggerRef(connections);
    });
    connection.onMessage((con, message) => {
      for (const callback of onMessage) {
        callback(con, message);
      }
    });
    triggerRef(connections);
    return connection;
  }

  return {
    connections,
    createConnection,
    onMessage(callback: MessageCallback) {
      onMessage.add(callback);
    },
    send(message: RTCMessage) {
      for (const connection of connections.value) {
        connection.send(message);
      }
    },
  };
}
