<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button class="h-8 capitalize">{{ buttonTitle }}</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sync Tabs</DialogTitle>
        <DialogDescription class="sr-only"> Sync tabs</DialogDescription>
      </DialogHeader>

      <SyncModeConnectionTable />

      <div v-if="tab == 'none'" class="mt-2 flex justify-center gap-4">
        <Button @click="start">Start pairing</Button>
        <Button @click="join">Join pairing</Button>
      </div>
      <div v-else class="mt-2 h-1 w-full bg-border"/>
      <SyncModeStartPairing
        v-if="connection && tab === 'start'"
        :connection="connection"
      />
      <SyncModeJoinPairing
        v-if="connection && tab === 'join'"
        :connection="connection"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import SyncModeConnectionTable from "./SyncModeConnectionTable.vue";
import SyncModeJoinPairing from "./SyncModeJoinPairing.vue";
import SyncModeStartPairing from "./SyncModeStartPairing.vue";

const { createConnection, connections } = useRTCConnections();

const connection = ref<RTCConnection>();

const tab = ref("none");
const open = ref(false);

whenever(
  () => !open.value,
  () => {
    tab.value = "none";
    connection.value = undefined;
  },
);

const buttonTitle = computed(() => {
  if (connections.value.length) {
    return `Synched (${connections.value.length})`;
  } else {
    return "Sync Tabs";
  }
});

function close() {
  tab.value = "none";
  connection.value = undefined;
}

function start() {
  const con = createConnection();
  con.onClose(() => {
    if (con.id === connection.value?.id) {
      close();
    }
  });
  con.onOpen(() => {
    if (con === connection.value) {
      close();
    }
  });
  connection.value = con;
  tab.value = "start";
}

function join() {
  const con = createConnection();
  con.onClose(() => {
    if (con === connection.value) {
      close();
    }
  });
  con.onOpen(() => {
    if (con === connection.value) {
      close();
    }
  });
  connection.value = con;
  tab.value = "join";
}
</script>
