<template>
  <div class="flex flex-col gap-2 self-start p-2 pb-6 text-sm text-white">
    <CodeEditor
      v-if="settings.input !== 'hidden'"
      v-model="state.input"
      :read-only="settings.input === 'readonly'"
      :placeholder="settings.input === 'readonly' ? '' : 'Enter HTML here...'"
      class="rounded-md bg-secondary"
      language="HTML"
      border-radius=".5rem"
      padding="10px"
      width="100%"
      autofocus
      :copy-code="false"
    />
    <Pipeline v-if="pipeline" :input="state.input ?? ''" :pipeline="pipeline" />
    <a
      :href="href"
      target="_blank"
      class="absolute bottom-0 right-0 flex items-center rounded-tl border-l border-t border-[#00dc8266] bg-gray-900 px-2 text-[0.7rem] tracking-wide group-hover:pointer-events-none"
    >
      <DomExplorerIcon class="size-4" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { DomExplorerState } from "~/types";

definePageMeta({
  layout: "empty",
});

const props = defineProps<{
  state: DomExplorerState;
  filter?: string;
}>();

const pipeline = computed(() => {
  if (props.filter) {
    return props.state.pipelines.find((p) => p.id === props.filter);
  }
  return props.state.pipelines.at(0);
});

const settings = useDomExplorerSettings();

const href = computed(() => {
  const url = new URL("/Dom-Explorer/dom-explorer", window.location.origin);
  url.hash = window.location.hash;

  return url.href;
});
</script>
