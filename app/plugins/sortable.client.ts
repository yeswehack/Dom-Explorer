// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Swap } from "sortablejs/modular/sortable.core.esm";
import Sortable from "sortablejs";

Sortable.mount(new Swap());

export default defineNuxtPlugin(() => {
  return {
    provide: { Sortable },
  };
});
