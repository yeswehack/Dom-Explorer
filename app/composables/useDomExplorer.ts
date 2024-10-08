import { stateParser, type DomExplorerSettings } from "~/types";

export function parseStateFromHash() {
  let state: unknown;
  try {
    state = JSON.parse(
      b64DecodeUnicode(decodeURIComponent(location.hash.slice(1))),
    );
  } catch {
    state = {};
  }
  return stateParser.parse(state);
}

const settingsKey = Symbol(
  "DomExplorerSettings",
) as InjectionKey<DomExplorerSettings>;

export function createDomExplorerSettings(
  defaultSettings: DomExplorerSettings,
) {
  const settings = reactive(defaultSettings);
  provide(settingsKey, settings);
  return settings;
}

export function useDomExplorerSettings() {
  const settings = inject(settingsKey, null);
  if (!settings) {
    throw new Error("DomExplorerSettings not provided");
  }
  return settings;
}
