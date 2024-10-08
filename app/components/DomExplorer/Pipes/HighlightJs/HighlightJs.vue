<template>
  <Pipe :pipe="pipe">
    <template #description>
      This pipe show the HTML input using
      <ExternalLink href="https://highlightjs.org/" label="highlightjs" />
      . It is mostly used for debugging. This pipe return the input as is.
    </template>
    <template #render>
      <RenderHtml :text="input" />
    </template>
  </Pipe>
</template>

<script setup lang="ts">
import type { Pipe } from "~/types.js";
import type { Opts } from "./HighlightJs.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

watchEffect(() => {
  emit("update", props.input);
});
</script>
