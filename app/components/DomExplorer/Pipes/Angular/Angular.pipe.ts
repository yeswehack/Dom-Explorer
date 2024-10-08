import { z } from "zod";

const pipe = definePipe({
  name: "Angular",
  category: "Sanitizer",
  opts: z
    .object({
      context: z
        .enum(["NONE", "HTML", "STYLE", "SCRIPT", "URL", "RESOURCE_URL"])
        .default("HTML"),
    })
    .catch(() => ({
      context: "HTML" as const,
    })),
});


export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
