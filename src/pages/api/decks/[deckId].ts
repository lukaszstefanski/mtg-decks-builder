import type { APIRoute } from "astro";
import { DeckService } from "../../../lib/services/deck.service";
import {
  UpdateDeckSchema,
  DeckIdSchema,
  DeleteDeckSchema,
  type UpdateDeckInput,
  type DeleteDeckInput,
} from "../../../lib/schemas/deck.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * GET /api/decks/{deckId} - Get deck details with cards
 */
export const GET: APIRoute = withErrorHandling(async ({ params, locals }) => {
  const requestId = locals.requestId;

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  logger.logBusiness("Get deck details", "API", {
    requestId,
    deckId,
  });

  // Get deck details using service (no user filtering)
  const deckService = new DeckService(locals.supabase);
  const deck = await deckService.getDeckById(deckId);

  logger.logBusiness("Deck details retrieved", "API", {
    requestId,
    deckId,
    cardCount: deck.cards.length,
  });

  return new Response(JSON.stringify(deck), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/**
 * PUT /api/decks/{deckId} - Update deck
 */
export const PUT: APIRoute = withErrorHandling(async ({ params, request, locals }) => {
  const requestId = locals.requestId;

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  // Parse and validate request body
  const body = await request.json();
  const validationResult = UpdateDeckSchema.safeParse(body);

  if (!validationResult.success) {
    throw ErrorHandler.createValidationError(validationResult.error);
  }

  const updateData: UpdateDeckInput = validationResult.data;

  logger.logBusiness("Update deck", "API", {
    requestId,
    deckId,
    updateFields: Object.keys(updateData),
  });

  // Update deck using service
  const deckService = new DeckService(locals.supabase);
  const updatedDeck = await deckService.updateDeck({
    ...updateData,
    deck_id: deckId,
  });

  logger.logBusiness("Deck updated", "API", {
    requestId,
    deckId,
    deckName: updatedDeck.name,
  });

  return new Response(JSON.stringify(updatedDeck), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/**
 * DELETE /api/decks/{deckId} - Delete deck
 */
export const DELETE: APIRoute = withErrorHandling(async ({ params, request, locals }) => {
  const requestId = locals.requestId;

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  // Parse and validate request body
  const body = await request.json();
  const validationResult = DeleteDeckSchema.safeParse(body);

  if (!validationResult.success) {
    throw ErrorHandler.createValidationError(validationResult.error);
  }

  const deleteData: DeleteDeckInput = validationResult.data;

  logger.logBusiness("Delete deck", "API", {
    requestId,
    deckId,
    userId: deleteData.user_id,
  });

  // Delete deck using service
  const deckService = new DeckService(locals.supabase);
  await deckService.deleteDeck({
    deck_id: deckId,
    user_id: deleteData.user_id,
  });

  logger.logBusiness("Deck deleted", "API", {
    requestId,
    deckId,
  });

  return new Response(null, {
    status: 204,
  });
});
