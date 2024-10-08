import { z } from "zod";
import { pipelineParser, type Pipeline } from "~/types";

const presetsParser = z.array(pipelineParser).catch(() => []);

export function usePresets() {
  const presets = useLocalStorage<Pipeline[]>("dom-explorer-preset", () => [], {
    serializer: {
      read(raw) {
        return presetsParser.parse(JSON.parse(raw));
      },
      write(value) {
        return JSON.stringify(value);
      },
    },
    deep: true,
  });

  function newPreset() {
    const id = randomId();
    presets.value.push({
      name: "New preset",
      id,
      pipes: [],
    });

    return id;
  }

  function deletePreset(id: string) {
    const idx = presets.value.findIndex((preset) => preset.id === id);
    if (idx !== -1) {
      presets.value.splice(idx, 1);
    }
    return idx;
  }

  function duplicatePreset(id: string) {
    const preset = presets.value.find((preset) => preset.id === id)!;
    const newPreset = clonePipeline(preset);
    presets.value.push(newPreset);

    return newPreset;
  }

  return { presets, newPreset, deletePreset, duplicatePreset };
}
