<template>
  <LayoutPage>
    <LayoutHeader title="Mutations Gallery"> </LayoutHeader>
    <LayoutContent class="relative flex flex-col overflow-y-auto p-4">
      <template v-for="(exemple, idx) of examples" :key="idx">
        <Separator v-if="idx > 0" class="mb-6 mt-32" />
        <Component :is="exemple" />
      </template>
      <div class="min-h-[50vh]">&nbsp;</div>
    </LayoutContent>
  </LayoutPage>
</template>

<script lang="ts" setup>
import examples from "../components/Gallery/Examples";
</script>
