<template>
  <DomBase prefix="<!-- " suffix=" -->" class="bg-green-600/5" ns="comment">
    <template #attrs>
      <span class="px-1 text-muted-foreground">{{ comment.textContent }}</span>
    </template>
  </DomBase>
</template>

<script lang="ts" setup>
defineProps<{
  comment: Comment;
}>();
</script>
