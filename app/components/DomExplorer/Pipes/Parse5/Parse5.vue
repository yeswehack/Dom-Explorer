<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Parse the input with
      <ExternalLink href="https://github.com/inikulin/parse5" label="Parse5" />,
      the parser behind
      <ExternalLink href="https://github.com/jsdom/jsdom" label="JSDom" />.
      Output the result as HTML.
    </template>
    <template #options>
      <PipeOption label="Version">
        <p>Select the version to use for Parse5.</p>
        <SearchInput
          v-model="pipe.opts.version"
          label="Version"
          :choices="versions"
        />
      </PipeOption>
      <PipeOption label="Fragment">
        <p>
          Parse the input with <code>parse5.parseFragment</code> instead of
          <code>parse5.parse</code>.
        </p>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="pipe.opts.fragment" label="Fragment" />
          as Fragment
        </Label>
      </PipeOption>
    </template>
    <template #render>
      <RenderHtml :text="result" />
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./Parse5.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();
const result = ref<string>("");

const versions = usePackageVersions("parse5");

const parse = useSandbox(
  async (imp, version: string, fragment: boolean, input: string) => {
    const Parse5 = await imp(
      `https://cdn.jsdelivr.net/npm/parse5@${version}/+esm`,
    );
    const parsed = fragment ? Parse5.parseFragment(input) : Parse5.parse(input);

    return Parse5.serialize(parsed);
  },
);

watchEffect(() => {
  parse(props.pipe.opts.version, props.pipe.opts.fragment, props.input)
    .then((parsed) => {
      result.value = parsed;
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
