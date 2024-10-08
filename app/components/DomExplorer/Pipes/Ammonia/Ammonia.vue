<template>
  <Pipe :pipe="pipe" :error="error">
    <template #description>
      <ExternalLink
        href="https://github.com/rust-ammonia/ammonia"
        label="Ammonia"
      />
      is a whitelist-based HTML sanitization library written in Rust. It is
      designed to prevent cross-site scripting, layout breaking, and
      clickjacking caused by untrusted user-provided HTML being mixed into a
      larger web page.
    </template>
    <template #options="{ readOnly }">
      <PipeOption label="Tags">
        <p>Add more tags to the whitelist.</p>
        <TagsInput
          v-model="pipe.opts.addTags"
          class="max-h-[200px] max-w-xl overflow-auto"
          :disabled="readOnly"
        >
          <TagsInputItem
            v-for="item in pipe.opts.addTags"
            :key="item"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="Tags..." />
        </TagsInput>
        <div class="flex items-center gap-2 pt-3">
          ADD:
          <Button size="sm" @click="addHtml">All HTML</Button>
          <Button size="sm" @click="addMathml">All MathML</Button>
          <Button size="sm" @click="addSvg">All SVG</Button>
          <Button size="sm" class="ml-auto" @click="pipe.opts.addTags = []"
            >Reset <Icon name="refreshCw" class="ml-2 size-4" />
          </Button>
        </div>
      </PipeOption>
      <PipeOption label="Attributes">
        <p>Add more tags to the whitelist.</p>
        <TagsInput
          v-model="pipe.opts.addAttrs"
          class="max-w-xl"
          :disabled="readOnly"
        >
          <TagsInputItem
            v-for="item in pipe.opts.addAttrs"
            :key="item"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="Attributes..." />
        </TagsInput>
      </PipeOption>
      <PipeOption label="URL Schemes">
        <p>Add more url schemes to the whitelist.</p>
        <TagsInput
          v-model="pipe.opts.addUrls"
          class="max-w-xl"
          :disabled="readOnly"
        >
          <TagsInputItem
            v-for="item in pipe.opts.addUrls"
            :key="item"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="Tags..." />
        </TagsInput>
      </PipeOption>
      <PipeOption label="Comments">
        <p>If this option is false, comments will be preserved.</p>
        <Label class="flex items-center gap-1.5">
          <Checkbox v-model="pipe.opts.stripComment" :disabled="readOnly" />
          Strip comments
        </Label>
      </PipeOption>
    </template>
    <template #render>
      <RenderHtml :text="result" />
    </template>
  </Pipe>
</template>

<script lang="ts" setup>
import type { Pipe } from "~/types";
import init, { SanitizerInput, sanitize } from "../../../../../extras/ammonia-wasm/pkg";
import type { Opts } from "./Ammonia.pipe.js";

const ready = ref(false);
init().then(() => {
  ready.value = true;
});

const mathMLTags = [
  "annotation",
  "annotation-xml",
  "maction",
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mprescripts",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "semantics",
];

const svgTags = [
  "a",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hatch",
  "hatchpath",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "script",
  "set",
  "solidcolor",
  "stop",
  "style",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "title",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern",
];

const htmlTags = [
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fencedframe",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "meta",
  "meter",
  "nav",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "portal",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp",
];

const props = defineProps<{
  input: string;
  pipe: Pipe<Opts>;
}>();

const emit = defineEmits<{
  update: [string];
}>();

const result = ref("");
const error = ref<string>();

function addMathml() {
  for (const tag of mathMLTags) {
    if (!props.pipe.opts.addTags.includes(tag)) {
      props.pipe.opts.addTags.push(tag);
    }
  }
}

function addSvg() {
  for (const tag of svgTags) {
    if (!props.pipe.opts.addTags.includes(tag)) {
      props.pipe.opts.addTags.push(tag);
    }
  }
}

function addHtml() {
  for (const tag of htmlTags) {
    if (!props.pipe.opts.addTags.includes(tag)) {
      props.pipe.opts.addTags.push(tag);
    }
  }
}

watch(
  [ready, () => props.input, () => props.pipe.opts],
  ([ready, input, opts]) => {
    if (!ready) return;
    result.value = sanitize(
      new SanitizerInput(
        input,
        opts.addTags,
        opts.addAttrs,
        opts.addUrls,
        opts.stripComment,
      ),
    );
  },
  { deep: true, immediate: true },
);

watchEffect(() => {
  emit("update", result.value);
});
</script>
