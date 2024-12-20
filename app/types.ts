import { z } from "zod";
import { pipeParser, pipes } from "~/components/DomExplorer/Pipes";

export const pipeNames = pipes.map((pipe) => pipe.name);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Pipe<T = any> {
  name: string;
  displayName?: string;
  id: string;
  hide: boolean;
  skip: boolean;
  opts: T;
}

export const pipelineParser = z.object({
  id: z.string(),
  name: z.string(),
  pipes: z.array(pipeParser),
});

export type Pipeline = z.infer<typeof pipelineParser>;

export const stateParser = z
  .object({
    input: z.string().catch(""),
    pipelines: z
      .array(pipelineParser)
      .catch(() => [createPipeline("Dom Tree", [createPipe("DomParser")])]),
  })
  .catch(() => ({
    input: "",
    pipelines: [createPipeline("Dom Tree", [createPipe("DomParser")])],
  }));

const booleanStr = z.enum(["true", "false"]).transform((val) => val === "true");

export const settingsParser = z
  .object({
    input: z.enum(["editable", "readonly", "hidden"]).catch("editable"),
    titleBar: z.enum(["editable", "readonly", "hidden"]).catch("editable"),
    readonly: booleanStr.catch(false),
    "pipe[titleBar]": booleanStr.catch(true),
    "pipe[skip]": booleanStr.catch(true),
    "pipe[render]": booleanStr.catch(true),
    "pipe[settings]": booleanStr.catch(true),
  })
  .transform((obj) => {
    return {
      input: obj.input,
      titleBar: obj.titleBar,
      readonly: obj.readonly,
      pipe: {
        titleBar: obj["pipe[titleBar]"],
        skip: obj["pipe[skip]"],
        render: obj["pipe[render]"],
        settings: obj["pipe[settings]"],
      },
    };
  })
  .catch(
    () =>
      ({
        input: "editable",
        titleBar: "editable",
        readonly: false,
        pipe: {
          titleBar: true,
          skip: true,
          render: true,
          settings: true,
        },
      }) as const,
  );

export type DomExplorerState = z.infer<typeof stateParser>;
export type DomExplorerSettings = z.infer<typeof settingsParser>;

export type JSONValue = string | number | boolean | JSONObject | JSONArray;
export type JSONArray = JSONValue[];

export interface JSONObject {
  [x: string]: JSONValue;
}

export function isValidPipeName(name: string): boolean {
  return (pipeNames as string[]).includes(name);
}

export function createPipe(
  name: string,
  opts?: unknown,
  extra?: Partial<{
    hide: boolean;
    skip: boolean;
    id: string;
    displayName: string;
  }>,
): Pipe {
  return pipeParser.parse({
    name,
    opts,
    displayName: extra?.displayName,
    hide: extra?.hide,
    skip: extra?.skip,
    id: extra?.id ?? randomId(),
  });
}

export function createPipeline(
  name: string,
  pipes: Pipe[] = [],
  id?: string,
): Pipeline {
  return pipelineParser.parse({ name, pipes, id: id ?? randomId() });
}
