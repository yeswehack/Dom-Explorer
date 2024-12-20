<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead> Name </TableHead>
        <TableHead class="w-48">State</TableHead>
        <TableHead class="w-48 text-center">Follow Inputs</TableHead>
        <TableHead class="w-48 text-center">Follow Pipelines</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <SyncModeRow v-for="con of connections" :key="con.id" :con="con" />
      <TableRow v-if="!connections.length">
        <TableCell colspan="5" class="text-center text-muted-foreground">
          No connections
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colspan="5"
          class="space-y-2 py-4 text-center text-muted-foreground"
        >
          <Alert v-if="error" variant="destructive">
            <Icon name="triangleAlert" class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription class="min-w-72">
              {{ error }}
            </AlertDescription>
          </Alert>
          <Button
            label="Create connection offer"
            :icon="createIcon"
            :icon-class="loading && 'animate-spin'"
            @click="createLink"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
const { connections, createRoom } = useSyncTabs();
const loading = ref(false);
const error = ref("");
const createIcon = computed(() => (loading.value ? "loaderCircle" : "plus"));

async function createLink() {
  if (loading.value) return;
  loading.value = true;
  error.value = "";
  try {
    await createRoom();
  } catch (e) {
    error.value = `${e}`;
  } finally {
    loading.value = false;
  }
}
</script>
