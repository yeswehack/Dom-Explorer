<template>
  <Dialog>
    <DialogTrigger>
      <Button
        size="iconSm"
        variant="ghost"
        :icon="readOnly ? 'settings' : 'settings'"
      />
    </DialogTrigger>
    <DialogContent
      class="max-h-[calc(100dvh-2rem)] w-max max-w-[calc(100vw-2rem)] overflow-auto"
    >
      <DialogHeader class="pb-4">
        <DialogTitle class="text-xl capitalize tracking-wide">
          {{ pipe.name }}
        </DialogTitle>
      </DialogHeader>

      <div class="pb-4">
        <p class="prose dark:prose-invert">
          <slot name="description" />
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-[auto_1fr]">
        <slot :read-only="readOnly" name="options" />
      </div>
      <DialogFooter>
        <DialogClose>
          <Button size="sm" label="Close" />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Pipe } from "~/types";

defineProps<{
  pipe: Pipe;
  readOnly?: boolean;
}>();
</script>
