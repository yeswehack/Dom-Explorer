export { default as Icon } from "./Icon.vue";

type LowerFirst<T> = T extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : T;

type Lucide = keyof typeof import("lucide-vue-next");
type GetNames<T> = T extends `${infer Name}Icon`
  ? Name extends Capitalize<Name>
    ? Name extends ""
      ? never
      : LowerFirst<Name>
    : never
  : never;

export type IconName = GetNames<Lucide>;
