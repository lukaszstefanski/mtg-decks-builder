import { z } from 'zod';

/**
 * Schema dla dodawania karty do decka (POST /api/decks/{deckId}/cards)
 */
export const addCardToDeckSchema = z.object({
  card_id: z.string().uuid('Invalid card ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(4, 'Maximum 4 copies allowed'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  is_sideboard: z.boolean().default(false)
});

/**
 * Schema dla aktualizacji karty w decku (PUT /api/decks/{deckId}/cards/{cardId})
 */
export const updateDeckCardSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(4, 'Maximum 4 copies allowed').optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  is_sideboard: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

/**
 * Schema dla parametrów zapytania GET /api/decks/{deckId}/cards
 */
export const getDeckCardsQuerySchema = z.object({
  is_sideboard: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0, 'Page must be greater than 0').optional(),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional()
});

/**
 * Schema dla walidacji UUID deckId
 */
export const deckIdSchema = z.string().uuid('Invalid deck ID format');

/**
 * Schema dla walidacji UUID cardId
 */
export const cardIdSchema = z.string().uuid('Invalid card ID format');

/**
 * Typy TypeScript wygenerowane z schematów Zod
 */
export type AddCardToDeckInput = z.infer<typeof addCardToDeckSchema>;
export type UpdateDeckCardInput = z.infer<typeof updateDeckCardSchema>;
export type GetDeckCardsQuery = z.infer<typeof getDeckCardsQuerySchema>;
