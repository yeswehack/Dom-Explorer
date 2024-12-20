<template>
  <header
    :class="
      cn(
        'sticky top-0 z-20 flex h-14 w-full border-b bg-background backdrop-blur',
        $props.class,
      )
    "
  >
    <div class="flex flex-1 items-center px-4 pl-1">
      <NuxtLink to="/" class="flex items-center justify-center gap-4 p-4">
        <DomExplorerIcon class="size-8" />
        <h1 class="hidden text-nowrap font-semibold sm:inline">{{ title }}</h1>
      </NuxtLink>
      <slot>
        <div class="flex-1" />
        <slot name="right" />
        <a href="https://yeswehack.com/" target="_blank">
          <Button variant="ghost" size="icon" class="ml-4">
            <YwhIcon class="size-5" w-class="text-[#e60000]" />
          </Button>
        </a>
      </slot>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";
import type { HTMLAttributes } from "vue";

defineProps<{
  title?: string;
  class?: HTMLAttributes["class"];
}>();
</script>
