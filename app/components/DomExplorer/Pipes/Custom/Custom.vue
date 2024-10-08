<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Create a custom parser with javascript. Your code is run inside a function
      that must return a string.
    </template>
    <template #options>
      <PipeOption label="Source">
        <div class="col-span-full">
          <p>
            Enter the code source for your function. You can use the
            <code>input</code> variable.
          </p>
          <pre
            v-if="error"
            class="mb-2 flex flex-col gap-2 rounded-md border border-red-500 p-2 text-red-500"
            >{{ error }}</pre
          >
        </div>
        <CodeEditor v-model="pipe.opts.code" lang="javascript" />
      </PipeOption>
    </template>
    <template #render>
      <RenderHtml :text="result" />
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./Custom.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();

const result = ref<string>("");

const sanitize = useSandbox(async (imp, code: string, input: string) => {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  return new AsyncFunction("input", code)(input);
});

watch(
  [() => props.pipe.opts.code, () => props.input],
  ([code, input]) => {
    sanitize(code, input)
      .then((res) => {
        result.value = `${res}`;
        error.value = "";
      })
      .catch((e) => {
        error.value = `${e}`;
        result.value = "";
      });
  },
  { immediate: true },
);

watchEffect(() => {
  emit("update", result.value);
});
</script>
