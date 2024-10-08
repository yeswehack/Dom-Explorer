import { z } from "zod";

const pipe = definePipe({
  name: "IframeView",
  category: "Render",
  opts: z
    .object({
      addDoctype: z.boolean().catch(false),
      charset: z.string().catch(""),
    })
    .catch(() => ({
      addDoctype: false,
      charset: "",
    })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
