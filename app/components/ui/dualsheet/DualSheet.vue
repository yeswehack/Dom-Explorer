<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal force-mount>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent class="group relative z-50" disable-outside-pointer-events>
        <div
          class="fixed inset-0 z-50 grid grid-cols-[400px_1fr] justify-between"
          @click.self="open = false"
        >
          <div
            class="relative w-[400px] overflow-auto bg-background p-6 transition ease-in-out group-data-[state=closed]:duration-300 group-data-[state=open]:duration-500 group-data-[state=open]:animate-in group-data-[state=closed]:animate-out group-data-[state=closed]:slide-out-to-left group-data-[state=open]:slide-in-from-left"
          >
            <DialogHeader class="pb-8">
              <DialogTitle>{{ title }}</DialogTitle>
              <DialogDescription>
                {{ description }}
              </DialogDescription>
            </DialogHeader>
            <slot name="side" />
            <DialogClose
              class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <Icon name="x" class="h-4 w-4" />
            </DialogClose>
          </div>
          <div
            class="self-start p-6 transition ease-in-out group-data-[state=closed]:duration-300 group-data-[state=open]:duration-500 group-data-[state=open]:animate-in group-data-[state=closed]:animate-out group-data-[state=closed]:slide-out-to-top group-data-[state=open]:slide-in-from-top"
          >
            <slot name="center" />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  DialogContent,
} from "radix-vue";

defineProps<{
  title: string;
  description: string;
}>();

const open = defineModel<boolean>("open", { default: false });
</script>
