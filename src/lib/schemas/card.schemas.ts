import { z } from "zod";

// ============================================================================
// CARD VALIDATION SCHEMAS
// ============================================================================

/**
 * Schema for card search query parameters (GET /api/cards/search)
 */
export const CardSearchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "Query string cannot be empty")
    .max(100, "Query string too long")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Query contains invalid characters")
    .optional(),
  colors: z
    .string()
    .transform((val) => val.split(",").map((c) => c.trim().toUpperCase()))
    .refine((colors) => colors.every((c) => ["W", "U", "B", "R", "G", "C"].includes(c)), {
      message: "Invalid color codes. Use W, U, B, R, G, C",
    })
    .refine((colors) => colors.length <= 5, {
      message: "Maximum 5 colors allowed",
    })
    .optional(),
  mana_cost: z
    .string()
    .max(20, "Mana cost string too long")
    .regex(/^[0-9XWUBRG{}\s-]+$/, "Invalid mana cost format")
    .optional(),
  type: z
    .string()
    .transform((val) => val.split(",").map((t) => t.trim()))
    .refine((types) => types.every((t) => t.length > 0 && t.length <= 50), {
      message: "Type strings cannot be empty and must be max 50 characters",
    })
    .refine((types) => types.length <= 10, {
      message: "Maximum 10 types allowed",
    })
    .optional(),
  rarity: z
    .string()
    .transform((val) => val.split(",").map((r) => r.trim()))
    .refine((rarities) => rarities.every((r) => ["Common", "Uncommon", "Rare", "Mythic"].includes(r)), {
      message: "Invalid rarity. Use Common, Uncommon, Rare, Mythic",
    })
    .refine((rarities) => rarities.length <= 4, {
      message: "Maximum 4 rarities allowed",
    })
    .optional(),
  set: z
    .string()
    .max(50, "Set name too long")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Set name contains invalid characters")
    .optional(),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be greater than 0")
    .max(1000, "Page number too high")
    .default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .default(50),
  sort: z.enum(["name", "mana_cost", "created_at"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Schema for card ID parameter (GET /api/cards/{cardId})
 */
export const CardIdSchema = z.string().uuid("Invalid card ID format");

/**
 * Schema for creating a new card (POST /api/cards)
 */
export const CreateCardSchema = z.object({
  scryfall_id: z.string().min(1, "Scryfall ID is required"),
  name: z.string().min(1, "Card name is required").max(200, "Card name too long"),
  mana_cost: z.string().max(20, "Mana cost too long").nullable().optional(),
  type: z.string().min(1, "Card type is required").max(100, "Card type too long"),
  rarity: z.enum(["common", "uncommon", "rare", "special", "mythic"], {
    errorMap: () => ({ message: "Invalid rarity. Use common, uncommon, rare, special, or mythic" }),
  }),
  image_url: z.string().url("Invalid image URL").nullable().optional(),
});

/**
 * Schema for updating a card (PUT /api/cards/{cardId})
 */
export const UpdateCardSchema = z
  .object({
    name: z.string().min(1, "Card name is required").max(200, "Card name too long").optional(),
    mana_cost: z.string().max(20, "Mana cost too long").nullable().optional(),
    type: z.string().min(1, "Card type is required").max(100, "Card type too long").optional(),
    rarity: z
      .enum(["common", "uncommon", "rare", "special", "mythic"], {
        errorMap: () => ({ message: "Invalid rarity. Use common, uncommon, rare, special or mythic" }),
      })
      .optional(),
    image_url: z.string().url("Invalid image URL").nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for card response validation
 */
export const CardResponseSchema = z.object({
  id: z.string().uuid(),
  scryfall_id: z.string(),
  name: z.string(),
  mana_cost: z.string().nullable(),
  type: z.string(),
  rarity: z.string(),
  image_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
});

/**
 * Schema for card search response
 */
export const CardSearchResponseSchema = z.object({
  cards: z.array(CardResponseSchema),
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

export type CardSearchQuery = z.infer<typeof CardSearchQuerySchema>;
export type CardResponse = z.infer<typeof CardResponseSchema>;
export type CardSearchResponse = z.infer<typeof CardSearchResponseSchema>;
export type CreateCard = z.infer<typeof CreateCardSchema>;
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;
