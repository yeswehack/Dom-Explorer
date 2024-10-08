<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Sanitize the input with
      <ExternalLink href="https://jsxss.com/en/index.html" label="JS XSS" />.
    </template>
    <template #options>
      <PipeOption label="Version">
        <p>Select the version to use for jsxss.</p>
        <SearchInput
          v-model="pipe.opts.version"
          label="Version"
          :choices="versions"
        />
      </PipeOption>
    </template>
    <template #render>
      <RenderHtml :text="result" />
    </template>
  </Pipe>
</template>
<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./JsXss.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();
const result = ref<string>("");

const versions = usePackageVersions("xss");

const sanitize = useSandbox(
  async (imp, version: string, options: string, input: string) => {
    const { default: xss } = await imp(
      `https://cdn.jsdelivr.net/npm/xss@${version}/+esm`,
    );
    const parsedOptions = options.trim() ? eval(options) : {};
    return xss(input, parsedOptions);
  },
);

watchEffect(() => {
  sanitize(props.pipe.opts.version, props.pipe.opts.options, props.input)
    .then((res) => {
      result.value = res;
      error.value = "";
    })
    .catch((e) => {
      error.value = `${e}`;
      result.value = "";
    });
});

watchEffect(() => {
  emit("update", result.value);
});
</script>
