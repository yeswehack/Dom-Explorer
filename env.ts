import { z } from "zod";

const envParser = z.object({
  SUPABASE_URL: z.string().optional(),
  SUPABASE_KEY: z.string().optional(),
  BASE_URL: z.string().default("/"),
});

export default envParser.parse(process.env);
