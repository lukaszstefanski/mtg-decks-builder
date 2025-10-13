import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { AstroCookies } from "astro";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

/**
 * Tworzy serwerowy klient Supabase z obsługą ciasteczek
 * Używany w middleware i endpointach API
 */
export function createServerSupabaseClient(cookies: AstroCookies) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
      storage: {
        getItem: (key: string) => {
          return cookies.get(key)?.value || null;
        },
        setItem: (key: string, value: string) => {
          cookies.set(key, value, {
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 dni
            path: "/",
          });
        },
        removeItem: (key: string) => {
          cookies.delete(key, { path: "/" });
        },
      },
    },
  });
}

/**
 * Tworzy serwerowy klient Supabase bez obsługi ciasteczek
 * Używany w endpointach, które nie wymagają sesji
 */
export function createServerSupabaseClientWithoutCookies() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
