<template>
  <div ref="container" :class="cn('min-h-8 transition-all', $props.class)">
    <div
      v-for="(item, index) of items"
      :id="item.id"
      :key="item.id"
      :ref="bindData(item)"
      :data-id="item.id"
      :class="itemClass"
    >
      <slot name="item" :item="item" :index="index" :grabbing="grabbing" />
    </div>
  </div>
</template>

<script generic="T extends { id: string }" lang="ts" setup>
import { cn } from "~/utils";
import type { HTMLAttributes } from "vue";
import { useSortableData } from "./SortableData.js";
import Sortable from "sortablejs";

const props = defineProps<{
  group: string;
  disabled?: boolean;
  handle?: string;
  swap?: boolean;
  animation?: number;
  itemClass?: HTMLAttributes["class"];
  removeOnSpill?: boolean;
  class?: HTMLAttributes["class"];
  clonable?: boolean;
  items: T[];
}>();

const container = ref<HTMLElement>();

const ctrl = useKeyModifier("Control");
const sortableData = useSortableData();
const grabbing = ref(false);

function bindData(data: T) {
  return (el: HTMLElement | null) => {
    if (!el) return;
    sortableData.set(el, data);
    return ref();
  };
}

let sortable: Sortable | null = null;

function updateItems() {
  const newItems = Array.from(container.value?.children ?? [])
    .map((el) => sortableData.get(el))
    .filter(Boolean);

  props.items.length = 0;
  props.items.push(...newItems);
}

function updateSortable() {
  sortable?.destroy();
  const el = container.value;
  if (!el) return;
  sortable = Sortable.create(el, {
    removeCloneOnHide: true,
    group: {
      name: props.group,
      pull: () => {
        return props.clonable && ctrl.value ? "clone" : true;
      },
    },
    disabled: props.disabled,
    sort: true,
    swap: props.swap,
    delay: 0,

    removeOnSpill: props.removeOnSpill,
    animation: props.animation ?? 150,
    easing: "cubic-bezier(1, 0, 0, 1)",
    swapClass: "sortable-swap-highlight",
    filter: "no-drag",
    handle: props.handle,
    onSort(evt) {
      evt.preventDefault();
      nextTick(updateItems);
    },
    onClone(evt) {
      evt.preventDefault();
    },
    onSpill(evt) {
      evt.preventDefault();
      nextTick(updateItems);
    },
    onStart(evt) {
      evt.preventDefault();
      grabbing.value = true;
    },
    onEnd(evt) {
      evt.preventDefault();
      grabbing.value = false;
    },
  });
}

onMounted(updateSortable);
watch(() => props.items, updateSortable);
watchEffect(updateSortable);

onBeforeUnmount(() => {
  sortable?.destroy();
});
</script>
