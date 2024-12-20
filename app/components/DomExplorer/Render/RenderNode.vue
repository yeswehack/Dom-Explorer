<template>
  <RenderElement v-if="isElement(node)" :el="node" :depth="depth" />
  <RenderTextFragment v-else-if="isTextFragment(node)" :content="node" :depth="depth" />
  <RenderComment v-else-if="isComment(node)" :comment="node" :depth="depth" />
  <RenderDocument v-else-if="isDocument(node)" :fragment="node" :depth="depth" />
  <RenderDoctype v-else-if="isDoctype(node)" :doctype="node" :depth="depth" />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    node: Node;
    depth?: number;
  }>(),
  { depth: 0 },
);

const nodeType = computed(() => {
  return Object.getOwnPropertyDescriptor(Node.prototype, "nodeType")?.get?.call(
    props.node,
  );
});

function isElement(node: Node): node is Element {
  return nodeType.value === Node.ELEMENT_NODE;
}

function isTextFragment(node: Node): node is Text {
  return (
    nodeType.value === Node.TEXT_NODE ||
    nodeType.value === Node.CDATA_SECTION_NODE
  );
}

function isComment(node: Node): node is Comment {
  return nodeType.value === Node.COMMENT_NODE;
}

function isDocument(node: Node): node is Document {
  return nodeType.value === Node.DOCUMENT_NODE;
}

function isDoctype(node: Node): node is DocumentType {
  return nodeType.value === Node.DOCUMENT_TYPE_NODE;
}
</script>
