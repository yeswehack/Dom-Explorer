import { z } from "zod";

const pipe = definePipe({
  name: "JsXss",
  category: "Sanitizer",
  opts: z
    .object({
      version: z.string().catch("latest"),
      options: z.string().catch(""),
    })
    .catch(() => ({
      version: "latest",
      options: "",
    })),
});


export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;