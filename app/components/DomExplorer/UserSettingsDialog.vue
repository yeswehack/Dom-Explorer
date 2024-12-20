<template>
  <Sheet v-model:open="open">
    <SheetTrigger>
      <slot />
    </SheetTrigger>
    <SheetContent side="left" overlay-class="bg-black/20">
      <SheetHeader>
        <SheetTitle>User settings</SheetTitle>
        <SheetDescription>
          Here you can change your user settings, it will be saved automatically
          to local storage.
        </SheetDescription>
      </SheetHeader>

      <div class="flex flex-col gap-2">
        <h2 class="pt-1 text-sm font-bold">Dom Tree</h2>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="showDepth" />
          Show tree depth
        </Label>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="showNs" />
          Show namespaces
        </Label>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="indentRight" />
          Indent right
        </Label>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="pt-1 text-sm font-bold">Pipelines</h2>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="addDomParser" />
          Always append DomParser when creating a new pipeline
        </Label>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>("open", { default: false });

const { showDepth, showNs, indentRight, addDomParser } = useUserSettings();
</script>
