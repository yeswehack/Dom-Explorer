<template>
  <div />
</template>

<script lang="ts" setup>

const route = useRoute();

navigateTo({
  name: "index",
  query: route.query,
  hash: route.hash,
});
</script>
