import { z } from "zod";

const pipe = definePipe({
  name: "Ammonia",
  category: "Sanitizer",
  opts: z
    .object({
      addTags: z.array(z.string()).catch([]),
      addAttrs: z.array(z.string()).catch([]),
      addUrls: z.array(z.string()).catch([]),
      stripComment: z.boolean().catch(true),
    })
    .catch(() => ({
      addTags: [],
      addAttrs: [],
      addUrls: [],
      stripComment: true,
    })),
});

export default pipe;
export type Opts = z.infer<typeof pipe.opts>;
