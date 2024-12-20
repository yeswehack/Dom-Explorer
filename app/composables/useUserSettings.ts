import { z } from "zod";

const defaultSettings = {
  showDepth: false,
  showNs: true,
  indentRight: true,
  addDomParser: false,
  savedInputs: [],
};

export type UserSettings = typeof defaultSettings;

function fromDefault<T extends keyof UserSettings>(key: T) {
  return () => structuredClone(defaultSettings[key]);
}

const userSettingsParser = z
  .object({
    showDepth: z.boolean().catch(fromDefault("showDepth")),
    showNs: z.boolean().catch(fromDefault("showNs")),
    indentRight: z.boolean().catch(fromDefault("indentRight")),
    addDomParser: z.boolean().catch(fromDefault("addDomParser")),
    savedInputs: z.array(z.string()).catch(fromDefault("savedInputs")),
  })
  .catch(() => structuredClone(defaultSettings));

export function useUserSettings() {
  const settings = useLocalStorage(
    "dom-explorer-user-settings",
    userSettingsParser.parse(undefined),
    {
      serializer: {
        read(raw) {
          return userSettingsParser.parse(JSON.parse(raw));
        },
        write(value) {
          return JSON.stringify(value);
        },
      },
    },
  );

  function asRef<T extends keyof typeof defaultSettings>(key: T) {
    return computed({
      get() {
        return settings.value[key];
      },
      set(value) {
        settings.value[key] = value;
      },
    });
  }

  return {
    showDepth: asRef("showDepth"),
    showNs: asRef("showNs"),
    savedInputs: asRef("savedInputs"),
    indentRight: asRef("indentRight"),
    addDomParser: asRef("addDomParser"),
  };
}
