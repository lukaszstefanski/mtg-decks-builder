import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../db/supabase.server";
import { ErrorHandler } from "../../../lib/utils/error-handler";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Utworzenie klienta Supabase z obsługą ciasteczek
    const supabase = createServerSupabaseClient(cookies);

    // Wylogowanie użytkownika
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return ErrorHandler.createErrorResponse(new Error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie."));
    }

    // Pomyślne wylogowanie - przekierowanie na stronę główną
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error("Logout endpoint error:", error);
    return ErrorHandler.createErrorResponse(new Error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie."));
  }
};
