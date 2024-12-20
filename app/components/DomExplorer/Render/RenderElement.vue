<template>
  <DomBase :tag="tagName" :ns="ns" :depth="depth">
    <template #attrs>
      <div class="flex flex-wrap gap-2 pl-2 empty:hidden">
        <div v-for="attr of attrs" :key="attr.name" class="flex text-nowrap">
          <span class="text-red-300">{{ attr.name }}</span>
          <span class="text-muted-foreground/50">=</span>
          <span class="quoted text-wrap break-all">{{ attr.value }}</span>
        </div>
        <span v-if="repeating">x{{ repeating + 1 }}</span>
      </div>
    </template>
    <template v-for="(child, idx) in children" :key="idx">
      <RenderNode :node="child" :depth="depth + repeating + 1" />
    </template>
  </DomBase>
</template>

<script lang="ts" setup>
const props = defineProps<{
  el: Element;
  depth: number;
}>();

const ns = computed(() => {
  return noClobber(props.el, "namespaceURI") ?? undefined;
});

const tagName = computed(() => {
  return noClobber(props.el, "tagName");
});

const attrs = computed(() => {
  const attrs = noClobber(props.el, "attributes");
  return Array.from(attrs).map((attr) => ({
    name: attr.name,
    value: attr.value,
  }));
});

function isElement(node?: Node): node is Element {
  return node?.nodeType === Node.ELEMENT_NODE;
}

const repeating = computed(() => {
  if (Element.prototype.hasAttributes.call(props.el)) {
    return 0;
  }

  function isSame(el?: Node) {
    if (!isElement(el)) {
      return false;
    }
    if (noClobber(el, "namespaceURI") !== noClobber(props.el, "namespaceURI")) {
      return false;
    }
    if (noClobber(el, "tagName") !== noClobber(props.el, "tagName")) {
      return false;
    }
    if (Element.prototype.hasAttributes.call(el)) {
      return false;
    }
    return true;
  }

  let repeating = 0;
  let current: Node | undefined = props.el;
  while (
    current &&
    noClobber(current, "childNodes").length === 1 &&
    isSame(noClobber(current, "childNodes")[0])
  ) {
    current = noClobber(current, "childNodes")[0];
    repeating++;
  }
  return repeating;
});

const children = computed(() => {
  let children: Node[];

  if (noClobber(props.el, "tagName") === "TEMPLATE") {
    const tpl = props.el as HTMLTemplateElement;
    const content = noClobber(tpl, "content");
    if (!content) {
      return [];
    }
    children = Array.from(noClobber(content, "childNodes"));
  } else {
    children = Array.from(noClobber(props.el, "childNodes"));
  }

  for (let i = 0; i < repeating.value; i++) {
    children = Array.from(children[0]!.childNodes);
  }

  return Array.from(children);
});
</script>

<style scoped>
.quoted {
  &::before,
  &::after {
    @apply text-muted-foreground/50;
    content: '"';
  }

  padding-left: 1ch;
  text-indent: -1ch;
}
</style>
