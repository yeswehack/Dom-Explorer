<template>
  <LayoutPage>
    <LayoutHeader title="Dom-Explorer">
      <template #right>
        <div class="flex gap-2">
          <UserSettingsDialog>
            <TitleButton icon="settings" label="Settings" />
          </UserSettingsDialog>
          <TitleButton
            icon="scanText"
            label="Embed"
            @click="openEmbedSettings()"
          />
          <SyncModeDialog v-model:open="synchedTabsOpen" >
            <TitleButton
              icon="cable"
              :label="syncCount ? `Sync Tabs (${syncCount})` : 'Sync Tabs'"
            />
          </SyncModeDialog>
          <SharedDialog :state="state">
            <TitleButton icon="link" label="Share" />
          </SharedDialog>
          <TitleButton
            icon="bookMarked"
            label="Presets"
            @click="openPresetDialog(undefined)"
          />
          <PipeCreateButton align="end" allow-empty @create="addPipeline">
            <TitleButton icon="plus" label="Pipeline" />
          </PipeCreateButton>
        </div>
      </template>
    </LayoutHeader>
    <LayoutContent class="grid grid-rows-[auto_1fr] overflow-auto">
      <div
        class="sticky top-0 z-10 flex flex-col gap-2 pt-3 backdrop-blur-sm sm:flex-row sm:items-start"
      >
        <div class="flex-1">
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
        <SavedInputsButtons v-model="state.input" />
      </div>
      <div class="pt-3">
        <Pipelines
          :state="state"
          @embed-pipeline="openEmbedSettings"
          @save-as-preset="openPresetDialog"
        />
      </div>
    </LayoutContent>

    <PresetsDialog v-model:open="presetDialogOpen" :pipeline="presetPipeline" />
    <EmbedSettingsDialog
      v-model:open="embedSettingsOpen"
      :settings="settings"
      :state="embedState"
    />
  </LayoutPage>
</template>

<script lang="ts" setup>
import { createPipe, type Pipe, type Pipeline } from "~/types";

const state = ref(parseStateFromHash());

const embedState = ref(cloneState(state.value));
const presetPipeline = ref<Pipeline>();
const route = useRoute();

onMounted(() => {
  state.value = parseStateFromHash();
});

const settings = createDomExplorerSettings({
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

const { addDomParser } = useUserSettings();

function addPipeline(pipes: Pipe[]) {
  if (addDomParser.value) {
    pipes.push(createPipe("DomParser"));
  }
  state.value.pipelines.push({
    id: randomId(),
    name: `Pipeline ${state.value.pipelines.length + 1}`,
    pipes: pipes,
  });
}

// DIALOGS

const embedSettingsOpen = ref(false);
const presetDialogOpen = ref(false);
const synchedTabsOpen = ref(false);

function openEmbedSettings(pipeline?: Pipeline) {
  if (pipeline) {
    embedState.value = {
      input: state.value.input,
      pipelines: [clonePipeline(pipeline)],
    };
  } else {
    embedState.value = cloneState(state.value);
  }
  embedSettingsOpen.value = true;
}

function openPresetDialog(pipeline?: Pipeline) {
  if (pipeline) {
    presetPipeline.value = pipeline;
  } else {
    presetPipeline.value = undefined;
  }
  presetDialogOpen.value = true;
}

// SYNC

const { onMessage, send, joinRoom, connections } = useSyncTabs();

const syncCount = computed(() => {
  return connections.value.filter((con) => con.state === "connected").length;
});
onMessage((con, msg) => {
  if (msg.type === "state") {
    ignoreUpdates(() => {
      if (con.followInput) {
        state.value.input = msg.value.input;
      }
      if (con.followPipelines) {
        state.value.pipelines = msg.value.pipelines;
      }
    });
  }
  if (msg.type === "getState") {
    send({
      type: "state",
      value: state.value,
    });
  }
});

const { ignoreUpdates } = ignorableWatch(
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

onMounted(() => {
  if (typeof route.query.sync === "string" && route.query.sync) {
    joinRoom(route.query.sync as string).then((con) => {
      con.followInput = true;
      con.followPipelines = true;
      con.onOpen(() => {
        send({ type: "getState" });
        synchedTabsOpen.value = false;
      });
    });
    synchedTabsOpen.value = true;
  }
});
</script>

<style>
.sortable-swap-highlight {
  @apply relative rounded-lg outline-dashed outline-2 outline-black dark:outline-white;
  &::after {
    @apply absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/5 text-xl font-semibold tracking-wide dark:bg-white/5;
    content: "Swap";
  }
}
</style>
