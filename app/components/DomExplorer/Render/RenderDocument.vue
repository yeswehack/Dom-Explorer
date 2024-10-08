<template>
  <template v-for="(node, idx) of childNodes" :key="idx">
    <RenderNode :node="node" />
  </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
  fragment: DocumentFragment | Document;
}>();

const childNodes = computed(() => {
  if (props.fragment.constructor.name === "HTMLDocument") {
    return Array.from(noClobber(props.fragment, "childNodes"));
  }

  if (props.fragment instanceof DocumentFragment) {
    return Array.from(noClobber(props.fragment, "childNodes"));
  }
  return [];
});
</script>
