import { z } from "zod";

const pipe = definePipe({
  name: "SrcdocParser",
  category: "Parser",
  opts: z
    .object({
      selector: z.string().catch("body"),
      output: z
        .enum(["source", "innerHTML", "outerHTML", "innerText", "textContent"])
        .catch("innerHTML"),
    })
    .catch(() => ({
      selector: "",
      output: "innerHTML" as const,
    })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
