<template>
  <a
    class="text-primary no-underline hover:underline"
    target="_blank"
    :href="href"
  >
    <slot>{{ label }}</slot>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  label?: string;
}>();
</script>
