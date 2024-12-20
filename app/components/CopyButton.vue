<template>
  <Button :tooltip="_tooltip" :icon="_icon" :label="_label" @click="copy" />
</template>

<script lang="ts" setup>
import type { IconName } from "./ui/icon";

const props = defineProps<{
  value: string;
  noTooltip?: boolean;
  tooltip?: string;
  icon?: IconName;
  label?: string;
}>();

const copied = refAutoReset(false, 1000);

function copy() {
  copied.value = true;
  navigator.clipboard.writeText(props.value);
}

const _tooltip = computed(() => {
  if (!props.tooltip) return undefined;
  return copied.value ? "Copied!" : props.tooltip;
});

const _label = computed(() => {
  if (!props.label) return undefined;
  return copied.value ? "Copied" : props.label;
});

const _icon = computed(() => {
  if (!props.icon) return undefined;
  return copied.value ? "check" : props.icon;
});
</script>
