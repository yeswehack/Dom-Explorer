<template>
  <LayoutPage>
    <LayoutHeader title="Dom-Explorer">
      <template #right>
        <div class="flex gap-2">
          <SyncDialog v-if="false">
            <Button class="h-8">
              <Icon name="network" class="mr-2" /> Sync
            </Button>
          </SyncDialog>
          <PresetsDialog>
            <Button class="h-8">
              <Icon name="settings" class="mr-2" />
              Presets
            </Button>
          </PresetsDialog>
        </div>
      </template>
    </LayoutHeader>
    <LayoutContent class="p-4">
      <div class="flex gap-8">
        <Card class="sticky top-[72px] min-w-[400px] self-start">
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>
              Embed Dom-Explorer in your website,<br />
              use the options to customize the features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              class="grid grid-flow-row auto-rows-[minmax(32px,auto)] grid-cols-[auto_1fr] gap-x-8 px-4"
            >
              <h2 class="col-span-full pb-2 text-lg font-light">
                Pipeline Options
              </h2>
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

            <div class="flex flex-col gap-3 px-4 pb-4 pt-8">
              <Textarea
                :model-value="code"
                spellcheck="false"
                class="min-h-24 min-w-0 overflow-auto break-all font-mono"
              />
              <div class="flex items-center gap-4 self-end">
                <NuxtLink :to="url" target="_blank">
                  <Button> Open </Button>
                </NuxtLink>
                <CopyButton v-slot="slotProps" :value="code">
                  <Button @click="slotProps.copy">
                    <Icon name="copy" class="mr-2" />
                    Copy Code
                  </Button>
                </CopyButton>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          class="relative mb-8 min-w-[400px] self-start overflow-clip rounded-md border"
        >
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
          <CardContent
            ref="frameContent"
            class="group min-w-[400px] resize overflow-auto p-0"
          >
            <DomExplorerFrame :state="state" :filter="route.params.id" />
          </CardContent>
        </Card>
      </div>
    </LayoutContent>
  </LayoutPage>
</template>

<script lang="ts" setup>
const route = useRoute("dom-explorer-embed-id");
const state = ref(parseStateFromHash());

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

const frameContent = ref();
const size = useElementBounding(frameContent);
const router = useRouter();

const url = computed(() => {
  const url = router.resolve({
    name: "dom-explorer-frame",
    hash: b64EncodeUnicode(JSON.stringify(state.value)),
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

  return new URL(url.href, window.origin).href;
});

const code = computed(() => {
  const iframe = document.createElement("iframe");
  iframe.sandbox.add("allow-scripts", "allow-modals", "allow-popups");
  iframe.src = url.value;
  return iframe.outerHTML;
});
</script>

<style lang="scss" scoped></style>
