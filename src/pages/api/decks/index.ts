import type { APIRoute } from "astro";
import { DeckService } from "../../../lib/services/deck.service";
import {
  CreateDeckSchema,
  DeckListQuerySchema,
  type CreateDeckInput,
  type DeckListQuery,
} from "../../../lib/schemas/deck.schemas";
import { ErrorHandler, withErrorHandling } from "../../../lib/utils/error-handler";
import { logger } from "../../../lib/utils/logger";

export const prerender = false;

/**
 * GET /api/decks - Get paginated list of decks
 */
export const GET: APIRoute = withErrorHandling(async ({ request, locals }) => {
  const requestId = locals.requestId;

  logger.logBusiness("Get decks list", "API", {
    requestId,
  });

  // Parse and validate query parameters
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const queryResult = DeckListQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    throw ErrorHandler.createValidationError(queryResult.error);
  }

  const query: DeckListQuery = queryResult.data;

  // Get decks using service (no user filtering)
  const deckService = new DeckService(locals.supabase);
  const result = await deckService.getAllDecks(query);

  logger.logBusiness("Decks list retrieved", "API", {
    requestId,
    deckCount: result.decks.length,
    totalDecks: result.pagination.total,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/**
 * POST /api/decks - Create a new deck
 */
export const POST: APIRoute = withErrorHandling(async ({ request, locals }) => {
  const requestId = locals.requestId;

  logger.logBusiness("Create deck", "API", {
    requestId,
  });

  // Parse and validate request body
  const body = await request.json();
  const validationResult = CreateDeckSchema.safeParse(body);

  if (!validationResult.success) {
    throw ErrorHandler.createValidationError(validationResult.error);
  }

  const deckData: CreateDeckInput = validationResult.data;

  // Create deck using service
  const deckService = new DeckService(locals.supabase);
  const newDeck = await deckService.createDeck(deckData);

  logger.logBusiness("Deck created", "API", {
    requestId,
    deckId: newDeck.id,
    deckName: newDeck.name,
    userId: deckData.user_id,
  });

  return new Response(JSON.stringify(newDeck), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});
