<template>
  <Button class="h-8 w-8 p-0 lg:w-auto lg:px-4 lg:py-2" :tooltip="tooltip" tooltip-side="bottom">
    <Icon :name="icon" class="lg:mr-2" />
    <span class="hidden lg:inline"> {{ label }} </span>
  </Button>
</template>

<script setup lang="ts">
import type { IconName } from "./ui/icon";

const props = defineProps<{
  icon: IconName;
  label: string;
}>();

const windowSize = useWindowSize();

const tooltip = computed(() => {
  return windowSize.width.value > 1024 ? undefined : props.label;
});
</script>
