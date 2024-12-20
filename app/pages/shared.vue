<template>
  <LayoutPage>
    <LayoutHeader title="Dom-Explorer" />
    <div class="grid h-full items-center justify-center">
      <Alert v-if="error" variant="destructive">
        <Icon name="triangleAlert" class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription class="min-w-72">
          {{ error }}
        </AlertDescription>
      </Alert>
      <Alert v-else>
        <Icon name="loaderCircle" class="h-4 w-4 animate-spin" />
        <AlertTitle>Loading</AlertTitle>
        <AlertDescription>
          Wait a second, we are loading the shared state.
        </AlertDescription>
      </Alert>
    </div>
  </LayoutPage>
</template>

<script setup lang="ts">
import { z } from "zod";

const shared = useSharedState();
const route = useRoute();
const router = useRouter();
const error = ref("");

const sharedParser = z.object({
  id: z.string().uuid(),
});

onMounted(() => {
  error.value = "";

  const parsed = sharedParser.safeParse(route.query);
  if (parsed.error) {
    error.value = "Invalid query parameters";
    return;
  }
  const { id } = parsed.data;
  shared
    .getSharedState(id)
    .then((state) => {
      router.push({
        name: "dom-explorer",
        hash: "#" + btoa(JSON.stringify(state)),
      });
    })
    .catch((e) => {
      error.value = `${e}`;
    });
});
</script>
