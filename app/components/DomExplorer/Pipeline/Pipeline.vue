<template>
  <Card ref="card" class="group overflow-auto">
    <TooltipProvider>
      <div
        v-if="settings.titleBar !== 'hidden'"
        class="rounded-t-xl bg-secondary"
        :class="!editName && 'pipeline-handle'"
      >
        <CardTitle
          class="relative flex items-center justify-between gap-2 px-1 py-1"
          :class="sortable && 'cursor-grab active:cursor-grabbing'"
          @dblclick="editName = settings.titleBar !== 'readonly'"
        >
          <Input
            v-if="editName"
            v-model="pipeline.name"
            autofocus
            class="h-8 py-0 pl-2"
            @keypress.enter="editName = false"
            @blur="editName = false"
          />
          <div
            v-else
            class="flex h-8 cursor-text items-center gap-2 pl-2"
            @click="editName = settings.titleBar !== 'readonly'"
          >
            {{ pipeline.name || "..." }}
          </div>
          <slot name="head" />
        </CardTitle>
      </div>
      <CardContent>
        <Sortable
          :items="pipeline.pipes"
          class="flex flex-col"
          group="pipe"
          handle=".pipe-handle"
          :disabled="settings.readonly"
        >
          <template #item="{ item, index }">
            <RenderPipe
              :key="item.id"
              :input="getInput(item.id)"
              :pipe="item"
              @update="results.set(item.id, $event)"
              @delete="pipeline.pipes.splice(index, 1)"
            />
          </template>
        </Sortable>
        <div
          v-if="!settings.readonly"
          class="mt-4 flex items-center transition-opacity"
        >
          <div class="-ml-3 h-px w-4 bg-border" />
          <PipeCreateButton @create="addPipe" />
        </div>
      </CardContent>
    </TooltipProvider>
  </Card>
</template>

<script lang="ts" setup>
import type { Pipe, Pipeline } from "~/types";

const props = defineProps<{
  input: string;
  pipeline: Pipeline;
  sortable?: boolean;
}>();

const results = reactive(new Map<string, string>());

const settings = useDomExplorerSettings();
const card = ref();

const editName = ref(false);

function addPipe(pipe: Pipe) {
  props.pipeline.pipes.push(pipe);
}

function parseInput(s: string) {
  return s
    .replace(/<([a-z0-9-]+)\*(\d{1,3})>/g, (all, tag, repeat) => {
      return `<${tag}>`.repeat(parseInt(repeat));
    })
    .replace(/\\u([0-9a-f]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

function getInput(id: string) {
  let input = parseInput(props.input);
  for (const pipe of props.pipeline.pipes) {
    if (pipe.id === id) {
      return input;
    }
    if (!pipe.skip) {
      input = results.get(pipe.id) ?? "";
    }
  }

  return input;
}
</script>
