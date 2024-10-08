<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Use an iframe srcdoc to parse the input. Show the result as a DOM tree.
    </template>
    <template #options>
      <PipeOption label="Selector">
        <p>
          Enter a css selector to target a specific element. This element will
          serve as the root for the output.
        </p>

        <Input v-model="pipe.opts.selector" placeholder="selector" />
      </PipeOption>

      <PipeOption label="Output">
        <p>
          Choose what to output for the next pipe from the selected element.
        </p>
        <div class="flex items-center gap-2">
          <SearchInput
            v-model="pipe.opts.output"
            label="output"
            :choices="outputChoices"
          />

          <span class="text-sm">- {{ outputDescs[pipe.opts.output] }}</span>
        </div>
      </PipeOption>
    </template>
    <template #render>
      <RenderDocument v-if="!pipe.opts.selector" :fragment="doc" />
      <div v-else-if="node">
        <RenderNode :node="node" />
      </div>
      <div v-else class="bg-muted px-1 text-muted-foreground">
        Selector returned nothing :&lpar;
      </div>
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./TemplateParser.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const parserError = ref<string>();
const selectorError = ref<string>();
const error = computed(() => parserError.value || selectorError.value);

const outputChoices = [
  "source",
  "innerHTML",
  "outerHTML",
  "innerText",
  "textContent",
];

const outputDescs = {
  source: "The original input",
  innerHTML: "The inner html of the element",
  outerHTML: "The outer html of the element",
  innerText: "The inner text of the element",
  textContent: "The text content of the element",
};

const template = computed(() => {
  const template = document.createElement("template");
  template.innerHTML = props.input;
  return template;
});

const doc = computed(() => template.value.content);

const node = computed<Node | null>(() => {
  if (!props.pipe.opts.selector) {
    return null;
  }

  return noClobber(doc.value, "querySelector").call(
    doc.value,
    props.pipe.opts.selector,
  );
});

const result = computed(() => {
  if (!node.value) return "";
  switch (props.pipe.opts.output) {
    case "source":
      return props.input;
    case "innerHTML":
      return noClobber(node.value as HTMLElement, "innerHTML") ?? "";
    case "outerHTML":
      return noClobber(node.value as HTMLElement, "outerHTML") ?? "";
    case "innerText":
      return noClobber(node.value as HTMLElement, "innerText") ?? "";
    case "textContent":
      return noClobber(node.value, "textContent") ?? "";
    default:
      return "";
  }
});

watchEffect(() => {
  emit("update", result.value);
});
</script>
