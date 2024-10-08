<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Sanitize the input with
      <ExternalLink
        href="https://github.com/google/safevalues"
        label="safevalues"
      />
      and return the result.
    </template>

    <template #options>
      <PipeOption label="Version">
        <p>Select the version to use for safevalues.</p>
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
import type { Opts } from "./SafeValues.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();
const result = ref<string>("");

const versions = usePackageVersions("safevalues");

const sanitize = useSandbox(async (imp, version: string, input: string) => {
  const { sanitizeHtml } = await imp(
    `https://cdn.jsdelivr.net/npm/safevalues@${version}/+esm`,
  );
  return sanitizeHtml(input);
});

watchEffect(() => {
  sanitize(props.pipe.opts.version, props.input)
    .then((res) => {
      result.value = `${res}`;
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
