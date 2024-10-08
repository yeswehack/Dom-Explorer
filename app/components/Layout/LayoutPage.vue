<template>
	<div :class="cn('flex flex-col relative ')">
		<div />
		<slot />
	</div>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";
import type { HTMLAttributes } from 'vue';
defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>
