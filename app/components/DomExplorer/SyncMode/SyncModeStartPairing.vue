<template>
  <div class="mt-2 flex flex-col gap-2">
    <p>Copy the offer to the other tab:</p>
    <div class="flex items-center gap-2">
      <Input type="textarea" :model-value="offer" readonly />
      <CopyButton :value="offer" />
    </div>

    <p>Paste the reply code here</p>
    <div class="flex items-center gap-2">
      <Input v-model="answer" type="textarea" />
      <Tooltip label="Connect">
        <Button size="icon" class="size-8" @click="acceptReply">
          <Icon name="cable" class="size-6" />
        </Button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  connection: RTCConnection;
}>();

const emit = defineEmits<{
  done: [];
}>();

props.connection.startPairing().then((r) => {
  offer.value = r;
});

const offer = ref("");
const answer = ref("");
const loading = ref(false);

function acceptReply() {
  loading.value = true;
  props.connection
    .acceptAnswer(answer.value)
    .then(() => {
      emit("done");
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
