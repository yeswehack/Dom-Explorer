import { z } from "zod";

const pipe = definePipe({
  name: "HighlightJs",
  category: "Other",
  opts: z.object({}).catch(() => ({})),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
