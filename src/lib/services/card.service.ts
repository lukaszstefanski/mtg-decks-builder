import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  CardSearchQuery,
  CardResponse,
  CardSearchResponse,
  CreateCard,
  UpdateCard,
} from "../schemas/card.schemas";
import { ErrorHandler, NotFoundError } from "../utils/error-handler";
import { logger } from "../utils/logger";

/**
 * Service class for card management operations
 * Handles all database operations related to cards
 */
export class CardService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Search cards with filters and pagination
   * Optimized with select() to limit returned columns and improve performance
   */
  async searchCards(query: CardSearchQuery): Promise<CardSearchResponse> {
    const { q, colors, mana_cost, type, rarity, set, page, limit, sort, order } = query;
    const offset = (page - 1) * limit;

    try {
      // Optimize query by selecting only required columns
      const selectColumns = "id, scryfall_id, name, mana_cost, type, rarity, image_url, created_at";

      // Build query with filters
      let queryBuilder = this.supabase.from("cards").select(selectColumns);

      // Apply text search filter with case-insensitive search
      if (q) {
        queryBuilder = queryBuilder.ilike("name", `%${q}%`);
      }

      // Apply mana cost filter
      if (mana_cost) {
        queryBuilder = queryBuilder.ilike("mana_cost", `%${mana_cost}%`);
      }

      // Apply type filter
      if (type && type.length > 0) {
        queryBuilder = queryBuilder.in("type", type);
      }

      // Apply rarity filter
      if (rarity && rarity.length > 0) {
        queryBuilder = queryBuilder.in("rarity", rarity);
      }

      // Apply set filter (assuming set is stored in a field, adjust as needed)
      if (set) {
        // Note: This assumes there's a set field in cards table
        // If not available, this filter will be ignored
        queryBuilder = queryBuilder.ilike("type", `%${set}%`); // Placeholder - adjust based on actual schema
      }

      // Apply color filter (assuming colors are stored in mana_cost or a separate field)
      if (colors && colors.length > 0) {
        // This is a simplified color filter - adjust based on how colors are stored
        const colorFilters = colors.map((color) => `mana_cost.ilike.%{${color}}%`);
        queryBuilder = queryBuilder.or(colorFilters.join(","));
      }

      // Apply sorting with index optimization
      queryBuilder = queryBuilder.order(sort, { ascending: order === "asc" });

      // Get total count for pagination with same filters (optimized)
      let countQuery = this.supabase.from("cards").select("*", { count: "exact", head: true });

      // Apply same filters to count query
      if (q) {
        countQuery = countQuery.ilike("name", `%${q}%`);
      }
      if (mana_cost) {
        countQuery = countQuery.ilike("mana_cost", `%${mana_cost}%`);
      }
      if (type && type.length > 0) {
        countQuery = countQuery.in("type", type);
      }
      if (rarity && rarity.length > 0) {
        countQuery = countQuery.in("rarity", rarity);
      }
      if (set) {
        countQuery = countQuery.ilike("type", `%${set}%`);
      }
      if (colors && colors.length > 0) {
        const colorFilters = colors.map((color) => `mana_cost.ilike.%{${color}}%`);
        countQuery = countQuery.or(colorFilters.join(","));
      }

      // Execute count and data queries in parallel for better performance
      const [countResult, dataResult] = await Promise.all([countQuery, queryBuilder.range(offset, offset + limit - 1)]);

      const { count, error: countError } = countResult;
      const { data: cards, error } = dataResult;

      if (countError) {
        logger.logDatabase("count", "cards", undefined, countError);
        throw ErrorHandler.handleSupabaseError(countError, "searchCards count");
      }

      if (error) {
        logger.logDatabase("select", "cards", undefined, error);
        throw ErrorHandler.handleSupabaseError(error, "searchCards select");
      }

      const total = count || 0;
      const pages = Math.ceil(total / limit);

      return {
        cards: (cards || []).map((card) => this.transformCard(card)),
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      logger.error("Card search failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        query: { q, colors, mana_cost, type, rarity, set, page, limit, sort, order },
      });
      throw error;
    }
  }

  /**
   * Get a single card by ID
   */
  async getCardById(cardId: string): Promise<CardResponse> {
    const { data: card, error } = await this.supabase.from("cards").select("*").eq("id", cardId).single();

    if (error) {
      logger.logDatabase("select", "cards", undefined, error);

      if (error.code === "PGRST116") {
        throw new NotFoundError("Card not found");
      }

      throw ErrorHandler.handleSupabaseError(error, "getCardById");
    }

    if (!card) {
      throw new NotFoundError("Card not found");
    }

    return this.transformCard(card);
  }

  /**
   * Create a new card or get existing one if it already exists
   */
  async createCard(cardData: CreateCard): Promise<CardResponse> {
    try {
      // First check if card already exists by scryfall_id
      if (cardData.scryfall_id) {
        const { data: existingCard, error: findError } = await this.supabase
          .from("cards")
          .select("*")
          .eq("scryfall_id", cardData.scryfall_id)
          .single();

        if (findError && findError.code !== "PGRST116") {
          // PGRST116 = no rows returned
          logger.logDatabase("select", "cards", undefined, findError);
          throw ErrorHandler.handleSupabaseError(findError, "createCard findExisting");
        }

        if (existingCard) {
          logger.logBusiness("Card already exists, returning existing", "Service", {
            cardId: existingCard.id,
            cardName: existingCard.name,
            scryfallId: cardData.scryfall_id,
          });
          return this.transformCard(existingCard);
        }
      }

      // Card doesn't exist, create new one
      const { data: card, error } = await this.supabase.from("cards").insert([cardData]).select().single();

      if (error) {
        logger.logDatabase("insert", "cards", undefined, error);
        throw ErrorHandler.handleSupabaseError(error, "createCard");
      }

      if (!card) {
        throw new Error("Failed to create card");
      }

      logger.logBusiness("Card created", "Service", {
        cardId: card.id,
        cardName: card.name,
      });

      return this.transformCard(card);
    } catch (error) {
      logger.error("Card creation failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        cardData,
      });
      throw error;
    }
  }

  /**
   * Update an existing card
   */
  async updateCard(cardId: string, updateData: UpdateCard): Promise<CardResponse> {
    try {
      const { data: card, error } = await this.supabase
        .from("cards")
        .update(updateData)
        .eq("id", cardId)
        .select()
        .single();

      if (error) {
        logger.logDatabase("update", "cards", undefined, error);

        if (error.code === "PGRST116") {
          throw new NotFoundError("Card not found");
        }

        throw ErrorHandler.handleSupabaseError(error, "updateCard");
      }

      if (!card) {
        throw new NotFoundError("Card not found");
      }

      logger.logBusiness("Card updated", "Service", {
        cardId: card.id,
        cardName: card.name,
        updatedFields: Object.keys(updateData),
      });

      return this.transformCard(card);
    } catch (error) {
      logger.error("Card update failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        cardId,
        updateData,
      });
      throw error;
    }
  }

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<void> {
    try {
      const { error } = await this.supabase.from("cards").delete().eq("id", cardId);

      if (error) {
        logger.logDatabase("delete", "cards", undefined, error);
        throw ErrorHandler.handleSupabaseError(error, "deleteCard");
      }

      logger.logBusiness("Card deleted", "Service", {
        cardId,
      });
    } catch (error) {
      logger.error("Card deletion failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        cardId,
      });
      throw error;
    }
  }

  /**
   * Transform card data from database to response format
   */
  public transformCard(cardData: Database["public"]["Tables"]["cards"]["Row"]): CardResponse {
    return {
      id: cardData.id,
      scryfall_id: cardData.scryfall_id,
      name: cardData.name,
      mana_cost: cardData.mana_cost,
      type: cardData.type,
      rarity: cardData.rarity,
      image_url: cardData.image_url,
      created_at: cardData.created_at || new Date().toISOString(),
    };
  }
}
