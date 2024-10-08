<template>
  <div class="flex min-h-0 flex-col gap-2" :class="pipe.skip && 'opacity-50'">
    <div
      v-if="settings.pipe.titleBar"
      class="flex min-h-9 flex-wrap items-center gap-2 pt-1"
    >
      <div class="-ml-3 h-px w-3 bg-border" />
      <div
        class="pipe-handle text-base font-semibold"
        :class="!settings.readonly && 'cursor-grab active:cursor-grabbing'"
      >
        <slot name="title">{{ title }}</slot>
      </div>
      <PipeDialog
        v-if="settings.pipe.settings"
        :pipe="pipe"
        :read-only="settings.readonly"
      >
        <template #description="scope">
          <slot v-bind="scope" name="description" />
        </template>
        <template #options="scope">
          <slot v-bind="scope" name="options" />
        </template>
      </PipeDialog>
      <div class="ml-auto flex items-center gap-2 transition-opacity">
        <ToggleGroup
          v-model="innerModel"
          class="ml-auto"
          type="multiple"
          variant="outline"
        >
          <Tooltip label="Hide">
            <ToggleGroupItem
              v-if="settings.pipe.render && !pipe.skip"
              value="hide"
              aria-label="Toggle render"
              class="group size-7 p-1"
            >
              <Icon name="eye" class="size-4 group-data-[state=on]:hidden" />
              <Icon
                name="eyeOff"
                class="size-4 group-data-[state=off]:hidden"
              />
            </ToggleGroupItem>
          </Tooltip>
          <Tooltip label="Skip">
            <ToggleGroupItem
              v-if="settings.pipe.skip"
              value="skip"
              aria-label="Toggle skip"
              class="size-7 p-1 data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground"
            >
              <Icon name="ban" class="size-4" />
            </ToggleGroupItem>
          </Tooltip>
        </ToggleGroup>
        <Button
          v-if="!settings.readonly"
          class="size-7 border border-input hover:border-destructive"
          size="icon"
          variant="ghost-destructive"
          @click="emit('delete')"
        >
          <Icon name="trash" class="size-4" />
        </Button>
      </div>
    </div>
    <div v-else />
    <div
      v-if="error"
      class="rounded-md bg-destructive p-2 text-destructive-foreground"
    >
      <pre>{{ error }}</pre>
    </div>
    <slot v-else-if="!pipe.skip && !pipe.hide" name="render" />
  </div>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types";

const props = defineProps<{
  pipe: Pipe;
  title?: string;
  error?: string;
}>();

const settings = useDomExplorerSettings();

const emit = defineEmits<{
  delete: [];
}>();

const title = computed(() => {
  return props.title || props.pipe.name;
});

const innerModel = computed<string[]>({
  get() {
    const r = [];
    if (props.pipe.hide) {
      r.push("hide");
    }
    if (props.pipe.skip) {
      r.push("skip");
    }

    return r;
  },
  set(value: string[]) {
    props.pipe.skip = value.includes("skip");
    props.pipe.hide = value.includes("hide");
  },
});
</script>
