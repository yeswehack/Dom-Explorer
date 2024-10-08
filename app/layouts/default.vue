<template>
  <div class="grid h-screen w-full sm:pl-14">
    <aside
      class="fixed left-0 top-0 z-20 flex h-14 w-14 flex-col border-r border-border bg-background sm:bottom-0 sm:h-auto"
    >
      <NuxtLink
        to="/"
        class="grid h-14 w-14 items-center justify-center border-b"
      >
        <DomExplorerIcon class="size-8" />
      </NuxtLink>
      <nav class="hidden flex-1 flex-col gap-1 p-2 sm:flex">
        <MenuButton
          v-for="link of links"
          :key="link.to"
          :icon="link.icon"
          :to="link.to"
          :label="link.name"
        />
        <div class="flex-1" />
      </nav>
    </aside>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { CodeIcon, ScanTextIcon } from "lucide-vue-next";

const links = [
  { name: "Dom-Explorer", icon: CodeIcon, to: "dom-explorer" },
  { name: "Embed", icon: ScanTextIcon, to: "dom-explorer-embed-id" },
] as const;
</script>
