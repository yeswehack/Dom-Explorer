<template>
  <div>
    <ClientOnly>
      <TooltipProvider>
        <NuxtLayout />
      </TooltipProvider>
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
import "./assets/style.css";
import "highlight.js/styles/github-dark-dimmed.min.css"


useSeoMeta({
  description: 'Explore how HTML is parsed by the browser and common libraries.',
  ogTitle: 'Dom-Explorer',
  ogDescription: 'Explore how HTML is parsed by the browser and common libraries.',
  ogImage: '/icon.svg',
  twitterTitle: 'Dom-Explorer',
  twitterDescription: 'Explore how HTML is parsed by the browser and common libraries.',
  twitterImage: '/icon.svg',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/icon.svg'
    }
  ]
})
</script>
