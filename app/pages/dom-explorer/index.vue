<template>
  <LayoutPage>
    <LayoutHeader title="Dom-Explorer">
      <template #right>
        <div class="flex gap-2">
          <SyncModeDialog />
          <PresetsDialog>
            <Button class="h-8">
              <Icon name="bookMarked" class="mr-2" />
              Presets
            </Button>
          </PresetsDialog>
          <PipeCreateButton
            allow-empty
            @create="addPipeline"
            @create-empty="addPipeline"
          >
            <Button class="h-8">
              <Icon name="plus" class="mr-2" />
              Pipeline
            </Button>
          </PipeCreateButton>
        </div>
      </template>
    </LayoutHeader>
    <LayoutContent class="grid grid-rows-[auto_1fr] overflow-auto">
      <div class="sticky top-0 z-10 p-3">
        <CodeEditor
          v-model="state.input"
          placeholder="Enter HTML here..."
          class="rounded-md bg-secondary"
          language="HTML"
          border-radius=".5rem"
          padding="10px"
          width="100%"
          autofocus
          :copy-code="false"
        />
      </div>

      <div class="px-3 pb-2">
        <Pipelines :state="state" />
      </div>
    </LayoutContent>
  </LayoutPage>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types";

const state = ref(parseStateFromHash());

onMounted(() => {
  state.value = parseStateFromHash();
});

const { onMessage, send } = useRTCConnections();
createDomExplorerSettings({
  input: "editable",
  titleBar: "editable",
  readonly: false,
  pipe: {
    settings: true,
    titleBar: true,
    render: true,
    skip: true,
  },
});

function addPipeline(pipe?: Pipe) {
  state.value.pipelines.push({
    id: randomId(),
    name: `Pipeline ${state.value.pipelines.length + 1}`,
    pipes: pipe ? [pipe] : [],
  });
}

onMessage((con, msg) => {
  if (msg.type === "state") {
    if (con.followInput) {
      state.value.input = msg.value.input;
    }
    if (con.followPipelines) {
      state.value.pipelines = msg.value.pipelines;
    }
  }
  if (msg.type === "getState") {
    send({
      type: "state",
      value: state.value,
    });
  }
});

watch(
  () => state.value,
  (state) => {
    navigateTo({
      hash: `#` + b64EncodeUnicode(JSON.stringify(state)),
      replace: true,
    });
    send({
      type: "state",
      value: state,
    });
  },
  { deep: true },
);
</script>

<style lang="scss">
.sortable-swap-highlight {
  @apply relative rounded-lg outline-dashed outline-2 outline-black dark:outline-white;
  &::after {
    @apply absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/5 text-xl font-semibold tracking-wide dark:bg-white/5;
    content: "Swap";
  }
}
</style>
