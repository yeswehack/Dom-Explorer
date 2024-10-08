<template>
  <DomBase prefix="<!DOCTYPE" suffix=">" class="bg-red-600/5">
    <template #attrs>
      <span class="px-2 text-muted-foreground">
        {{ doctype.name }} {{ doctype.publicId }} {{ doctype.systemId }}</span
      >
    </template>
  </DomBase>
</template>

<script lang="ts" setup>
defineProps<{
  doctype: DocumentType;
}>();
</script>
