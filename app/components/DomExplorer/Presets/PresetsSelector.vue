<template>
  <div
    class="sticky top-0 max-h-full min-h-0 w-64 self-start overflow-auto rounded-md border"
  >
    <div
      class="sticky top-0 flex items-center justify-between bg-muted px-2 py-2 font-semibold text-muted-foreground"
    >
      Presets
      <Button size="icon" class="size-5" @click="model = newPreset()">
        <Icon name="plus" class="size-4" />
      </Button>
    </div>
    <Sortable
      group="edit-pipe"
      handle=".handle"
      :items="presets"
      class="flex min-h-[unset] w-full flex-col"
    >
      <template #item="{ item }">
        <div
          class="handle not grid h-9 cursor-pointer grid-cols-[1rem_1fr_1rem] items-center gap-2 whitespace-nowrap border-t px-1.5 py-1 pr-3 transition hover:bg-black/5 active:cursor-grabbing dark:hover:bg-white/5"
          :class="item.id === model ? 'bg-white/5' : 'bg-transparent'"
          @click="model = item.id"
        >
          <Icon
            name="gripHorizontal"
            class="handle size-4 cursor-grab active:cursor-grabbing"
          />
          <div class="min-w-0 flex-shrink-0 truncate">
            {{ item.name }}
          </div>
          <Button size="icon" class="size-5" @click="remove(item.id)">
            <Icon name="trash" class="size-4" />
          </Button>
        </div>
      </template>
    </Sortable>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({});
const { presets, newPreset, deletePreset } = usePresets();

function remove(id: string) {
  let oldIdx = deletePreset(id);
  while (oldIdx >= 0 && !presets.value[oldIdx]) {
    oldIdx--;
  }
  if (oldIdx >= 0) {
    model.value = presets.value[oldIdx]!.id;
  }
}
</script>
