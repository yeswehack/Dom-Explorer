import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Pipe, Pipeline } from "../types";
import { z } from "zod";
import { detect } from "detect-browser";
import type { TypedRouteLocationRawFromName } from "#build/typed-router/__router";
import type { RoutesNamesList } from "#build/typed-router/__routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomId(size = 8) {
  let out = "";

  while (out.length < size) {
    out += Math.random().toString(36).substring(2);
  }
  return out.slice(0, size);
}

export function clonePipe(pipe: Pipe): Pipe {
  const newPipe = structuredClone(toRaw(pipe));
  newPipe.id = randomId();
  return newPipe;
}

export function clonePipeline<T extends Pipeline>(pipeline: T): T {
  return {
    id: randomId(),
    name: pipeline.name,
    pipes: pipeline.pipes.map(clonePipe),
  } as T;
}

export function b64EncodeUnicode(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}

export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

export function noClobber<T extends Node, K extends keyof T>(
  item: T,
  key: K,
): T[K] {
  let descriptor: PropertyDescriptor | undefined;
  if (
    item instanceof DocumentFragment &&
    (descriptor = Object.getOwnPropertyDescriptor(
      DocumentFragment.prototype,
      key,
    ))
  ) {
    return descriptor.value ?? descriptor.get?.call(item);
  }

  if (
    item instanceof Document &&
    (descriptor = Object.getOwnPropertyDescriptor(Document.prototype, key))
  ) {
    return descriptor.value ?? descriptor.get?.call(item);
  }

  if (
    item instanceof Element &&
    (descriptor = Object.getOwnPropertyDescriptor(Element.prototype, key))
  ) {
    return descriptor.value ?? descriptor.get?.call(item);
  }

  if ((descriptor = Object.getOwnPropertyDescriptor(Node.prototype, key))) {
    return descriptor.value ?? descriptor.get?.call(item);
  }

  return item[key];
}

export function definePipe<
  TName extends string,
  T extends z.ZodCatch<z.ZodTypeAny>,
>(opts: { name: TName; category?: string; opts: T }) {
  return {
    name: opts.name,
    category: opts.category ?? "Other",
    opts: opts.opts,
    parser: z.object({
      name: z.literal<TName>(opts.name),
      displayName: z.string().optional(),
      id: z
        .string()
        .min(1)
        .catch(() => randomId()),
      hide: z.boolean().catch(false),
      skip: z.boolean().catch(false),
      opts: opts.opts,
    }),
  };
}

export type InferPipeOpts<T> = T extends { parser: z.ZodTypeAny }
  ? z.infer<T["parser"]>["opts"]
  : never;

export function getBrowserName() {
  const browser = detect(navigator.userAgent);
  if (!browser) return "Unknown";
  return `${browser.name} ${browser.version ?? ""}`;
}

export function resolveRemoteLink(
  to: TypedRouteLocationRawFromName<RoutesNamesList, string>,
) {
  const url = useRouter().resolve(to);
  return new URL(url.href, window.origin).href;
}
