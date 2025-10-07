import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

/**
 * Simple middleware that adds Supabase client to locals
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Add Supabase client to locals for all requests
  context.locals.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  return next();
});
