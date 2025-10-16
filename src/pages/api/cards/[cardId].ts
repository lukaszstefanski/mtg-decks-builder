import type { APIRoute } from "astro";
import { CardService } from "../../../lib/services/card.service";
import { CardIdSchema, UpdateCardSchema } from "../../../lib/schemas/card.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * GET /api/cards/{cardId} - Get a single card by ID
 *
 * Path parameters:
 * - cardId: UUID - The unique identifier of the card
 */
export const GET: APIRoute = withErrorHandling(async ({ params, locals }) => {
  const requestId = locals.requestId;
  const { cardId } = params;

  logger.logBusiness("Get card by ID", "API", {
    requestId,
    cardId,
  });

  // Validate card ID format
  const cardIdResult = CardIdSchema.safeParse(cardId);
  if (!cardIdResult.success) {
    throw ErrorHandler.createValidationError(cardIdResult.error);
  }

  // Get card using service
  const cardService = new CardService(locals.supabase);
  const card = await cardService.getCardById(cardIdResult.data);

  logger.logBusiness("Card retrieved", "API", {
    requestId,
    cardId: card.id,
    cardName: card.name,
  });

  return new Response(JSON.stringify(card), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // 1 hour cache for individual cards
      ETag: `"${card.id}-${card.created_at}"`, // ETag for cache validation
    },
  });
});

/**
 * PUT /api/cards/{cardId} - Update a card by ID
 *
 * Path parameters:
 * - cardId: UUID - The unique identifier of the card
 *
 * Request body:
 * - name: string (optional) - Card name
 * - mana_cost: string (optional) - Mana cost
 * - type: string (optional) - Card type
 * - rarity: string (optional) - Card rarity
 * - image_url: string (optional) - Image URL
 */
export const PUT: APIRoute = withErrorHandling(async ({ params, request, locals }) => {
  const requestId = locals.requestId;
  const { cardId } = params;

  logger.logBusiness("Update card by ID", "API", {
    requestId,
    cardId,
  });

  // Validate card ID format
  const cardIdResult = CardIdSchema.safeParse(cardId);
  if (!cardIdResult.success) {
    throw ErrorHandler.createValidationError(cardIdResult.error);
  }

  // Parse and validate request body
  const body = await request.json();
  const updateResult = UpdateCardSchema.safeParse(body);
  if (!updateResult.success) {
    throw ErrorHandler.createValidationError(updateResult.error);
  }

  // Update card using service
  const cardService = new CardService(locals.supabase);
  const card = await cardService.updateCard(cardIdResult.data, updateResult.data);

  logger.logBusiness("Card updated", "API", {
    requestId,
    cardId: card.id,
    cardName: card.name,
    updatedFields: Object.keys(updateResult.data),
  });

  return new Response(JSON.stringify(card), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache", // Don't cache updated content
    },
  });
});

/**
 * DELETE /api/cards/{cardId} - Delete a card by ID
 *
 * Path parameters:
 * - cardId: UUID - The unique identifier of the card
 */
export const DELETE: APIRoute = withErrorHandling(async ({ params, locals }) => {
  const requestId = locals.requestId;
  const { cardId } = params;

  logger.logBusiness("Delete card by ID", "API", {
    requestId,
    cardId,
  });

  // Validate card ID format
  const cardIdResult = CardIdSchema.safeParse(cardId);
  if (!cardIdResult.success) {
    throw ErrorHandler.createValidationError(cardIdResult.error);
  }

  // Delete card using service
  const cardService = new CardService(locals.supabase);
  await cardService.deleteCard(cardIdResult.data);

  logger.logBusiness("Card deleted", "API", {
    requestId,
    cardId: cardIdResult.data,
  });

  return new Response(null, {
    status: 204, // No Content
    headers: {
      "Cache-Control": "no-cache",
    },
  });
});
