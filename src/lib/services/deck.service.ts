import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  CreateDeckInput,
  UpdateDeckInput,
  DeckListQuery,
  DeckResponse,
  DeckDetailResponse,
  DeckListResponse,
  AddCardToDeckInput,
  UpdateDeckCardInput,
  DeckCardResponse,
} from "../schemas/deck.schemas";
import type { CreateDeckCommand, UpdateDeckCommand, DeleteDeckCommand } from "../../types";
import { ErrorHandler, NotFoundError, AuthorizationError } from "../utils/error-handler";
import { logger } from "../utils/logger";

/**
 * Service class for deck management operations
 * Handles all database operations related to decks
 */
export class DeckService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get paginated list of decks for a user
   */
  async getDecks(userId: string, query: DeckListQuery): Promise<DeckListResponse> {
    const { search, format, page, limit, sort, order } = query;
    const offset = (page - 1) * limit;

    // Build query with filters
    let queryBuilder = this.supabase.from("decks").select("*").eq("user_id", userId);

    // Apply search filter
    if (search) {
      queryBuilder = queryBuilder.ilike("name", `%${search}%`);
    }

    // Apply format filter
    if (format) {
      queryBuilder = queryBuilder.eq("format", format);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sort, { ascending: order === "asc" });

    // Get total count for pagination
    const { count, error: countError } = await this.supabase
      .from("decks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      logger.logDatabase("count", "decks", undefined, countError);
      throw ErrorHandler.handleSupabaseError(countError, "getDecks count");
    }

    // Get paginated results
    const { data: decks, error } = await queryBuilder.range(offset, offset + limit - 1);

    if (error) {
      logger.logDatabase("select", "decks", undefined, error);
      throw ErrorHandler.handleSupabaseError(error, "getDecks select");
    }

    const total = count || 0;
    const pages = Math.ceil(total / limit);

    return {
      decks: (decks || []).map(deck => this.transformDeck(deck)),
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }


  /**
   * Create a new deck
   */
  async createDeck(command: CreateDeckCommand): Promise<DeckResponse> {
    const { user_id, ...deckData } = command;

    const { data: deck, error } = await this.supabase
      .from("decks")
      .insert({
        ...deckData,
        user_id,
        deck_size: 0,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.logDatabase("insert", "decks", undefined, error);
      throw ErrorHandler.handleSupabaseError(error, "createDeck");
    }

    return this.transformDeck(deck);
  }

  /**
   * Update an existing deck
   */
  async updateDeck(command: UpdateDeckCommand): Promise<DeckResponse> {
    const { deck_id, user_id, ...updateData } = command;

    // First verify ownership
    const { data: existingDeck, error: ownershipError } = await this.supabase
      .from("decks")
      .select("id")
      .eq("id", deck_id)
      .eq("user_id", user_id)
      .single();

    if (ownershipError || !existingDeck) {
      throw new NotFoundError("Deck not found or access denied");
    }

    // Update deck
    const { data: deck, error } = await this.supabase
      .from("decks")
      .update({
        ...updateData,
        last_modified: new Date().toISOString(),
      })
      .eq("id", deck_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      logger.logDatabase("update", "decks", undefined, error);
      throw ErrorHandler.handleSupabaseError(error, "updateDeck");
    }

    return this.transformDeck(deck);
  }

  /**
   * Delete a deck
   */
  async deleteDeck(command: DeleteDeckCommand): Promise<void> {
    const { deck_id, user_id } = command;

    // First verify ownership
    const { data: existingDeck, error: ownershipError } = await this.supabase
      .from("decks")
      .select("id")
      .eq("id", deck_id)
      .eq("user_id", user_id)
      .single();

    if (ownershipError || !existingDeck) {
      throw new NotFoundError("Deck not found or access denied");
    }

    // Delete deck (cascade will handle deck_cards)
    const { error } = await this.supabase.from("decks").delete().eq("id", deck_id).eq("user_id", user_id);

    if (error) {
      logger.logDatabase("delete", "decks", undefined, error);
      throw ErrorHandler.handleSupabaseError(error, "deleteDeck");
    }
  }

  /**
   * Add a card to a deck
   */
  async addCardToDeck(deckId: string, userId: string, cardData: AddCardToDeckInput): Promise<DeckCardResponse> {
    // Verify deck ownership
    const { data: deck, error: deckError } = await this.supabase
      .from("decks")
      .select("id")
      .eq("id", deckId)
      .eq("user_id", userId)
      .single();

    if (deckError || !deck) {
      throw new Error("Deck not found or access denied");
    }

    // Check if card already exists in deck
    const { data: existingCard, error: existingError } = await this.supabase
      .from("deck_cards")
      .select("id, quantity")
      .eq("deck_id", deckId)
      .eq("card_id", cardData.card_id)
      .eq("is_sideboard", cardData.is_sideboard)
      .single();

    if (existingCard) {
      // Update existing card quantity
      const newQuantity = existingCard.quantity + cardData.quantity;
      const { data: updatedCard, error: updateError } = await this.supabase
        .from("deck_cards")
        .update({ quantity: newQuantity })
        .eq("id", existingCard.id)
        .select(
          `
          *,
          cards (
            id,
            name,
            mana_cost,
            type,
            rarity,
            image_url
          )
        `
        )
        .single();

      if (updateError) {
        throw new Error(`Failed to update card quantity: ${updateError.message}`);
      }

      return this.transformDeckCard(updatedCard);
    }

    // Add new card to deck
    const { data: deckCard, error: addError } = await this.supabase
      .from("deck_cards")
      .insert({
        deck_id: deckId,
        card_id: cardData.card_id,
        quantity: cardData.quantity,
        notes: cardData.notes,
        is_sideboard: cardData.is_sideboard,
        added_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        cards (
          id,
          name,
          mana_cost,
          type,
          rarity,
          image_url
        )
      `
      )
      .single();

    if (addError) {
      throw new Error(`Failed to add card to deck: ${addError.message}`);
    }

    return this.transformDeckCard(deckCard);
  }

  /**
   * Update a card in a deck
   */
  async updateDeckCard(
    deckId: string,
    cardId: string,
    userId: string,
    updateData: UpdateDeckCardInput
  ): Promise<DeckCardResponse> {
    // Verify deck ownership
    const { data: deck, error: deckError } = await this.supabase
      .from("decks")
      .select("id")
      .eq("id", deckId)
      .eq("user_id", userId)
      .single();

    if (deckError || !deck) {
      throw new Error("Deck not found or access denied");
    }

    // Update deck card
    const { data: deckCard, error: updateError } = await this.supabase
      .from("deck_cards")
      .update(updateData)
      .eq("deck_id", deckId)
      .eq("card_id", cardId)
      .select(
        `
        *,
        cards (
          id,
          name,
          mana_cost,
          type,
          rarity,
          image_url
        )
      `
      )
      .single();

    if (updateError) {
      if (updateError.code === "PGRST116") {
        throw new Error("Card not found in deck");
      }
      throw new Error(`Failed to update deck card: ${updateError.message}`);
    }

    return this.transformDeckCard(deckCard);
  }

  /**
   * Remove a card from a deck
   */
  async removeCardFromDeck(deckId: string, cardId: string, userId: string): Promise<void> {
    // Verify deck ownership
    const { data: deck, error: deckError } = await this.supabase
      .from("decks")
      .select("id")
      .eq("id", deckId)
      .eq("user_id", userId)
      .single();

    if (deckError || !deck) {
      throw new Error("Deck not found or access denied");
    }

    // Remove card from deck
    const { error } = await this.supabase.from("deck_cards").delete().eq("deck_id", deckId).eq("card_id", cardId);

    if (error) {
      throw new Error(`Failed to remove card from deck: ${error.message}`);
    }
  }

  /**
   * Get all decks (no user filtering) - for testing purposes
   */
  async getAllDecks(query: DeckListQuery): Promise<DeckListResponse> {
    const { search, format, page, limit, sort, order } = query;
    const offset = (page - 1) * limit;

    // Build query with filters (no user filtering)
    let queryBuilder = this.supabase.from("decks").select("*");

    // Apply search filter
    if (search) {
      queryBuilder = queryBuilder.ilike("name", `%${search}%`);
    }

    // Apply format filter
    if (format) {
      queryBuilder = queryBuilder.eq("format", format);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sort, { ascending: order === "asc" });

    // Get total count for pagination
    let countQuery = this.supabase
      .from("decks")
      .select("*", { count: "exact", head: true });

    if (search) {
      countQuery = countQuery.ilike("name", `%${search}%`);
    }
    if (format) {
      countQuery = countQuery.eq("format", format);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to get deck count: ${countError.message}`);
    }

    // Get paginated results
    const { data: decks, error } = await queryBuilder.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get decks: ${error.message}`);
    }

    return {
      decks: (decks || []).map(deck => this.transformDeck(deck)),
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get deck by ID (no user filtering) - for testing purposes
   */
  async getDeckById(deckId: string): Promise<DeckDetailResponse> {
    // Get deck with cards
    const { data: deckData, error: deckError } = await this.supabase
      .from("decks")
      .select(`
        *,
        deck_cards (
          id,
          card_id,
          quantity,
          is_sideboard,
          notes,
          added_at,
          cards (
            id,
            name,
            mana_cost,
            type,
            rarity,
            image_url
          )
        )
      `)
      .eq("id", deckId)
      .single();

    if (deckError) {
      if (deckError.code === "PGRST116") {
        throw new NotFoundError("Deck not found");
      }
      throw new Error(`Failed to get deck: ${deckError.message}`);
    }

    if (!deckData) {
      throw new NotFoundError("Deck not found");
    }

    // Transform deck cards
    const cards = (deckData.deck_cards || []).map((cardData: any) => this.transformDeckCard(cardData));

    return {
      id: deckData.id,
      name: deckData.name,
      description: deckData.description,
      format: deckData.format,
      deck_size: deckData.deck_size || 0,
      created_at: deckData.created_at || new Date().toISOString(),
      last_modified: deckData.last_modified || deckData.created_at || new Date().toISOString(),
      cards,
    };
  }

  /**
   * Transform deck data from database to response format
   */
  private transformDeck(deckData: any): DeckResponse {
    return {
      id: deckData.id,
      name: deckData.name,
      description: deckData.description,
      format: deckData.format,
      deck_size: deckData.deck_size || 0,
      created_at: deckData.created_at || new Date().toISOString(),
      last_modified: deckData.last_modified || deckData.created_at || new Date().toISOString(),
    };
  }

  /**
   * Transform deck card data from database to response format
   */
  private transformDeckCard(cardData: any): DeckCardResponse {
    return {
      id: cardData.id,
      deck_id: cardData.deck_id,
      card_id: cardData.card_id,
      quantity: cardData.quantity,
      is_sideboard: cardData.is_sideboard,
      notes: cardData.notes,
      added_at: cardData.added_at,
      card: {
        id: cardData.cards.id,
        name: cardData.cards.name,
        mana_cost: cardData.cards.mana_cost,
        type: cardData.cards.type,
        rarity: cardData.cards.rarity,
        image_url: cardData.cards.image_url,
      },
    };
  }
}
