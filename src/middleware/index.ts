import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

/**
 * Middleware that adds Supabase client and user authentication to locals
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Add Supabase client to locals for all requests
  context.locals.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  // Initialize user as undefined
  context.locals.user = undefined;

  // Check for authentication on API routes
  if (context.url.pathname.startsWith("/api/")) {
    const authHeader = context.request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      try {
        // Verify JWT token with Supabase
        const {
          data: { user },
          error,
        } = await context.locals.supabase.auth.getUser(token);

        if (!error && user) {
          context.locals.user = user;
        }
      } catch (error) {
        console.warn("Invalid JWT token:", error);
        // Continue without user - endpoints will handle authentication
      }
    }
  }

  return next();
});
