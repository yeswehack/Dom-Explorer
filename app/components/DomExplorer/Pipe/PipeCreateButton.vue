<template>
  <SearchInput
    :groups="groups"
    :model-value="undefined"
    :align="align"
    @update:model-value="create"
  >
    <template #button>
      <slot>
        <Button size="iconSm" icon="plus" class="size-6" />
      </slot>
    </template>
  </SearchInput>
</template>

<script lang="ts" setup>
import { createPipe, isValidPipeName, type Pipe } from "~/types";
import { pipes } from "../Pipes";

const props = withDefaults(
  defineProps<{
    allowEmpty?: boolean;
    align?: "start" | "end" | "center";
  }>(),
  {
    allowEmpty: false,
    align: "center",
  },
);

const emit = defineEmits<{
  create: [Pipe[]];
  createEmpty: [];
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
    })
    .toSorted((a, b) => {
      return a.label.localeCompare(b.label);
    });
});

const groups = computed(() => {
  const groups: {
    name: string;
    items: (string | { label: string; value: string })[];
  }[] = [];

  if (props.allowEmpty) {
    groups.push({
      name: "",
      items: [
        {
          label: "Empty",
          value: "$empty",
        },
      ],
    });
  }

  // Force the order
  if (presetsChoices.value.length > 0) {
    groups.push({ name: "Preset", items: presetsChoices.value });
  }
  groups.push({ name: "Parser", items: [] });
  groups.push({ name: "Sanitizer", items: [] });
  groups.push({ name: "Render", items: [] });
  groups.push({ name: "Other", items: [] });

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
  if (name === "$empty") {
    emit("create", []);
    return;
  }
  if (name.startsWith("preset:")) {
    const preset = presets.value.find((p) => p.id === name.slice(7));
    if (!preset) return;
    emit("create", preset.pipes.map(clonePipe));
  } else if (isValidPipeName(name)) {
    const newPipe = createPipe(name);
    emit("create", [newPipe]);
  }
}
</script>
