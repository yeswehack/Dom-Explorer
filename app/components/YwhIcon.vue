<template>
  <div class="flex items-center">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1114 1448.3"
      style="enable-background: new 0 0 1114 1448.3"
    >
      <g>
        <path
          id="w"
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="currentColor"
          :class="wClass"
          d="M222.8,1159.2l222.8-189.7v-99.1c0-14.5,11.8-26.3,26.3-26.3h170.2c14.5,0,26.3,11.8,26.3,26.3v99.1
		l222.8,189.7v-557c0-8,3.2-14.9,9.2-20l170.2-144.9c8-6.8,18.6-8.3,28.1-3.9c9.5,4.4,15.3,13.4,15.3,23.9V1422
		c0,14.5-11.8,26.3-26.3,26.3H896.6c-6.5,0-12.1-2.1-17-6.3L557,1167.3L234.5,1442c-4.9,4.2-10.5,6.3-17.1,6.3H26.3
		c-14.5,0-26.3-11.8-26.3-26.3V457.2c0-10.5,5.7-19.5,15.3-23.9c9.5-4.4,20.1-3,28.1,3.9l170.1,144.9c6.1,5.2,9.3,12,9.3,20V1159.2z
		"
        />
        <path
          id="y"
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="currentColor"
          :class="yClass"
          d="M445.6,606.5L9.3,234.9c-6.1-5.2-9.3-12-9.3-20V26.3C0,11.8,11.8,0,26.3,0h170.2
		c14.5,0,26.3,11.8,26.3,26.3v97.8L557,408.8l334.2-284.6V26.4c0-14.5,11.8-26.3,26.3-26.3h170.2c14.5,0,26.3,11.8,26.3,26.3V215
		c0,8-3.2,14.9-9.2,20L668.4,606.6v99.5c0,14.5-11.8,26.3-26.3,26.3H471.9c-14.5,0-26.3-11.8-26.3-26.3V606.5z"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  yClass?: string;
  wClass?: string;
}>();
</script>
