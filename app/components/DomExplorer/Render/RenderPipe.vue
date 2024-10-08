<template>
  <Suspense>
    <component :is="component" :pipe="pipe" v-bind="$attrs"/>
  </Suspense>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types";

const props = defineProps<{
  pipe: Pipe;
}>();

defineOptions({
  inheritAttrs: false,
});

const component = computed(() => {
  return defineAsyncComponent(
    () => import(`../Pipes/${props.pipe.name}/${props.pipe.name}.vue`),
  );
});
</script>
