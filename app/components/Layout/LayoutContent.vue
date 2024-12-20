<template>
  <div
    :class="cn('relative h-[calc(100dvh-56px)] bg-white/5 px-1.5 sm:px-4  md:px-8 ', $props.class)"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";
import type { HTMLAttributes } from "vue";
defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
