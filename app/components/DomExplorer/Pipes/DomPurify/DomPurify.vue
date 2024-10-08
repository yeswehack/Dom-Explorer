<template>
  <Pipe :pipe="pipe" :error="error">
    <template #title>
      <span>DomPurify</span>
      <span class="ml-2 text-sm text-muted-foreground">{{
        pipe.opts.version
      }}</span>
    </template>
    <template #description>
      Sanitize the input with
      <ExternalLink
        href="https://github.com/cure53/DOMPurify"
        label="DOMPurify"
      />.
    </template>
    <template #options="{ readOnly }">
      <PipeOption label="Version">
        <p>Select the version to use for DOMPurify.</p>
        <SearchInput
          v-model="pipe.opts.version"
          :read-only="readOnly"
          label="Version"
          :choices="versions"
        />
      </PipeOption>
      <PipeOption label="Options">
        <p>
          The options to pass to DOMPurify, this code will be passed to
          <code>eval()</code>.
        </p>
        <CodeEditor
          v-model="pipe.opts.options"
          :read-only="readOnly"
          lang="javascript"
        />
        <div
          v-if="error"
          class="mt-2 rounded-md bg-destructive p-2 text-destructive-foreground"
        >
          {{ error }}
        </div>
      </PipeOption>
    </template>

    <template #render>
      <RenderHtml :text="result" />
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./DomPurify.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();
const result = ref<string>("");

const versions = usePackageVersions("dompurify");

const sanitize = useSandbox(
  async (imp, version: string, options: string, input: string) => {
    const { default: DOMPurify } = await imp(
      `https://cdn.jsdelivr.net/npm/dompurify@${version}/+esm`
    );
    const parsedOptions = options.trim() ? eval(`(${options})`) : {};
    return DOMPurify.sanitize(input, parsedOptions).toString();
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
