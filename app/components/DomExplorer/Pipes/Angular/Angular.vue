<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      Use
      <ExternalLink
        label="Angular DomSanitizer"
        href="https://angular.dev/api/platform-browser/DomSanitizer"
      />
      to sanitize the input and display the result.
    </template>
    <template #options>
      <PipeOption label="Parser type">
        <p>Choose the sanitizer context to use for Angular.</p>
        <div class="flex items-center gap-2">
          <SearchInput
            v-model="pipe.opts.context"
            label="Parser type"
            :choices="choices"
          />
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
import type { Opts } from "./Angular.pipe.js";

const angularSecurityContext = {
  NONE: 0,
  HTML: 1,
  STYLE: 2,
  SCRIPT: 3,
  URL: 4,
  RESOURCE_URL: 5,
};

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const error = ref<string>();
let frame: HTMLIFrameElement | undefined = undefined;
const result = ref("");
const currentId = ref("");

const { app } = useRuntimeConfig();

onMounted(() => {
  frame = document.createElement("iframe");
  frame.src = `${app.baseURL}/angular/index.html`;
  frame.classList.add("hidden");
  frame.addEventListener("load", sendInput);
  document.body.appendChild(frame);
});

onUnmounted(() => frame?.remove());

const choices = ["NONE", "HTML", "STYLE", "SCRIPT", "URL", "RESOURCE_URL"];

window.addEventListener("message", (event) => {
  if (event.source !== frame?.contentWindow) return;
  if (event.data.id === currentId.value) {
    if (event.data.error) {
      error.value = event.data.error;
    } else {
      error.value = undefined;
      result.value = `${event.data.result}`;
      emit("update", result.value);
    }
  }
});

function sendInput() {
  currentId.value = randomId(16);
  frame?.contentWindow?.postMessage(
    {
      id: currentId.value,
      html: props.input,
      context: angularSecurityContext[props.pipe.opts.context],
      from: "DOMExplorer",
    },
    "*",
  );
}

watch(() => props.input, sendInput, { immediate: true });
</script>
