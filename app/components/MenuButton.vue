<template>
  <Tooltip :delay-duration="0" :label="label" side="right">
    <KeepHashLink v-slot="{ isActive }" :to="to">
      <Button
        variant="ghost"
        size="icon"
        :class="
          cn(
            'hover:border-1 relative rounded-lg border hover:border-primary hover:bg-secondary',
            isActive && 'border-2 border-primary',
            isActive ? btnActiveClass : btnClass,
          )
        "
        @click="emit('click')"
      >
        <slot>
          <component :is="icon" class="size-5" />
        </slot>
        <div
          v-if="alert"
          class="potision absolute -right-1.5 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive p-2 text-xs text-destructive-foreground"
        >
          {{ alert }}
        </div>
      </Button>
    </KeepHashLink>
  </Tooltip>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";
import type { RoutesNamesList } from "@typed-router/__routes";
import type { Component } from "vue";

defineProps<{
  icon?: Component;
  label: string;
  alert?: number;
  to: RoutesNamesList;
  btnClass?: string;
  btnActiveClass?: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>
