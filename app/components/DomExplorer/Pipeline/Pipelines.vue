<template>
  <Sortable
    :items="state.pipelines"
    class="flex flex-1 flex-wrap items-stretch justify-stretch gap-2"
    :animation="0"
    group="pipeline"
    handle=".pipeline-handle"
    item-class="flex-1  min-w-[min(500px,100%)] grid"
    swap
  >
    <template #item="{ item: pipeline }">
      <Pipeline
        :key="pipeline.id"
        :input="state.input"
        :pipeline="pipeline"
        sortable
      >
        <template #head>
          <div class="ml-auto flex gap-1">
            <Tooltip label="Embed">
              <KeepHashLink
                to="dom-explorer-embed-id"
                :params="{ id: pipeline.id }"
              >
                <Button size="icon" class="size-6" variant="ghost">
                  <Icon name="scanText" class="size-4" />
                </Button>
              </KeepHashLink>
            </Tooltip>
            <Tooltip label="Duplicate">
              <Button
                size="icon"
                class="size-6"
                variant="ghost"
                @click="duplicatePipeline(pipeline)"
              >
                <template #tooltip> Duplicate </template>
                <Icon name="copy" class="size-4" />
              </Button>
            </Tooltip>
            <Tooltip label="Delete">
              <Button
                size="icon"
                class="size-6"
                variant="ghost-destructive"
                @click="deletePipeline(pipeline)"
              >
                <Icon name="trash" class="size-4" />
              </Button>
            </Tooltip>
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
