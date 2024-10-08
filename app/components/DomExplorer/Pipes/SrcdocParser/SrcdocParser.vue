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
      <RenderDocument
        v-if="!pipe.opts.selector && documentElement"
        :fragment="documentElement"
      />
      <div v-else-if="node">
        <RenderNode :node="node" />
      </div>
      <div v-else class="bg-muted px-1 text-muted-foreground">
        Selector returned nothing :&lpar;
      </div>
    </template>
  </Pipe>
</template>

<script setup lang="ts">
import type { Pipe } from "~/types.js";
import type { Opts } from "./SrcdocParser.pipe.js";

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
const result = ref("");
const documentElement = ref<Document>();

const outputChoices = [
  "source",
  "innerHTML",
  "outerHTML",
  "innerText",
  "textContent",
  "content",
];

const outputDescs = {
  source: "The original input",
  innerHTML: "The inner html of the element",
  outerHTML: "The outer html of the element",
  innerText: "The inner text of the element",
  textContent: "The content of the template element",
};

const mounted = useMounted();

let frame: HTMLIFrameElement;

watchEffect(() => {
  if (!mounted) return;
  if (!frame) {
    frame = document.createElement("iframe");
    frame.hidden = true;
    frame.setAttribute("sandbox", "allow-same-origin");
    document.body.appendChild(frame);
  }
  frame.srcdoc = props.input;

  frame.addEventListener(
    "load",
    () => {
      documentElement.value = frame.contentDocument!;
      result.value = frame.contentDocument?.documentElement?.outerHTML || "";
    },
    {
      once: true,
    },
  );
});

onBeforeUnmount(() => {
  frame?.remove();
});

const node = computedEager<Node | null>(() => {
  if (!documentElement.value) {
    return null;
  }
  const doc = documentElement.value;
  if (!props.pipe.opts.selector) {
    return doc.documentElement;
  }
  return noClobber(doc, "querySelector").call(doc, props.pipe.opts.selector);
});

watchEffect(() => {
  emit("update", result.value);
});
</script>
