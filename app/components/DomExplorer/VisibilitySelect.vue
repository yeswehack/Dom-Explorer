<template>
  <Select v-model="model">
    <SelectTrigger class="h-7 w-[120px]">
      <SelectValue placeholder="Select..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="editable"> Editable </SelectItem>
      <SelectItem value="readonly"> Readonly </SelectItem>
      <SelectItem value="hidden"> Hidden </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
const model = defineModel<"editable" | "readonly" | "hidden">({
  default: "editable",
});
</script>
