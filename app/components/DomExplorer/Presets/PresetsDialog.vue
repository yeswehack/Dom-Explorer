<template>
  <Dialog>
    <DialogTrigger> <slot /> </DialogTrigger>
    <DialogContent class="max-h-[90dvh] max-w-[min(1100px,90vw)] overflow-clip">
      <DialogHeader>
        <DialogTitle class="capitalize">Edit presets</DialogTitle>
        <DialogDescription>
          Create, edit, and delete presets for your pipelines.
        </DialogDescription>
      </DialogHeader>
      <div class="grid max-h-[600px] grid-cols-[auto_1fr] gap-4 overflow-auto">
        <PresetsSelector v-model="selectedPresetId" />
        <div
          v-if="selectedPreset"
          class="flex min-h-0 flex-col gap-2 rounded-md p-2"
        >
          <div class="mb-4 flex items-center gap-2">
            <Label class="flex flex-1 flex-col items-start gap-1.5 px-1">
              <span class="text-sm font-medium text-muted-foreground"
                >Name</span
              >
              <Input v-model="selectedPreset.name" />
            </Label>
          </div>

          <CodeEditor
            v-model="input"
            placeholder="Test HTML here..."
            class="rounded-md bg-secondary p-px"
            language="HTML"
            border-radius=".5rem"
            padding="10px"
            width="100%"
            autofocus
            :copy-code="false"
          />
          <Pipeline
            :pipeline="selectedPreset"
            :input="input"
            no-head
            class="min-h-contents flex-shrink-0"
            always-show-options
            @duplicate="
              selectedPresetId = duplicatePreset(selectedPreset.id).id
            "
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
const { presets, duplicatePreset } = usePresets();

const selectedPresetId = ref(presets.value[0]?.id);
const input = ref("");

const selectedPreset = computed(() => {
  return presets.value.find(
    (pipeline) => pipeline.id === selectedPresetId.value,
  );
});
</script>
