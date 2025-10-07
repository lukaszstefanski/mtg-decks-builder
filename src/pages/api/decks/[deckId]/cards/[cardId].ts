import type { APIRoute } from "astro";
import { DeckCardService } from "../../../../../lib/services/deck-card.service";
import { updateDeckCardSchema, deckIdSchema, cardIdSchema } from "../../../../../lib/validators/deck-card.validators";
import { createErrorResponse } from "../../../../../lib/utils/error-handler";

export const prerender = false;

/**
 * PUT /api/decks/{deckId}/cards/{cardId}
 * Aktualizuje kartę w decku
 */
export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // Walidacja deckId i cardId
    const deckIdResult = deckIdSchema.safeParse(params.deckId);
    const cardIdResult = cardIdSchema.safeParse(params.cardId);

    if (!deckIdResult.success) {
      return createErrorResponse(400, "INVALID_DECK_ID", "Invalid deck ID format");
    }

    if (!cardIdResult.success) {
      return createErrorResponse(400, "INVALID_CARD_ID", "Invalid card ID format");
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
    const bodyResult = updateDeckCardSchema.safeParse(body);
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

    // Aktualizacja karty w decku
    const result = await deckCardService.updateDeckCard(deckIdResult.data, cardIdResult.data, bodyResult.data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating deck card:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return createErrorResponse(404, "NOT_FOUND", "Card not found in deck");
    }

    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to update deck card");
  }
};

/**
 * DELETE /api/decks/{deckId}/cards/{cardId}
 * Usuwa kartę z decka
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // Walidacja deckId i cardId
    const deckIdResult = deckIdSchema.safeParse(params.deckId);
    const cardIdResult = cardIdSchema.safeParse(params.cardId);

    if (!deckIdResult.success) {
      return createErrorResponse(400, "INVALID_DECK_ID", "Invalid deck ID format");
    }

    if (!cardIdResult.success) {
      return createErrorResponse(400, "INVALID_CARD_ID", "Invalid card ID format");
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
    //   return createErrorResponse(403, "FORBIDDEN", "You do not have permission to modify this deck");
    // }

    // Usunięcie karty z decka
    await deckCardService.removeCardFromDeck(deckIdResult.data, cardIdResult.data);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error removing card from deck:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return createErrorResponse(404, "NOT_FOUND", "Card not found in deck");
    }

    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to remove card from deck");
  }
};
