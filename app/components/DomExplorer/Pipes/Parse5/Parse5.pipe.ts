import { z } from "zod";

const pipe = definePipe({
  name: "Parse5",
  category: "Parser",
  opts: z
    .object({
      version: z.string().catch("latest"),
      fragment: z.boolean().catch(true),
    })
    .catch(() => ({
      version: "latest",
      fragment: true,
    })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
