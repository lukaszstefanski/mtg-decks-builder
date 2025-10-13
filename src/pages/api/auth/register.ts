import type { APIRoute } from "astro";
import { registerSchema } from "../../../lib/schemas/auth.schemas";
import { createServerSupabaseClient } from "../../../db/supabase.server";
import { ErrorHandler } from "../../../lib/utils/error-handler";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    // Walidacja danych wejściowych
    const validatedData = registerSchema.parse(body);
    const { email, password, username } = validatedData;

    // Utworzenie klienta Supabase z obsługą ciasteczek
    const supabase = createServerSupabaseClient(cookies);

    // Próba rejestracji
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return ErrorHandler.createErrorResponse(
        ErrorHandler.handleSupabaseAuthError(error, "registration")
      );
    }

    if (!data.user) {
      return ErrorHandler.createErrorResponse(
        new Error("Wystąpił błąd podczas rejestracji")
      );
    }

    // Tworzenie rekordu w tabeli users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        supabase_auth_id: data.user.id,
        email: data.user.email || email,
        username: username,
      });

    if (userError) {
      console.error("Error creating user record:", userError);
      return ErrorHandler.createErrorResponse(
        new Error("Wystąpił błąd podczas tworzenia profilu użytkownika")
      );
    }

    // Pobieranie utworzonego rekordu użytkownika
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('id, email, username')
      .eq('supabase_auth_id', data.user.id)
      .single();

    if (fetchError || !userData) {
      console.error("Error fetching created user:", fetchError);
      return ErrorHandler.createErrorResponse(
        new Error("Wystąpił błąd podczas pobierania danych użytkownika")
      );
    }

    // Pomyślna rejestracja
    return new Response(
      JSON.stringify({ 
        message: "Rejestracja udana! Możesz się teraz zalogować.",
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
        }
      }),
      { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Registration endpoint error:", error);
    
    // Obsługa błędów walidacji Zod
    if (error instanceof Error && error.name === "ZodError") {
      return ErrorHandler.createErrorResponse(
        ErrorHandler.createValidationError(error as any)
      );
    }

    // Inne błędy
    return ErrorHandler.createErrorResponse(
      new Error("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.")
    );
  }
};
