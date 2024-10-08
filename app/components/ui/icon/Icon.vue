<template>
  <component :is="comp" />
</template>

<script setup lang="ts">
import type { IconName } from ".";
import * as all from "./all.js";

const props = defineProps<{
  name: IconName;
}>();

function importName(name: string) {
  const fullName = name.charAt(0).toUpperCase() + name.slice(1) + "Icon";
  if (fullName in all) {
    return fullName as keyof typeof all;
  }

  return "ScanIcon";
}

const comp = computed(() => {
  const name = importName(props.name);
  return all[name];
});
</script>
