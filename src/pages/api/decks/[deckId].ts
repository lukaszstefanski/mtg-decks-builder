import type { APIRoute } from "astro";
import { DeckService } from "../../../lib/services/deck.service";
import {
  UpdateDeckRequestSchema,
  DeckIdSchema,
  DeleteDeckRequestSchema,
  type UpdateDeckRequest,
} from "../../../lib/schemas/deck.schemas";
import { ErrorHandler, withErrorHandling, AuthenticationError } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * GET /api/decks/{deckId} - Get deck details with cards for authenticated user
 */
export const GET: APIRoute = withErrorHandling(async ({ params, locals }) => {
  const requestId = locals.requestId;

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await locals.supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthenticationError("User not authenticated");
  }

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  logger.logBusiness("Get deck details", "API", {
    requestId,
    deckId,
    userId: user.id,
  });

  // Get deck details using service with user filtering
  const deckService = new DeckService(locals.supabase);
  const deck = await deckService.getDeck(deckId, user.id);

  logger.logBusiness("Deck details retrieved", "API", {
    requestId,
    deckId,
    userId: user.id,
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

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await locals.supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthenticationError("User not authenticated");
  }

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  // Parse and validate request body
  const body = await request.json();
  const validationResult = UpdateDeckRequestSchema.safeParse(body);

  if (!validationResult.success) {
    throw ErrorHandler.createValidationError(validationResult.error);
  }

  const updateData: UpdateDeckRequest = validationResult.data;

  logger.logBusiness("Update deck", "API", {
    requestId,
    deckId,
    userId: user.id,
    updateFields: Object.keys(updateData),
  });

  // Update deck using service with authenticated user ID
  const deckService = new DeckService(locals.supabase);
  const updatedDeck = await deckService.updateDeck({
    ...updateData,
    deck_id: deckId,
    user_id: user.id,
  });

  logger.logBusiness("Deck updated", "API", {
    requestId,
    deckId,
    userId: user.id,
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

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await locals.supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthenticationError("User not authenticated");
  }

  // Validate deck ID
  const deckIdResult = DeckIdSchema.safeParse(params.deckId);
  if (!deckIdResult.success) {
    throw ErrorHandler.createValidationError(deckIdResult.error);
  }

  const deckId = deckIdResult.data;

  // Parse and validate request body (empty for DELETE)
  const body = await request.json();
  const validationResult = DeleteDeckRequestSchema.safeParse(body);

  if (!validationResult.success) {
    throw ErrorHandler.createValidationError(validationResult.error);
  }

  logger.logBusiness("Delete deck", "API", {
    requestId,
    deckId,
    userId: user.id,
  });

  // Delete deck using service with authenticated user ID
  const deckService = new DeckService(locals.supabase);
  await deckService.deleteDeck({
    deck_id: deckId,
    user_id: user.id,
  });

  logger.logBusiness("Deck deleted", "API", {
    requestId,
    deckId,
    userId: user.id,
  });

  return new Response(null, {
    status: 204,
  });
});
