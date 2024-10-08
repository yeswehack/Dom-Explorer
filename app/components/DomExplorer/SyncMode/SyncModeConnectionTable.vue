<template>
  <div class="grid grid-cols-[auto_auto_auto_auto_32px] text-sm">
    <div
      class="col-span-full grid grid-cols-[subgrid] items-end border-b px-2 py-1 font-medium text-muted-foreground"
    >
      <div>Name</div>
      <div>State</div>
      <div class="col-span-2 grid grid-cols-[subgrid] text-center">
        <div class="col-span-2">Follow</div>
        <div>Input</div>
        <div>Pipelines</div>
      </div>
      <div />
    </div>
    <div
      v-for="con of connections"
      :key="con.id"
      class="col-span-full grid grid-cols-[subgrid] p-2"
    >
      <div>
        {{ con.name }}
      </div>
      <div>
        {{ con.state }}
      </div>
      <div class="flex items-center justify-center">
        <Checkbox v-model="con.followInput" />
      </div>
      <div class="flex items-center justify-center">
        <Checkbox v-model="con.followPipelines" />
      </div>
      <div>
        <Button
          class="size-5 hover:bg-destructive"
          size="icon"
          @click="con.close()"
        >
          <Icon name="trash" class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { connections } = useRTCConnections();
</script>
