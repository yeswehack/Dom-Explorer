<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Parse the input with
      <code>
        <ExternalLink
          href="https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString"
          label="DOMParser"
        />
      </code>
      and display the result as a tree.
    </template>

    <template #options="{ readOnly }">
      <PipeOption label="MimeType">
        <p>
          Choose the mimetype to use for
          <code>DOMParser.parseFromString()</code>. This will change the type of
          parser used.
        </p>
        <div class="flex items-center gap-2">
          <SearchInput
            v-model="pipe.opts.type"
            :read-only="readOnly"
            label="Parser type"
            :choices="typeChoices"
          />

          <span class="text-sm"
            >-
            {{
              pipe.opts.type === "text/html" ? "HTML Parser" : "XML Parser"
            }}</span
          >
        </div>
      </PipeOption>
      <PipeOption label="Add doctype">
        <p>
          Add the html doctype to the input before parsing, without it the
          parser will be in Quirks mode.
        </p>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="pipe.opts.addDoctype" :disabled="readOnly" /> Add
          doctype
        </Label>
      </PipeOption>
      <PipeOption label="Selector">
        <p>
          Enter a css selector to target a specific element. This element will
          serve as the root for the output.
        </p>

        <Input
          v-model="pipe.opts.selector"
          :disabled="readOnly"
          placeholder="selector"
        />
      </PipeOption>
      <PipeOption label="Output">
        <p>
          Choose what to output for the next pipe from the selected element.
        </p>
        <div class="flex items-center gap-2">
          <SearchInput
            v-model="pipe.opts.output"
            :read-only="readOnly"
            label="output"
            :choices="outputChoices"
          />

          <span class="text-sm">- {{ outputDescs[pipe.opts.output] }}</span>
        </div>
      </PipeOption>
    </template>

    <template #render>
      <RenderNode v-if="node" :node="node" />
      <div v-else class="bg-muted px-1 text-muted-foreground">
        Selector returned nothing :&lpar;
      </div>
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./DomParser.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const parserError = ref<string>();
const selectorError = ref<string>();
const outputError = ref<string>();
const error = computed(
  () => parserError.value || selectorError.value || outputError.value,
);

const typeChoices = [
  "application/xhtml+xml",
  "application/xml",
  "image/svg+xml",
  "text/html",
  "text/xml",
];

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

const node = ref<Node>();
const result = ref("");

watchEffect(() => {
  selectorError.value = "";
  parserError.value = "";

  let doc: Document;

  const parser = new DOMParser();
  try {
    const source = props.pipe.opts.addDoctype
      ? `<!DOCTYPE html>${props.input}`
      : props.input;
    doc = parser.parseFromString(source, props.pipe.opts.type);
  } catch (e) {
    parserError.value = `${e}`;
    node.value = undefined;
    result.value = "";
    return;
  }

  if (props.pipe.opts.selector) {
    try {
      node.value =
        noClobber(doc, "querySelector").call(doc, props.pipe.opts.selector) ??
        undefined;
      if (!node.value) {
        return;
      }
    } catch (e) {
      selectorError.value = `${e}`;
      result.value = "";
      return;
    }
  } else {
    node.value = doc;
  }

  const el =
    node.value instanceof Document ? node.value.documentElement : node.value;

  switch (props.pipe.opts.output) {
    case "source":
      result.value = props.input;
      break;
    case "innerHTML":
      result.value = noClobber(el as HTMLElement, "innerHTML") ?? "";
      break;
    case "outerHTML":
      result.value = noClobber(el as HTMLElement, "outerHTML") ?? "";
      break;
    case "innerText":
      result.value = noClobber(el as HTMLElement, "innerText") ?? "";
      break;
    case "textContent":
      result.value = noClobber(el, "textContent") ?? "";
      break;
    default:
      result.value = "";
      break;
  }
});

watchEffect(() => {
  emit("update", result.value);
});
</script>
