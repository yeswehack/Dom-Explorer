<template>
  <DomExplorerFrame :state="state" is-embed />
</template>

<script setup lang="ts">
import { settingsParser } from "~/types";

definePageMeta({
  layout: "empty",
});

const state = ref(parseStateFromHash());

const route = useRoute();

const params = settingsParser.parse(route.query);

createDomExplorerSettings(params);
</script>
