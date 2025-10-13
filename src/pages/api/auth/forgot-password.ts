import type { APIRoute } from "astro";
import { forgotPasswordSchema } from "../../../lib/schemas/auth.schemas";
import { createServerSupabaseClientWithoutCookies } from "../../../db/supabase.server";
import { ErrorHandler } from "../../../lib/utils/error-handler";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Walidacja danych wejściowych
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Utworzenie klienta Supabase (bez ciasteczek dla tego endpointu)
    const supabase = createServerSupabaseClientWithoutCookies();

    // Wysłanie linku do resetowania hasła
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.SITE_URL || 'http://localhost:4321'}/reset-password`,
    });

    if (error) {
      return ErrorHandler.createErrorResponse(
        ErrorHandler.handleSupabaseAuthError(error, "forgot-password")
      );
    }

    // Pomyślne wysłanie linku (nawet jeśli email nie istnieje, dla bezpieczeństwa)
    return new Response(
      JSON.stringify({ 
        message: "Jeśli podany email istnieje w systemie, otrzymasz link do resetowania hasła." 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Forgot password endpoint error:", error);
    
    // Obsługa błędów walidacji Zod
    if (error instanceof Error && error.name === "ZodError") {
      return ErrorHandler.createErrorResponse(
        new ErrorHandler().createValidationError(error as any)
      );
    }

    // Inne błędy
    return ErrorHandler.createErrorResponse(
      new Error("Wystąpił błąd podczas wysyłania linku resetującego. Spróbuj ponownie.")
    );
  }
};
