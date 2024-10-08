<template>
  <div>
    <ClientOnly>
      <TooltipProvider>
        <NuxtLayout />
      </TooltipProvider>
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
import "./assets/style.css";
import "highlight.js/styles/github-dark-dimmed.min.css"

</script>

<style lang="scss"></style>
