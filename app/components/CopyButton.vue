<template>
  <Tooltip :label="label">
    <slot :copy="copy">
      <Button size="icon" class="size-8">
        <Icon name="copy" class="size-6" @click="copy" />
      </Button>
    </slot>
  </Tooltip>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: string;
}>();

const label = refAutoReset("Copy", 1000);

function copy() {
  label.value = "Copied!";
  navigator.clipboard.writeText(props.value);
}
</script>
