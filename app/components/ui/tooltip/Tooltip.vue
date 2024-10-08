<script setup lang="ts">
import {
  type TooltipContentProps,
  TooltipRoot,
  type TooltipRootEmits,
  type TooltipRootProps,
  useForwardPropsEmits,
} from "radix-vue";

const props = defineProps<
  TooltipRootProps & {
    label?: string;
    side?: TooltipContentProps["side"];
  }
>();
const emits = defineEmits<TooltipRootEmits>();

const delegatedProps = computed(() => {
  const { label, side, disabled, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const trigger = ref();
const hover = useMouseInElement(trigger);

const open = computed(() => {
  return !props.disabled && !hover.isOutside.value;
});
</script>

<template>
  <TooltipRoot v-bind="forwarded" :open="open">
    <TooltipTrigger ref="trigger">
      <slot />
    </TooltipTrigger>
    <TooltipContent v-if="label" :side="side">
      <p>{{ label }}</p>
    </TooltipContent>
  </TooltipRoot>
</template>
