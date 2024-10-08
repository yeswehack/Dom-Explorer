<template>
  <DomBase
    v-show="text"
    :tag="isScript ? 'source' : 'text'"
    prefix="#"
    suffix=""
  >
    <pre
      class="break-all whitespace-pre-wrap text-muted-foreground/70"
      v-html="text"
    />
  </DomBase>
</template>

<script lang="ts" setup>
import hljs from "highlight.js";
const props = defineProps<{
  content: Text;
  keepEmpty?: boolean;
}>();

function htmlEncode(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const isScript = computed(() => {
  return props.content.parentElement?.tagName === "SCRIPT";
});

const text = computed(() => {
  const text = props.content.textContent ?? "";
  if (!text.trim()) return "";
  if (isScript.value) {
    return (
      hljs.highlight(text, {
        language: "javascript",
      }).value || "'<Empty String>'"
    );
  } else {
    return text
      .split(/(\n+)/gm)
      .map((part) => {
        if (part.startsWith("\n")) {
          return `<span class="mx-1 text-muted-foreground/50">${"\\n".repeat(part.length)}</span>`;
        }
        return `<span>${htmlEncode(part)}</span>`;
      })
      .join("");
  }
});
</script>
