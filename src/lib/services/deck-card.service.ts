import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  DeckCardResponse,
  AddCardToDeckRequest,
  UpdateDeckCardRequest,
  DeckCardsResponse,
  PaginationInfo,
} from "../../types";

export class DeckCardService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera karty z decka z paginacją i filtrami
   */
  async getDeckCards(
    deckId: string,
    options: {
      is_sideboard?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<DeckCardsResponse> {
    const { is_sideboard, page = 1, limit = 100 } = options;
    const offset = (page - 1) * limit;

    let query = this.supabase
      .from("deck_cards")
      .select(
        `
        id,
        deck_id,
        card_id,
        quantity,
        is_sideboard,
        notes,
        added_at,
        cards!inner(
          id,
          scryfall_id,
          name,
          mana_cost,
          type,
          rarity,
          image_url
        )
      `
      )
      .eq("deck_id", deckId);

    if (is_sideboard !== undefined) {
      query = query.eq("is_sideboard", is_sideboard);
    }

    // Pobierz całkowitą liczbę rekordów dla paginacji
    const { count } = await this.supabase
      .from("deck_cards")
      .select("*", { count: "exact", head: true })
      .eq("deck_id", deckId);
    const total = count || 0;

    // Pobierz dane z paginacją
    const { data, error } = await query.range(offset, offset + limit - 1).order("added_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch deck cards: ${error.message}`);
    }

    const cards: DeckCardResponse[] = (data || []).map((item) => ({
      id: item.id,
      deck_id: item.deck_id,
      card_id: item.card_id,
      quantity: item.quantity,
      is_sideboard: item.is_sideboard,
      notes: item.notes,
      added_at: item.added_at,
      card: {
        id: item.cards.id,
        scryfall_id: item.cards.scryfall_id,
        name: item.cards.name,
        mana_cost: item.cards.mana_cost,
        type: item.cards.type,
        rarity: item.cards.rarity,
        image_url: item.cards.image_url,
      },
    }));

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { cards, pagination };
  }

  /**
   * Dodaje kartę do decka
   */
  async addCardToDeck(deckId: string, cardData: AddCardToDeckRequest): Promise<DeckCardResponse> {
    // Sprawdź czy karta już istnieje w decku
    const { data: existingCard, error: checkError } = await this.supabase
      .from("deck_cards")
      .select("id, quantity")
      .eq("deck_id", deckId)
      .eq("card_id", cardData.card_id)
      .eq("is_sideboard", cardData.is_sideboard || false)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw new Error(`Failed to check existing card: ${checkError.message}`);
    }

    if (existingCard) {
      throw new Error("Card already exists in this deck section");
    }

    // Pobierz dane karty z bazy danych
    const { data: cardInfo, error: cardError } = await this.supabase
      .from("cards")
      .select("id, scryfall_id, name, mana_cost, type, rarity, image_url")
      .eq("id", cardData.card_id)
      .single();

    if (cardError) {
      throw new Error(`Failed to fetch card information: ${cardError.message}`);
    }

    if (!cardInfo) {
      throw new Error("Card not found");
    }

    // Dodaj kartę do decka
    const { data, error } = await this.supabase
      .from("deck_cards")
      .insert({
        deck_id: deckId,
        card_id: cardData.card_id,
        quantity: cardData.quantity,
        is_sideboard: cardData.is_sideboard || false,
        notes: cardData.notes || null,
      })
      .select(
        `
        id,
        deck_id,
        card_id,
        quantity,
        is_sideboard,
        notes,
        added_at
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to add card to deck: ${error.message}`);
    }

    return {
      id: data.id,
      deck_id: data.deck_id,
      card_id: data.card_id,
      quantity: data.quantity,
      is_sideboard: data.is_sideboard,
      notes: data.notes,
      added_at: data.added_at,
      card: {
        id: cardInfo.id,
        scryfall_id: cardInfo.scryfall_id,
        name: cardInfo.name,
        mana_cost: cardInfo.mana_cost,
        type: cardInfo.type,
        rarity: cardInfo.rarity,
        image_url: cardInfo.image_url,
      },
    };
  }

  /**
   * Aktualizuje kartę w decku
   */
  async updateDeckCard(deckId: string, cardId: string, updateData: UpdateDeckCardRequest): Promise<DeckCardResponse> {
    // Sprawdź czy karta istnieje w decku
    const { data: existingCards, error: checkError } = await this.supabase
      .from("deck_cards")
      .select("id")
      .eq("deck_id", deckId)
      .eq("card_id", cardId);

    if (checkError) {
      throw new Error(`Failed to check existing card: ${checkError.message}`);
    }

    if (!existingCards || existingCards.length === 0) {
      throw new Error("Card not found in deck");
    }

    // Aktualizuj kartę
    const { data, error } = await this.supabase
      .from("deck_cards")
      .update(updateData)
      .eq("deck_id", deckId)
      .eq("card_id", cardId)
      .select(
        `
        id,
        deck_id,
        card_id,
        quantity,
        is_sideboard,
        notes,
        added_at
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to update deck card: ${error.message}`);
    }

    // Pobierz dane karty z bazy danych
    const { data: cardInfo, error: cardError } = await this.supabase
      .from("cards")
      .select("id, scryfall_id, name, mana_cost, type, rarity, image_url")
      .eq("id", data.card_id)
      .single();

    if (cardError) {
      throw new Error(`Failed to fetch card information: ${cardError.message}`);
    }

    return {
      id: data.id,
      deck_id: data.deck_id,
      card_id: data.card_id,
      quantity: data.quantity,
      is_sideboard: data.is_sideboard,
      notes: data.notes,
      added_at: data.added_at,
      card: {
        id: cardInfo.id,
        scryfall_id: cardInfo.scryfall_id,
        name: cardInfo.name,
        mana_cost: cardInfo.mana_cost,
        type: cardInfo.type,
        rarity: cardInfo.rarity,
        image_url: cardInfo.image_url,
      },
    };
  }

  /**
   * Usuwa kartę z decka
   */
  async removeCardFromDeck(deckId: string, cardId: string): Promise<void> {
    const { error } = await this.supabase.from("deck_cards").delete().eq("deck_id", deckId).eq("card_id", cardId);

    if (error) {
      throw new Error(`Failed to remove card from deck: ${error.message}`);
    }
  }

  /**
   * Sprawdza czy użytkownik jest właścicielem decka
   */
  async validateDeckOwnership(deckId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase.from("decks").select("user_id").eq("id", deckId).single();

    if (error || !data) {
      return false;
    }

    return data.user_id === userId;
  }
}
