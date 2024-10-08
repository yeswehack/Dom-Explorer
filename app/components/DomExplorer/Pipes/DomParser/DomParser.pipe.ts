import { z } from "zod";

const pipe = definePipe({
  name: "DomParser",
  category: "Parser",
  opts: z
    .object({
      type: z
        .enum([
          "application/xhtml+xml",
          "application/xml",
          "image/svg+xml",
          "text/html",
          "text/xml",
        ])
        .catch("text/html"),
      selector: z.string().catch("body"),
      output: z
        .enum(["source", "innerHTML", "outerHTML", "innerText", "textContent"])
        .catch("innerHTML"),
      addDoctype: z.boolean().catch(true),
    })
    .catch(() => ({
      type: "text/html" as const,
      selector: "body",
      addDoctype: true,
      output: "innerHTML" as const,
    })),
});

export default pipe;
export type Opts = InferPipeOpts<typeof pipe>;
