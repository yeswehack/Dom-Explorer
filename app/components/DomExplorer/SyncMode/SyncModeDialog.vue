<template>
  <DualSheet
    v-model:open="open"
    title="Sync Tabs"
    description="You can use this feature to sync tabs between different browser.
          Synched tabs will be updated in real-time."
  >
    <template #trigger>
      <slot />
    </template>
    <template #center>
      <Card class="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Connections</CardTitle>
        </CardHeader>
        <SyncModeConnectionTable />
      </Card>
    </template>
    <template #side>
      <div class="flex flex-col gap-6">
        <Label class="flex items-center justify-between gap-2">
          Tab name:
          <Input v-model="tabName" class="flex-1" />
        </Label>
        <div class="flex flex-col gap-2">
          <h2 class="font-semibold">Join with offer id</h2>
          <form class="flex gap-2" @submit.prevent="joinRoomId">
            <Input
              v-model="roomId"
              class="flex-1"
              required
              :spellcheck="false"
              pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
            />
            <Button
              icon="cable"
              size="icon"
              tooltip="Connect"
              class="self-center"
              type="submit"
              :disabled="!roomId"
            />
          </form>
        </div>
      </div>
    </template>
  </DualSheet>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>("open", { default: false });

const { tabName, joinRoom } = useSyncTabs();
const roomId = ref("");

function joinRoomId() {
  joinRoom(roomId.value).then(() => {
    roomId.value = "";
  });
}
</script>
