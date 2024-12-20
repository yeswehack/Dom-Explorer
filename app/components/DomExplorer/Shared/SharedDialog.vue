<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Explorer</DialogTitle>
        <DialogDescription>
          Use the following URL to share the current state of the explorer with
          others.
        </DialogDescription>
      </DialogHeader>
      <div class="flex gap-2">
        <Input v-model="url" readonly />
        <CopyButton :value="url" icon="copy" label="Copy Url" />
      </div>
      <DialogFooter>
        <Button variant="ghost" icon="x" label="Close" @click="open = false" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { DomExplorerState } from "~/types";

const props = defineProps<{
  state: DomExplorerState;
}>();

const open = defineModel<boolean>("open", { default: false });
const shared = useSharedState();
const error = ref("");

const sharedId = ref();

const url = computed(() => {
  if (!sharedId.value) {
    return "";
  }

  return resolveRemoteLink({
    name: "shared",
    query: {
      id: sharedId.value,
    },
  });
});

whenever(open, () => {
  sharedId.value = undefined;
  shared
    .createSharedState(props.state)
    .then((id) => {
      sharedId.value = id;
    })
    .catch((err) => {
      error.value = `${err}`;
    });
});
</script>
