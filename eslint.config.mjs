// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "vue/require-default-prop": "off",
    "vue/no-mutating-props": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    "vue/html-self-closing": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
}).append({
  ignores: ["extras/*"],
});
