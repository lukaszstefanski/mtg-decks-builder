import type { APIRoute } from "astro";
import { CardService } from "../../../lib/services/card.service";
import { CardSearchQuerySchema, type CardSearchQuery } from "../../../lib/schemas/card.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * GET /api/cards/search - Search cards with filters and pagination
 *
 * Query parameters:
 * - q: string - search by card name
 * - colors: string[] - filter by colors (W, U, B, R, G, C)
 * - mana_cost: string - filter by mana cost
 * - type: string[] - filter by card types
 * - rarity: string[] - filter by rarity
 * - set: string - filter by set
 * - page: number - page number (default: 1)
 * - limit: number - results per page (default: 50, max: 100)
 * - sort: string - sort field (name, mana_cost, created_at)
 * - order: string - sort order (asc, desc)
 */
export const GET: APIRoute = withErrorHandling(async ({ request, locals }) => {
  const requestId = locals.requestId;

  logger.logBusiness("Search cards", "API", {
    requestId,
  });

  // Parse and validate query parameters
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const queryResult = CardSearchQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    throw ErrorHandler.createValidationError(queryResult.error);
  }

  const query: CardSearchQuery = queryResult.data;

  // Rate limiting check (simple implementation)
  const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  // Log rate limiting attempt
  logger.logBusiness("Rate limiting check", "API", {
    requestId,
    clientIP,
    query: query.q,
  });

  // Search cards using service
  const cardService = new CardService(locals.supabase);
  const result = await cardService.searchCards(query);

  logger.logBusiness("Cards search completed", "API", {
    requestId,
    cardCount: result.cards.length,
    totalCards: result.pagination.total,
    query: query.q,
    filters: {
      colors: query.colors,
      mana_cost: query.mana_cost,
      type: query.type,
      rarity: query.rarity,
      set: query.set,
    },
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // 5 minutes cache
      "X-Rate-Limit-Limit": "100",
      "X-Rate-Limit-Remaining": "99",
    },
  });
});
