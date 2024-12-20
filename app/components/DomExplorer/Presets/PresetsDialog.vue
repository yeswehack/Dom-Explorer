<template>
  <DualSheet
    v-model:open="open"
    title="Presets"
    description="Create, edit, and delete presets for your pipelines."
  >
    <template #trigger>
      <slot />
    </template>
    <template #center>
      <div v-if="selectedPreset" class="flex flex-col gap-6 pb-6">
        <CodeEditor
          v-model="input"
          placeholder="Enter HTML here..."
          class="rounded-md bg-secondary"
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
        />
      </div>
    </template>
    <template #side>
      <SearchInput
        v-model="selectedPresetId"
        no-popover
        allow-delete
        allow-create
        button-class="w-full"
        create-label="New Preset"
        :choices="choices"
        @delete="deletePreset"
        @create="createPreset"
      />
    </template>
  </DualSheet>
</template>

<script lang="ts" setup>
import type { Pipeline } from "~/types";

const props = defineProps<{
  pipeline?: Pipeline;
}>();

const { presets, deletePreset, newPreset } = usePresets();

const selectedPresetId = ref(presets.value[0]?.id);
const input = ref("");
const open = defineModel<boolean>("open", { default: false });

const selectedPreset = computed(() => {
  return presets.value.find(
    (pipeline) => pipeline.id === selectedPresetId.value,
  );
});

whenever(open, () => {
  if (props.pipeline) {
    selectedPresetId.value = newPreset(props.pipeline);
  }
});

function createPreset() {
  selectedPresetId.value = newPreset({
    id: randomId(),
    name: "New Preset",
    pipes: [],
  });
}

const choices = computed(() => {
  return presets.value
    .map((preset) => ({
      label: preset.name,
      value: preset.id,
    }))
    .toSorted((a, b) => {
      return a.label.localeCompare(b.label);
    });
});
</script>
