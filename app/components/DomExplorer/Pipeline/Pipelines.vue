<template>
  <Sortable
    :items="state.pipelines"
    class="flex flex-1 flex-wrap items-stretch justify-stretch gap-2"
    :animation="0"
    group="pipeline"
    handle=".pipeline-handle"
    item-class="flex-1  min-w-[min(500px,100%)] grid"
    swap
    :disabled="readOnly"
  >
    <template #item="{ item: pipeline }">
      <Pipeline
        :key="pipeline.id"
        :input="state.input"
        :pipeline="pipeline"
        :sortable="!readOnly"
      >
        <template #head>
          <div v-if="!readOnly" class="ml-auto flex gap-1 font-normal">
            <Button
              v-if="!isEmbed"
              size="iconSm"
              variant="ghost"
              tooltip="Embed"
              icon="scanText"
              @click="emit('embedPipeline', pipeline)"
            />
            <Button
              size="iconSm"
              tooltip="Save as preset"
              icon="bookMarked"
              variant="ghost"
              @click="emit('saveAsPreset', pipeline)"
            />
            <Button
              size="iconSm"
              tooltip="Duplicate"
              icon="copy"
              variant="ghost"
              @click="duplicatePipeline(pipeline)"
            />
            <Button
              size="iconSm"
              tooltip="Delete"
              icon="trash"
              variant="ghost-destructive"
              @click="deletePipeline(pipeline)"
            />
          </div>
        </template>
      </Pipeline>
    </template>
  </Sortable>
</template>

<script setup lang="ts">
import type { DomExplorerState, Pipeline } from "~/types";

const props = defineProps<{
  state: DomExplorerState;
  readOnly?: boolean;
  isEmbed?: boolean;
}>();

const emit = defineEmits<{
  embedPipeline: [Pipeline];
  saveAsPreset: [Pipeline];
  duplicatePipeline: [string];
  deletePipeline: [string];
}>();

function deletePipeline(pipeline: Pipeline) {
  props.state.pipelines = props.state.pipelines.filter((p) => p !== pipeline);
}

function duplicatePipeline(pipeline: Pipeline) {
  const idx = props.state.pipelines.indexOf(pipeline);
  const newPipeline: Pipeline = clonePipeline(pipeline);
  props.state.pipelines.splice(idx + 1, 0, newPipeline);
}
</script>
