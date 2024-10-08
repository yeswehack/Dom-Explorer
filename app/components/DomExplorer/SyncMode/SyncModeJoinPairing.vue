<template>
  <div class="flex flex-col gap-2">
    <p>Paste the offer here</p>
    <div class="flex items-center gap-2">
      <Input v-model="offer" type="textarea" @keypress.enter="connect" />
      <Button size="icon" class="size-8" @click="connect">
        <SaveIcon class="size-6" />
      </Button>
    </div>
    <template v-if="answer">
      <p>Copy this code to the host</p>
      <div class="flex items-center gap-2">
        <Input type="textarea" :model-value="answer" readonly />
        <CopyButton :value="answer" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { SaveIcon } from "lucide-vue-next";

const props = defineProps<{
  connection: RTCConnection;
}>();

const offer = ref("");
const answer = ref("");

async function connect() {
  answer.value = await props.connection.joinPairing(offer.value);
}
</script>
