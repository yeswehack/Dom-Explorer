<template>
  <SearchInput
    align="start"
    label="+"
    :groups="groups"
    :model-value="undefined"
    @update:model-value="create"
  >
    <template #button>
      <Button size="icon" class="size-6">
        <Icon name="plus" class="size-5" />
      </Button>
    </template>
  </SearchInput>
</template>

<script lang="ts" setup>
import { createPipe, isValidPipeName, type Pipe } from "~/types";
import { pipes } from "../Pipes";

const emit = defineEmits<{
  create: [Pipe];
}>();

const { presets } = usePresets();

const presetsChoices = computed(() => {
  return presets.value
    .map((p) => {
      if (p.pipes.length === 0) return;
      return {
        value: `preset:${p.id}`,
        label: p.name,
      };
    })
    .filter((p) => {
      return !!p;
    });
});

const groups = computed(() => {
  const groups: {
    name: string;
    items: (string | { label: string; value: string })[];
  }[] = [];

  // Force the order
  groups.push({ name: "DEV", items: [] });
  groups.push({ name: "Preset", items: [] });
  groups.push({ name: "Parser", items: [] });
  groups.push({ name: "Sanitizer", items: [] });
  groups.push({ name: "Render", items: [] });
  groups.push({ name: "Other", items: [] });

  if (presetsChoices.value.length > 0) {
    groups.push({ name: "Preset", items: presetsChoices.value });
  }

  pipes.forEach((pipe) => {
    const group = groups.find((g) => g.name === pipe.category);
    if (group) {
      group.items.push(pipe.name);
      return;
    } else {
      groups.push({ name: pipe.category, items: [pipe.name] });
    }
  });

  return groups;
});

function create(name: string) {
  if (name.startsWith("preset:")) {
    const preset = presets.value.find((p) => p.id === name.slice(7));
    if (!preset) return;
    for (const pipe of preset.pipes) {
      emit("create", pipe);
    }
  } else if (isValidPipeName(name)) {
    const newPipe = createPipe(name);
    emit("create", newPipe);
  }
}
</script>
