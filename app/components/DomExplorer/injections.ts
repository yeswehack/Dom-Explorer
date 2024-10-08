import type { InjectionKey } from "vue";
import type { Pipe } from "../../types";

function createInjectionPair<T>(name: string) {
  const key = Symbol() as InjectionKey<T>;
  function _provide(value: T) {
    provide(key, value);
    return value;
  }

  function _inject() {
    const r = inject(key);
    if (r === undefined) {
      throw new Error(`Injection "${name}" not provided.`);
    }
    return r;
  }

  return { inject: _inject, provide: _provide };
}

export const injections = {
  pipe: createInjectionPair<ComputedRef<Pipe>>("pipe"),
  removePipe: createInjectionPair<(id: string) => void>("removePipe"),
  noDesc: createInjectionPair<ComputedRef<boolean>>("noDesc"),
  error: createInjectionPair<ComputedRef<string>>("error"),
  readOnly: createInjectionPair<Ref<boolean>>("readOnly"),
  mouseInPipeline: createInjectionPair<Ref<boolean>>("mouseInPipeline"),
};
