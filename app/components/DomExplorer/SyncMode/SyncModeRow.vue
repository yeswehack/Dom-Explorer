<template>
  <TableRow>
    <TableCell class="font-medium"> {{ con.name }} </TableCell>
    <TableCell>{{ con.state }}</TableCell>
    <TableCell
      class="cursor-pointer"
      @click="con.followInput = !con.followInput"
    >
      <div class="flex items-center justify-center">
        <Checkbox v-model="con.followInput" @click.stop />
      </div>
    </TableCell>
    <TableCell
      class="cursor-pointer"
      @click="con.followPipelines = !con.followPipelines"
    >
      <div class="flex items-center justify-center">
        <Checkbox v-model="con.followPipelines" @click.stop />
      </div>
    </TableCell>
    <TableCell>
      <div class="flex justify-end gap-1">
        <template v-if="con.state === 'new'">
          <CopyButton
            :value="con.id"
            icon="copy"
            size="iconSm"
            tooltip="Copy ID"
          />
          <CopyButton
            :value="link"
            icon="link"
            size="iconSm"
            tooltip="Copy Link"
          />
          <QrcodeDialog
            title="QRCode"
            description="Scan this QR code to synchronize tabs with a mobile device."
            :data="link"
          >
            <Button icon="qrCode" size="iconSm" tooltip="QR Code" />
          </QrcodeDialog>
        </template>
        <Button
          variant="ghost-destructive"
          icon="trash"
          size="iconSm"
          tooltip="Delete"
          @click="con.close()"
        />
      </div>
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
const props = defineProps<{
  con: RTCConnection;
}>();

const link = computed(() => {
  return resolveRemoteLink({
    name: "index",
    query: {
      sync: props.con.id,
    },
  });
});
</script>
