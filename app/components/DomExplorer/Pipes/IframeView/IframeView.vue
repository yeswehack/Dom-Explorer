<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description> Render the input in an iframe. </template>
    <template #options="{ readOnly }">
      <PipeOption label="Add doctype">
        <p>
          Add the html doctype to the input, without it the parser will be in
          Quirks mode (Chrome only).
        </p>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="pipe.opts.addDoctype" :disabled="readOnly" /> Add
          doctype
        </Label>
      </PipeOption>
      <PipeOption label="Charset">
        <p>
          You can specify the charset of the document. This will change how the
          browser interprets the input.<br />
          If left empty, the browser will use <code>US-ASCII</code>.
        </p>

        <Input
          v-model="pipe.opts.charset"
          :disabled="readOnly"
          placeholder="US-ASCII"
        />
      </PipeOption>
    </template>
    <template #render>
      <div class="relative flex flex-col px-3">
        <Input
          :model-value="src"
          class="rounded-b-none bg-muted px-1.5"
          readonly
        />
        <div
          class="max-w-full resize-y overflow-hidden rounded-b-sm border-4 border-primary bg-white"
        >
          <iframe :src="src" />
        </div>
      </div>
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types.js";
import type { Opts } from "./IframeView.pipe.js";

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();

const src = computed(() => {
  const input = props.pipe.opts.addDoctype
    ? `<!DOCTYPE html>${props.input}`
    : props.input;
  const charset = props.pipe.opts.charset
    ? `;charset=${props.pipe.opts.charset}`
    : "";
  return `data:text/html${charset},${encodeURIComponent(input)}`;
});

watchEffect(() => {
  emit("update", props.input);
});
</script>
