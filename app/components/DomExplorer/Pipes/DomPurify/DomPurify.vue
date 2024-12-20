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
      <PipeOption label="Hooks">
        <p>
          If you need to add some hooks to DOMPurify before sanitizing the
          input, you can use this field. Don't forget to call
          <code>removeAllHooks</code> since the function will be called
          everytime the input change.
        </p>
        <CodeEditor
          v-model="pipe.opts.hooks"
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
import { hooksTemplate, type Opts } from "./DomPurify.pipe.js";

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
  async (imp, opts: Opts, input: string, hooksTemplate: string) => {
    const { default: DOMPurify } = await imp(
      `https://cdn.jsdelivr.net/npm/dompurify@${opts.version}/+esm`,
    );
    const parsedOptions = opts.options.trim() ? eval(`(${opts.options})`) : {};

    if (opts.hooks && opts.hooks !== hooksTemplate) {
      const parsedHooks = opts.hooks.trim() ? eval(`(${opts.hooks})`) : {};
      if (parsedHooks && typeof parsedHooks === "function") {
        parsedHooks(DOMPurify);
      }
    }

    return DOMPurify.sanitize(input, parsedOptions).toString();
  },
  () => {},
);

watchEffect(() => {
  sanitize(toRaw(props.pipe.opts), props.input, hooksTemplate)
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
