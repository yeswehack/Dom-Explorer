<script setup lang="ts">
import {
  Primitive,
  type PrimitiveProps,
  type TooltipContentProps,
} from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "~/utils";
import { buttonIconVariants, type ButtonVariants, buttonVariants } from ".";
import type { IconName } from "../icon";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  icon?: IconName;
  iconClass?: HTMLAttributes["class"];
  label?: string;
  tooltip?: string;
  tooltipSide?: TooltipContentProps["side"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <DefineTemplate>
    <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn(buttonVariants({ variant, size }), props.class)"
      v-bind="$attrs"
    >
      <Icon
        v-if="icon"
        :name="icon"
        :class="cn(buttonIconVariants({ variant, size }), iconClass)"
      />
      <slot>{{ label }}</slot>
    </Primitive>
  </DefineTemplate>
  <Tooltip v-if="tooltip" :label="tooltip" :side="tooltipSide">
    <ReuseTemplate />
  </Tooltip>
  <ReuseTemplate v-else />
</template>
