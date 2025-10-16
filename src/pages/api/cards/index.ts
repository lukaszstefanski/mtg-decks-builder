import type { APIRoute } from "astro";
import { CardService } from "../../../lib/services/card.service";
import { CreateCardSchema } from "../../../lib/schemas/card.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";
import { z } from "zod";

export const prerender = false;

// Schema for scryfall_id query parameter
const ScryfallIdSchema = z.string().uuid();

/**
 * GET /api/cards - Get card by Scryfall ID
 * Query parameter: scryfall_id
 */
export const GET: APIRoute = withErrorHandling(async ({ url, locals }) => {
  const requestId = locals.requestId;
  const scryfallId = url.searchParams.get("scryfall_id");

  if (!scryfallId) {
    throw ErrorHandler.createValidationError(new Error("scryfall_id query parameter is required"));
  }

  // Validate scryfall_id parameter
  const scryfallIdResult = ScryfallIdSchema.safeParse(scryfallId);
  if (!scryfallIdResult.success) {
    throw ErrorHandler.createValidationError(scryfallIdResult.error);
  }

  logger.logBusiness("Get card by Scryfall ID", "API", {
    requestId,
    scryfallId: scryfallIdResult.data,
  });

  // Get card by scryfall_id from database
  const cardService = new CardService(locals.supabase);

  try {
    // Search for card by scryfall_id
    const { data: card, error } = await locals.supabase
      .from("cards")
      .select("*")
      .eq("scryfall_id", scryfallIdResult.data)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - card not found
        return new Response(JSON.stringify({ error: "Card not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      logger.logDatabase("select", "cards", undefined, error);
      throw ErrorHandler.handleSupabaseError(error, "getCardByScryfallId");
    }

    if (!card) {
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Transform card data
    const transformedCard = cardService.transformCard(card);

    logger.logBusiness("Card retrieved by Scryfall ID", "API", {
      requestId,
      cardId: card.id,
      cardName: card.name,
    });

    return new Response(JSON.stringify(transformedCard), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    logger.error("Get card by Scryfall ID failed", "API", {
      error: error instanceof Error ? error.message : String(error),
      scryfallId: scryfallIdResult.data,
    });
    throw error;
  }
});

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
