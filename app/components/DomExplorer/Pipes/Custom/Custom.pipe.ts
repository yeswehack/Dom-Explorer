import { z } from "zod";

const pipe = definePipe({
  name: "Custom",
  category: "Other",
  opts: z
    .object({
      code: z.string().catch("return input"),
    })
    .catch(() => ({
      code: "return input",
    })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
