<template>
  <div class="group relative grid resize-y grid-cols-1 grid-rows-1">
    <div
      el="output"
      class="col-start-1 row-start-1 max-w-full whitespace-pre-wrap break-all rounded-md border bg-card p-2 font-mono text-card-foreground"
      v-html="html"
    />
    <textarea
      ref="textarea"
      v-model="model"
      :autofocus="autofocus"
      spellcheck="false"
      :placeholder="placeholder"
      :readonly="readOnly"
      rows="1"
      class="col-start-1 row-start-1 h-full resize-none whitespace-pre-wrap break-all rounded-md border-none bg-transparent p-2 font-mono text-transparent caret-black/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:caret-white/80"
    />
    <div
      class="absolute right-0 top-0 rounded-bl-md rounded-tr-md bg-muted px-1.5 pt-0.5 font-mono text-xs text-muted-foreground group-focus-within:bg-ring group-focus-within:text-white"
    >
      {{ shortLang }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import hljs from "highlight.js";

const props = withDefaults(
  defineProps<{
    lang?: string;
    placeholder?: string;
    autofocus?: boolean;
    readOnly?: boolean;
  }>(),
  {
    lang: "html",
    placeholder: "",
    autofocus: false,
  },
);

const textarea = ref<HTMLTextAreaElement>();
const output = ref<HTMLDivElement>();
const { height, width } = useElementSize(output);

watchEffect(
  () => {
    if (textarea.value && height.value && width.value) {
      textarea.value.style.height = `${height.value}px`;
      textarea.value.style.width = `${width.value}px`;
    }
  },
  {
    flush: "post",
  },
);

const model = defineModel<string>({ default: "<div></div>" });

const html = computed(() => {
  return hljs.highlight(model.value + "\u200b", {
    language: props.lang ?? "html",
  }).value;
});

const shortLang = computed(() => {
  if (props.lang === "javascript") {
    return "JS";
  }
  return props.lang;
});
</script>
