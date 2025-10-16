import { defineMiddleware } from "astro:middleware";
import { createServerSupabaseClient } from "../db/supabase.server";
import type { Database } from "../db/database.types";

/**
 * Middleware that adds Supabase client and user authentication to locals
 * Obsługuje sesje Supabase Auth z ciasteczkami
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Utworzenie serwerowego klienta Supabase z obsługą ciasteczek
  context.locals.supabase = createServerSupabaseClient(context.cookies);

  // Inicjalizacja użytkownika jako undefined
  context.locals.user = undefined;

  try {
    // Sprawdzenie sesji użytkownika z ciasteczek
    const {
      data: { session },
      error,
    } = await context.locals.supabase.auth.getSession();

    if (!error && session?.user) {
      // Pobieranie danych użytkownika z tabeli users
      const { data: userData, error: userError } = await context.locals.supabase
        .from("users")
        .select("id, email, username")
        .eq("supabase_auth_id", session.user.id)
        .single();

      if (!userError && userData) {
        context.locals.user = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
        };
      } else {
        // Fallback do danych z Supabase Auth jeśli nie ma rekordu w tabeli users
        context.locals.user = {
          id: session.user.id,
          email: session.user.email,
        };
      }
    }
  } catch (error) {
    console.warn("Error getting session:", error);
    // Kontynuuj bez użytkownika - strony będą obsługiwać brak autentykacji
  }

  // Przekierowania dla stron autentykacyjnych
  if (context.url.pathname === "/login" || context.url.pathname === "/register") {
    if (context.locals.user) {
      // Zalogowany użytkownik nie powinien widzieć stron logowania/rejestracji
      return context.redirect("/");
    }
  }

  // Przykład: ochrona stron wymagających autentykacji
  // if (!context.locals.user && context.url.pathname.startsWith("/decks")) {
  //   return context.redirect("/login");
  // }

  return next();
});
