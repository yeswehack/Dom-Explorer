<template>
  <div>
    <h2 class="pt-1 text-sm font-bold">{{ label }}</h2>
  </div>
  <div class="pipe-option">
    <slot />
  </div>
  <Separator class="col-span-full bg-primary/20 last-of-type:hidden my-2" />
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
:slotted(p) {
  @apply prose pb-4 dark:prose-invert;
}
</style>
