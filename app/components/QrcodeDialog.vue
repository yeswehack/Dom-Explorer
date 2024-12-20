<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center justify-center">
        <img :src="qrcode" alt="QR Code" />
      </div>
      <DialogFooter>
        <Input :model-value="data" readonly />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode";

const props = defineProps<{
  title: string;
  description: string;
  data: string;
}>();

const qrcode = useQRCode(() => props.data);
</script>
