import { z } from "zod";

const pipe = definePipe({
  name: "SafeValues",
  category: "Sanitizer",
  opts: z
    .object({
      version: z.string().catch("latest"),
    })
    .catch(() => ({ version: "latest" })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
