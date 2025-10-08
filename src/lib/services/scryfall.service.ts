/**
 * ScryfallService - Serwis do integracji z API Scryfall
 * Obsługuje wyszukiwanie kart, pobieranie szczegółów i zarządzanie danymi z Scryfall
 */

import { logger } from "../utils/logger";

/**
 * Interfejs dla odpowiedzi z API Scryfall
 */
export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  rarity: string;
  set: string;
  set_name: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
      art_crop?: string;
      border_crop?: string;
    };
  }>;
  legalities: {
    standard: string;
    pioneer: string;
    modern: string;
    legacy: string;
    vintage: string;
    commander: string;
    pauper: string;
    historic: string;
    brawl: string;
    alchemy: string;
    paupercommander: string;
    duel: string;
    oldschool: string;
    premodern: string;
    predh: string;
  };
  prices: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
}

/**
 * Interfejs dla odpowiedzi wyszukiwania z Scryfall
 */
export interface ScryfallSearchResponse {
  object: "list";
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

/**
 * Parametry wyszukiwania Scryfall
 */
export interface ScryfallSearchParams {
  q?: string;
  format?: string;
  order?: "name" | "set" | "released" | "rarity" | "color" | "usd" | "eur" | "tix" | "cmc" | "power" | "toughness" | "edhrec" | "penny";
  dir?: "asc" | "desc";
  page?: number;
}

/**
 * Przekształcona karta dla aplikacji
 */
export interface TransformedCard {
  id: string;
  scryfall_id: string;
  name: string;
  mana_cost?: string;
  type: string;
  rarity: string;
  image_url?: string;
  colors: string[];
  set: string;
  set_name: string;
  cmc: number;
  power?: string;
  toughness?: string;
  oracle_text?: string;
  legalities: ScryfallCard["legalities"];
  prices: ScryfallCard["prices"];
}

/**
 * Odpowiedź wyszukiwania dla aplikacji
 */
export interface ScryfallSearchResult {
  cards: TransformedCard[];
  total_cards: number;
  has_more: boolean;
  next_page?: string;
}

/**
 * Serwis do komunikacji z API Scryfall
 */
export class ScryfallService {
  private readonly baseUrl = "https://api.scryfall.com";
  private readonly rateLimitDelay = 100; // 100ms delay between requests

  /**
   * Wyszukiwanie kart w Scryfall
   */
  async searchCards(params: ScryfallSearchParams): Promise<ScryfallSearchResult> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.q) {
        searchParams.append("q", params.q);
      }
      if (params.format) {
        searchParams.append("format", params.format);
      }
      if (params.order) {
        searchParams.append("order", params.order);
      }
      if (params.dir) {
        searchParams.append("dir", params.dir);
      }
      if (params.page) {
        searchParams.append("page", params.page.toString());
      }

      const url = `${this.baseUrl}/cards/search?${searchParams.toString()}`;
      
      logger.logBusiness("Scryfall search request", "Service", { url, params });
      
      // Rate limiting
      await this.delay(this.rateLimitDelay);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Brak wyników - to nie jest błąd
          return {
            cards: [],
            total_cards: 0,
            has_more: false,
          };
        }
        
        throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
      }
      
      const data: ScryfallSearchResponse = await response.json();
      
      const transformedCards = data.data.map(card => this.transformCard(card));
      
      logger.logBusiness("Scryfall search completed", "Service", {
        totalCards: data.total_cards,
        returnedCards: data.data.length,
        hasMore: data.has_more,
      });
      
      return {
        cards: transformedCards,
        total_cards: data.total_cards,
        has_more: data.has_more,
        next_page: data.next_page,
      };
    } catch (error) {
      logger.error("Scryfall search failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        params,
      });
      throw error;
    }
  }

  /**
   * Pobieranie pojedynczej karty po ID Scryfall
   */
  async getCardById(scryfallId: string): Promise<TransformedCard> {
    try {
      const url = `${this.baseUrl}/cards/${scryfallId}`;
      
      logger.logBusiness("Scryfall card request", "Service", { scryfallId });
      
      // Rate limiting
      await this.delay(this.rateLimitDelay);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
      }
      
      const card: ScryfallCard = await response.json();
      
      logger.logBusiness("Scryfall card retrieved", "Service", {
        cardName: card.name,
        setId: card.set,
      });
      
      return this.transformCard(card);
    } catch (error) {
      logger.error("Scryfall card retrieval failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
        scryfallId,
      });
      throw error;
    }
  }

  /**
   * Pobieranie losowej karty
   */
  async getRandomCard(): Promise<TransformedCard> {
    try {
      const url = `${this.baseUrl}/cards/random`;
      
      logger.logBusiness("Scryfall random card request", "Service");
      
      // Rate limiting
      await this.delay(this.rateLimitDelay);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
      }
      
      const card: ScryfallCard = await response.json();
      
      logger.logBusiness("Scryfall random card retrieved", "Service", {
        cardName: card.name,
      });
      
      return this.transformCard(card);
    } catch (error) {
      logger.error("Scryfall random card failed", "Service", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Przekształcanie karty z Scryfall do formatu aplikacji
   */
  private transformCard(card: ScryfallCard): TransformedCard {
    // Wybieranie obrazu - preferujemy normal, potem large, potem small
    const imageUrl = card.image_uris?.normal || 
                    card.image_uris?.large || 
                    card.image_uris?.small ||
                    card.card_faces?.[0]?.image_uris?.normal ||
                    card.card_faces?.[0]?.image_uris?.large ||
                    card.card_faces?.[0]?.image_uris?.small;

    return {
      id: card.id,
      scryfall_id: card.id,
      name: card.name,
      mana_cost: card.mana_cost,
      type: card.type_line,
      rarity: card.rarity,
      image_url: imageUrl,
      colors: card.colors,
      set: card.set,
      set_name: card.set_name,
      cmc: card.cmc,
      power: card.power,
      toughness: card.toughness,
      oracle_text: card.oracle_text,
      legalities: card.legalities,
      prices: card.prices,
    };
  }

  /**
   * Opóźnienie dla rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Budowanie zapytania wyszukiwania Scryfall
   */
  buildSearchQuery(params: {
    query?: string;
    colors?: string[];
    manaCost?: string;
    types?: string[];
    rarity?: string[];
    set?: string;
  }): string {
    const queryParts: string[] = [];

    // Tekst wyszukiwania
    if (params.query) {
      queryParts.push(params.query);
    }

    // Kolory
    if (params.colors && params.colors.length > 0) {
      const colorQuery = params.colors.map(color => `color=${color}`).join(" OR ");
      queryParts.push(`(${colorQuery})`);
    }

    // Koszt many
    if (params.manaCost) {
      if (params.manaCost.includes("-")) {
        const [min, max] = params.manaCost.split("-");
        queryParts.push(`cmc>=${min} cmc<=${max}`);
      } else {
        queryParts.push(`cmc=${params.manaCost}`);
      }
    }

    // Typy kart
    if (params.types && params.types.length > 0) {
      const typeQuery = params.types.map(type => `type:${type}`).join(" OR ");
      queryParts.push(`(${typeQuery})`);
    }

    // Rzadkość
    if (params.rarity && params.rarity.length > 0) {
      const rarityQuery = params.rarity.map(rarity => `rarity:${rarity}`).join(" OR ");
      queryParts.push(`(${rarityQuery})`);
    }

    // Set
    if (params.set) {
      queryParts.push(`set:${params.set}`);
    }

    return queryParts.join(" ");
  }
}

// Eksport instancji serwisu
export const scryfallService = new ScryfallService();