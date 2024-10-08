// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortableData = reactive(new WeakMap<Element, any>());

export function useSortableData() {
  return sortableData;
}
