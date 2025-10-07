import { z } from "zod";

// ============================================================================
// DECK VALIDATION SCHEMAS
// ============================================================================

/**
 * Schema for creating a new deck (POST /api/decks)
 */
export const CreateDeckSchema = z.object({
  name: z.string().min(1, "Nazwa decka jest wymagana").max(100, "Nazwa decka nie może przekraczać 100 znaków").trim(),
  description: z.string().max(500, "Opis nie może przekraczać 500 znaków").optional().nullable(),
  format: z.string().min(1, "Format jest wymagany").max(50, "Format nie może przekraczać 50 znaków").trim(),
  user_id: z.string().uuid("Nieprawidłowy format ID użytkownika"),
});

/**
 * Schema for updating a deck (PUT /api/decks/{deckId})
 */
export const UpdateDeckSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa decka jest wymagana")
    .max(100, "Nazwa decka nie może przekraczać 100 znaków")
    .trim()
    .optional(),
  description: z.string().max(500, "Opis nie może przekraczać 500 znaków").optional().nullable(),
  format: z.string().min(1, "Format jest wymagany").max(50, "Format nie może przekraczać 50 znaków").trim().optional(),
  user_id: z.string().uuid("Nieprawidłowy format ID użytkownika"),
});

/**
 * Schema for deck list query parameters (GET /api/decks)
 */
export const DeckListQuerySchema = z.object({
  search: z.string().optional(),
  format: z.string().optional(),
  page: z.coerce.number().int("Strona musi być liczbą całkowitą").min(1, "Strona musi być większa niż 0").default(1),
  limit: z.coerce
    .number()
    .int("Limit musi być liczbą całkowitą")
    .min(1, "Limit musi być większy niż 0")
    .max(100, "Limit nie może przekraczać 100")
    .default(20),
  sort: z.enum(["created_at", "last_modified", "name"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Schema for deck ID parameter
 */
export const DeckIdSchema = z.string().uuid("Nieprawidłowy format ID decka");

/**
 * Schema for deleting a deck (DELETE /api/decks/{deckId})
 */
export const DeleteDeckSchema = z.object({
  user_id: z.string().uuid("Nieprawidłowy format ID użytkownika"),
});

/**
 * Schema for deck card operations
 */
export const AddCardToDeckSchema = z.object({
  card_id: z.string().uuid("Nieprawidłowy format ID karty"),
  quantity: z
    .number()
    .int("Ilość musi być liczbą całkowitą")
    .min(1, "Ilość musi być większa niż 0")
    .max(99, "Ilość nie może przekraczać 99"),
  notes: z.string().max(200, "Notatki nie mogą przekraczać 200 znaków").optional().nullable(),
  is_sideboard: z.boolean().default(false),
});

/**
 * Schema for updating deck card
 */
export const UpdateDeckCardSchema = z.object({
  quantity: z
    .number()
    .int("Ilość musi być liczbą całkowitą")
    .min(1, "Ilość musi być większa niż 0")
    .max(99, "Ilość nie może przekraczać 99")
    .optional(),
  notes: z.string().max(200, "Notatki nie mogą przekraczać 200 znaków").optional().nullable(),
  is_sideboard: z.boolean().optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for deck response validation
 */
export const DeckResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  format: z.string(),
  deck_size: z.number().int().min(0),
  created_at: z.string().datetime(),
  last_modified: z.string().datetime(),
});

/**
 * Schema for card data in deck responses
 */
export const CardDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  mana_cost: z.string().nullable(),
  type: z.string(),
  rarity: z.string(),
  image_url: z.string().url().nullable(),
});

/**
 * Schema for deck card response
 */
export const DeckCardResponseSchema = z.object({
  id: z.string().uuid(),
  deck_id: z.string().uuid(),
  card_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  is_sideboard: z.boolean(),
  notes: z.string().nullable(),
  added_at: z.string().datetime(),
  card: CardDataSchema,
});

/**
 * Schema for detailed deck response
 */
export const DeckDetailResponseSchema = DeckResponseSchema.extend({
  cards: z.array(DeckCardResponseSchema),
});

/**
 * Schema for deck list response
 */
export const DeckListResponseSchema = z.object({
  decks: z.array(DeckResponseSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    pages: z.number().int().min(0),
  }),
});

// ============================================================================
// ERROR RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for API error response
 */
export const ApiErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  status: z.number().int().min(100).max(599),
});

/**
 * Schema for validation error response
 */
export const ValidationErrorResponseSchema = ApiErrorResponseSchema.extend({
  errors: z.record(z.string(), z.array(z.string())),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;
export type DeleteDeckInput = z.infer<typeof DeleteDeckSchema>;
export type DeckListQuery = z.infer<typeof DeckListQuerySchema>;
export type AddCardToDeckInput = z.infer<typeof AddCardToDeckSchema>;
export type UpdateDeckCardInput = z.infer<typeof UpdateDeckCardSchema>;
export type DeckResponse = z.infer<typeof DeckResponseSchema>;
export type CardData = z.infer<typeof CardDataSchema>;
export type DeckCardResponse = z.infer<typeof DeckCardResponseSchema>;
export type DeckDetailResponse = z.infer<typeof DeckDetailResponseSchema>;
export type DeckListResponse = z.infer<typeof DeckListResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;
