<template>
  <div class="overflow-auto break-all bg-zinc-900 text-zinc-100 rounded-sm p-1 font-mono">
    <div class="max-w-full" :class="!text && 'opacity-35'" v-html="html" />
  </div>
</template>

<script lang="ts" setup>
import hljs from "highlight.js";
const props = defineProps<{
  text?: string;
}>();

const html = computed(() => {
  return (
    hljs.highlight(props.text ?? "", {
      language: "html",
    }).value || "&lt;Empty String&gt;"
  );
});
</script>
