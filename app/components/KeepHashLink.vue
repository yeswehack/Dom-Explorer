<template>
  <NuxtLink
    v-slot="scope"
    :to="{
      name: to,
      hash: hash ?? route.hash,
      params,
    }"
  >
    <slot v-bind="scope" />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RoutesNamesList } from "@typed-router/__routes";

defineProps<{
  to: RoutesNamesList;
  hash?: string;
  params?: Record<string, string>;
}>();

const route = useRoute();
</script>
