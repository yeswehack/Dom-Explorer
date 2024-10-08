import type { MaybeRefOrGetter } from "vue";

interface JSDelivrVersions {
  tags: Record<string, string>;
  versions: string[];
}

const versions = reactive(new Map<string, JSDelivrVersions>());

const cache = new Map<string, unknown>();
async function cachedFetch<T>(url: string) {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  const r = fetch(url).then((res) => res.json() as Promise<T>);
  cache.set(url, r);
  return r;
}

export function usePackageVersions(name: MaybeRefOrGetter) {
  watch(
    () => toValue(name),
    async (name) => {
      const url = `https://data.jsdelivr.com/v1/package/npm/${name}`;
      const version = await cachedFetch<JSDelivrVersions>(url);
      versions.set(name, version);
    },
    { immediate: true },
  );

  return computed(() => {
    const reply = versions.get(toValue(name));
    if (!reply) return [];

    const tags = Object.keys(reply.tags);

    return [...tags, ...reply.versions];
  });
}
