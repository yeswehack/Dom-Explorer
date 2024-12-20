<template>
  <div class="hidden gap-1 sm:flex">
    <Button
      size="icon"
      icon="save"
      :disabled="alreadySaved || !input"
      :tooltip="saveLabel"
      tooltip-side="bottom"
      @click="saveInput"
    />
    <SearchInput
      align="end"
      :choices="savedInputs"
      item-class="font-mono"
      class="w-auto max-w-[50vw]"
      :model-value="''"
      allow-delete
      @update:model-value="loadSavedInput"
      @delete="removeSaveInput"
    >
      <template #button>
        <Button
          size="icon"
          tooltip-side="bottom"
          tooltip="Load saved input"
          icon="bookHeart"
        />
      </template>
    </SearchInput>
  </div>
</template>

<script setup lang="ts">
const input = defineModel<string>({ default: "" });

const userSettings = useUserSettings();
const alreadySaved = computed(() => {
  return userSettings.savedInputs.value.includes(input.value);
});

const saveLabel = autoResetRef(() => {
  return alreadySaved.value ? "Already saved" : "Save input";
}, 1000);

function saveInput() {
  if (!input.value) return;

  if (!userSettings.savedInputs.value.includes(input.value)) {
    userSettings.savedInputs.value.push(input.value);
    saveLabel.value = "Saved!";
  }
}
function loadSavedInput(value: string) {
  input.value = value;
}

function removeSaveInput(input: string) {
  userSettings.savedInputs.value = userSettings.savedInputs.value.filter(
    (s) => s !== input,
  );
}

const savedInputs = computed(() => {
  return userSettings.savedInputs.value.map((s) => ({
    label: s,
    value: s,
  }));
});
</script>
