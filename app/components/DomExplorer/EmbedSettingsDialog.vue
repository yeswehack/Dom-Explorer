<template>
  <DualSheet
    title="Embed Options"
    description="Embed one or more pipeline into your website."
  >
    <template #trigger>
      <slot />
    </template>
    <template #center>
      <Card class="relative max-w-full resize overflow-auto rounded-md">
        <div class="rounded-t-md bg-secondary p-2">
          <CardTitle class="relative flex justify-between gap-2">
            Preview
            <div
              class="absolute -bottom-1 right-0 font-mono text-xs text-muted-foreground"
            >
              {{ Math.ceil(size.width.value) }}x{{
                Math.ceil(size.height.value)
              }}
            </div>
          </CardTitle>
        </div>
        <CardContent ref="frameContent" class="group p-0">
          <DomExplorerFrame :state="_state" />
        </CardContent>
      </Card>
    </template>
    <template #side>
      <div
        class="grid grid-flow-row auto-rows-[minmax(32px,auto)] grid-cols-[auto_1fr] gap-x-8"
      >
        <Label class="content-center"> Input </Label>
        <VisibilitySelect v-model="settings.input" />
        <Label class="content-center"> Title Bar </Label>
        <VisibilitySelect v-model="settings.titleBar" />
        <Label
          class="group col-span-full grid cursor-pointer grid-cols-[subgrid] content-center items-center"
        >
          Readonly
          <Checkbox
            id="readonly-check"
            v-model="settings.readonly"
            class="outline outline-1 outline-transparent transition-all group-hover:outline-blue-400"
          />
        </Label>
        <h2 class="col-span-full pb-2 pt-4 text-lg font-light">
          Pipes Options
        </h2>
        <Label
          class="group col-span-full grid cursor-pointer grid-cols-[subgrid] content-center items-center"
        >
          Title bar
          <Checkbox
            id="readonly-check"
            v-model="settings.pipe.titleBar"
            class="outline outline-1 outline-transparent transition-all group-hover:outline-blue-400"
          />
        </Label>
        <Label
          class="group col-span-full grid cursor-pointer grid-cols-[subgrid] content-center items-center"
        >
          Settings button
          <Checkbox
            id="readonly-check"
            v-model="settings.pipe.settings"
            class="outline outline-1 outline-transparent transition-all group-hover:outline-blue-400"
          />
        </Label>

        <Label
          class="group col-span-full grid cursor-pointer grid-cols-[subgrid] content-center items-center"
        >
          Render button
          <Checkbox
            id="readonly-check"
            v-model="settings.pipe.render"
            class="outline outline-1 outline-transparent transition-all group-hover:outline-blue-400"
          />
        </Label>

        <Label
          class="group col-span-full grid cursor-pointer grid-cols-[subgrid] content-center items-center"
        >
          Skip button
          <Checkbox
            id="readonly-check"
            v-model="settings.pipe.skip"
            class="outline outline-1 outline-transparent transition-all group-hover:outline-blue-400"
          />
        </Label>
      </div>

      <div class="flex flex-col gap-3 pb-4 pt-8">
        <h2 class="col-span-full pb-2 pt-4 text-lg font-light">Code</h2>
        <Textarea
          :model-value="code"
          spellcheck="false"
          class="min-h-24 min-w-0 overflow-auto break-all font-mono"
        />
        <div class="flex justify-between gap-4 pt-2">
          <NuxtLink :to="url" target="_blank">
            <Button label="Open in new tab" icon="externalLink" />
          </NuxtLink>
          <CopyButton :value="code" icon="copy" no-tooltip label="Copy code" />
        </div>
      </div>
    </template>
  </DualSheet>
</template>

<script lang="ts" setup>
import type { DomExplorerState } from "~/types";

const props = defineProps<{
  state: DomExplorerState;
}>();

const _state = ref(cloneState(props.state));

watch(
  () => props.state,
  (state) => {
    _state.value = cloneState(state);
  },
);

const frameContent = ref();
const size = useElementBounding(frameContent);

const settings = createDomExplorerSettings({
  input: "editable",
  titleBar: "readonly",
  readonly: true,
  pipe: {
    titleBar: true,
    settings: true,
    render: true,
    skip: true,
  },
});

const url = computed(() => {
  return resolveRemoteLink({
    name: "frame",
    hash: "#" + b64EncodeUnicode(JSON.stringify(_state.value)),
    query: {
      input: settings.input,
      titleBar: settings.titleBar,
      readonly: settings.readonly ? "true" : "false",
      "pipe[titleBar]": settings.pipe.titleBar ? "true" : "false",
      "pipe[settings]": settings.pipe.settings ? "true" : "false",
      "pipe[render]": settings.pipe.render ? "true" : "false",
      "pipe[skip]": settings.pipe.skip ? "true" : "false",
    },
  });
});

const code = computed(() => {
  const iframe = document.createElement("iframe");
  iframe.sandbox.add("allow-scripts", "allow-modals", "allow-popups");
  iframe.src = url.value;
  return iframe.outerHTML;
});
</script>
