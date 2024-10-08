<template>
  <div
    :class="cn('relative min-h-[calc(100dvh-56px)] bg-white/5', $props.class)"
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
