<script setup lang="ts">
import {
  type TooltipContentProps,
  TooltipRoot,
  type TooltipRootEmits,
  type TooltipRootProps,
  useForwardPropsEmits,
} from "radix-vue";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  TooltipRootProps & {
    label?: string;
    side?: TooltipContentProps["side"];
    class?: HTMLAttributes["class"];
  }
>();
const emits = defineEmits<TooltipRootEmits>();

const delegatedProps = computed(() => {
  const { label, side, disabled, class: cls, ...delegated } = props;

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
    <TooltipTrigger ref="trigger" >
      <slot />
    </TooltipTrigger>
    <TooltipContent v-if="label" :side="side" :class="$props.class">
      <p>{{ label }}</p>
    </TooltipContent>
  </TooltipRoot>
</template>
