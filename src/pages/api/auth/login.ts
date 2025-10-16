/* eslint-disable @typescript-eslint/no-explicit-any */

import type { APIRoute } from "astro";
import { loginSchema } from "../../../lib/schemas/auth.schemas";
import { createServerSupabaseClient } from "../../../db/supabase.server";
import { ErrorHandler, AuthenticationError } from "../../../lib/utils/error-handler";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Utworzenie klienta Supabase z obsługą ciasteczek
    const supabase = createServerSupabaseClient(cookies);

    // Próba logowania
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return ErrorHandler.createErrorResponse(ErrorHandler.handleSupabaseAuthError(error, "login"));
    }

    if (!data.user) {
      return ErrorHandler.createErrorResponse(new AuthenticationError("Nieprawidłowy email lub hasło"));
    }

    // Pobieranie danych użytkownika z tabeli users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, username")
      .eq("supabase_auth_id", data.user.id)
      .single();

    if (userError || !userData) {
      return ErrorHandler.createErrorResponse(new AuthenticationError("Nieprawidłowy email lub hasło"));
    }

    // Pomyślne logowanie
    return new Response(
      JSON.stringify({
        message: "Zalogowano pomyślnie!",
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login endpoint error:", error);

    // Obsługa błędów walidacji Zod
    if (error instanceof Error && error.name === "ZodError") {
      return ErrorHandler.createErrorResponse(ErrorHandler.createValidationError(error as any));
    }

    // Inne błędy
    return ErrorHandler.createErrorResponse(new Error("Wystąpił błąd podczas logowania. Spróbuj ponownie."));
  }
};
