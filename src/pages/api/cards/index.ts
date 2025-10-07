import type { APIRoute } from "astro";
import { CardService } from "../../../lib/services/card.service";
import { CreateCardSchema } from "../../../lib/schemas/card.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * POST /api/cards - Create a new card
 *
 * Request body:
 * - scryfall_id: string - Scryfall ID (required)
 * - name: string - Card name (required)
 * - mana_cost: string - Mana cost (optional)
 * - type: string - Card type (required)
 * - rarity: string - Card rarity (required)
 * - image_url: string - Image URL (optional)
 */
export const POST: APIRoute = withErrorHandling(async ({ request, locals }) => {
  const requestId = locals.requestId;

  logger.logBusiness("Create new card", "API", {
    requestId,
  });

  // Parse and validate request body
  const body = await request.json();
  const cardResult = CreateCardSchema.safeParse(body);
  if (!cardResult.success) {
    throw ErrorHandler.createValidationError(cardResult.error);
  }

  // Create card using service
  const cardService = new CardService(locals.supabase);
  const card = await cardService.createCard(cardResult.data);

  logger.logBusiness("Card created", "API", {
    requestId,
    cardId: card.id,
    cardName: card.name,
  });

  return new Response(JSON.stringify(card), {
    status: 201, // Created
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache", // Don't cache new content
      Location: `/api/cards/${card.id}`, // Location header for created resource
    },
  });
});
