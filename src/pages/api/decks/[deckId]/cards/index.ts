import type { APIRoute } from "astro";
// import { z } from "zod"; // Nie używane w trybie testowym
import { DeckCardService } from "../../../../../lib/services/deck-card.service";
import {
  addCardToDeckSchema,
  getDeckCardsQuerySchema,
  deckIdSchema,
} from "../../../../../lib/validators/deck-card.validators";
import { createErrorResponse } from "../../../../../lib/utils/error-handler";

export const prerender = false;

/**
 * GET /api/decks/{deckId}/cards
 * Pobiera listę kart w decku z paginacją i filtrami
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
  try {
    // Walidacja deckId
    const deckIdResult = deckIdSchema.safeParse(params.deckId);
    if (!deckIdResult.success) {
      return createErrorResponse(400, "INVALID_DECK_ID", "Invalid deck ID format");
    }

    // Walidacja parametrów zapytania
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const queryResult = getDeckCardsQuerySchema.safeParse(queryParams);
    if (!queryResult.success) {
      return createErrorResponse(400, "INVALID_QUERY_PARAMS", "Invalid query parameters", {
        errors: queryResult.error.flatten().fieldErrors,
      });
    }

    // Autoryzacja użytkownika - WYŁĄCZONA DLA TESTÓW
    // const user = locals.user;
    // if (!user) {
    //   return createErrorResponse(401, "UNAUTHORIZED", "Authentication required");
    // }

    // Mock user dla testów - nieużywane w trybie testowym
    // const user = { id: "test-user-id" };

    // Inicjalizacja serwisu
    const deckCardService = new DeckCardService(locals.supabase);

    // Sprawdzenie własności decka - WYŁĄCZONE DLA TESTÓW
    // const isOwner = await deckCardService.validateDeckOwnership(deckIdResult.data, user.id);
    // if (!isOwner) {
    //   return createErrorResponse(403, "FORBIDDEN", "You do not have permission to access this deck");
    // }

    // Pobranie kart z decka
    const result = await deckCardService.getDeckCards(deckIdResult.data, queryResult.data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching deck cards:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to fetch deck cards");
  }
};

/**
 * POST /api/decks/{deckId}/cards
 * Dodaje kartę do decka
 */
export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    // Walidacja deckId
    const deckIdResult = deckIdSchema.safeParse(params.deckId);
    if (!deckIdResult.success) {
      return createErrorResponse(400, "INVALID_DECK_ID", "Invalid deck ID format");
    }

    // Autoryzacja użytkownika - WYŁĄCZONA DLA TESTÓW
    // const user = locals.user;
    // if (!user) {
    //   return createErrorResponse(401, "UNAUTHORIZED", "Authentication required");
    // }

    // Mock user dla testów - nieużywane w trybie testowym
    // const user = { id: "test-user-id" };

    // Parsowanie i walidacja body
    const body = await request.json();
    const bodyResult = addCardToDeckSchema.safeParse(body);
    if (!bodyResult.success) {
      return createErrorResponse(400, "VALIDATION_ERROR", "Invalid request data", {
        errors: bodyResult.error.flatten().fieldErrors,
      });
    }

    // Inicjalizacja serwisu
    const deckCardService = new DeckCardService(locals.supabase);

    // Sprawdzenie własności decka - WYŁĄCZONE DLA TESTÓW
    // const isOwner = await deckCardService.validateDeckOwnership(deckIdResult.data, user.id);
    // if (!isOwner) {
    //   return createErrorResponse(403, "FORBIDDEN", "You do not have permission to modify this deck");
    // }

    // Dodanie karty do decka
    const result = await deckCardService.addCardToDeck(deckIdResult.data, bodyResult.data);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding card to deck:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return createErrorResponse(409, "CONFLICT", "Card already exists in this deck section");
    }

    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to add card to deck");
  }
};
