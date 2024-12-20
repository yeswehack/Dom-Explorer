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
    <Pipelines :state="state" :read-only="settings.readonly" is-embed />
    <a
      v-if="isEmbed"
      :href="href"
      target="_blank"
      class="fixed bottom-0 right-0 z-[100] flex items-center rounded-tl border-l border-t border-[#00dc8266] bg-gray-900 px-2 text-[0.7rem] tracking-wide"
    >
      <DomExplorerIcon class="size-4" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { DomExplorerState } from "~/types";

defineProps<{
  state: DomExplorerState;
  isEmbed?: boolean;
}>();

const settings = useDomExplorerSettings();
const route = useRoute();
const href = computed(() => {
  return resolveRemoteLink({
    name: "index",
    query: route.query,
    hash: route.hash,
  });
});
</script>
