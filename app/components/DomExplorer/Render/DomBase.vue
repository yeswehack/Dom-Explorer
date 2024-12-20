<template>
  <div
    :class="cn('flex flex-col border-l font-mono', borderColor, $props.class)"
  >
    <div
      v-show="!hideName"
      class="flex p-px pl-1 pr-2 leading-tight"
      :class="bgColor"
    >
      <div class="flex flex-wrap">
        <span v-if="prefix" class="text-muted-foreground/50">{{ prefix }}</span>
        <span class="empty:hidden" :class="color">{{ tag }}</span>
        <slot name="attrs" />
        <span v-if="suffix" class="text-muted-foreground/50">{{ suffix }}</span>
      </div>
      <div class="ml-auto self-start" :class="color">
        {{ showNs ? shortNs : "" }} {{ showDepth ? depth : "" }}
      </div>
    </div>
    <div class="flex flex-col pl-3 empty:hidden" :class="indentRight && 'pr-1'">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";

const props = withDefaults(
  defineProps<{
    prefix?: string;
    suffix?: string;
    tag?: string;
    ns?: string;
    class?: HTMLElement["className"];
    hideName?: boolean;
    depth?: number;
  }>(),
  {
    prefix: "<",
    suffix: ">",
    tag: "",
    ns: "",
    class: "",
  },
);

const { showDepth, showNs, indentRight } = useUserSettings();

const shortNs = computed(() => {
  switch (props.ns) {
    case "http://www.w3.org/1999/xhtml":
      return "xhtml";
    case "http://www.w3.org/2000/svg":
      return "svg";
    case "http://www.w3.org/1998/Math/MathML":
      return "mathml";
    default:
      return props.ns;
  }
});

const color = computed(() => {
  switch (shortNs.value) {
    case "xhtml":
      return "text-blue-500 ";
    case "svg":
      return "text-green-500 ";
    case "mathml":
      return "text-yellow-500 ";
    default:
      return "text-gray-500 ";
  }
});

const bgColor = computed(() => {
  switch (shortNs.value) {
    case "xhtml":
      return "bg-blue-500/10";
    case "svg":
      return "bg-green-500/10";
    case "mathml":
      return "bg-yellow-500/10";
    default:
      return "bg-gray-500/10";
  }
});

const borderColor = computed(() => {
  switch (shortNs.value) {
    case "xhtml":
      return "border-blue-500/20";
    case "svg":
      return "border-green-500/20";
    case "mathml":
      return "border-yellow-500/20";
    default:
      return "border-gray-500/20";
  }
});
</script>
