import type { Tables, TablesInsert } from "./db/database.types";

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============================================================================
// USER DTOs
// ============================================================================

/**
 * Response DTO for user data (GET /api/users/me)
 * Based on users table with selected fields
 */
export type UserResponse = Pick<Tables<"users">, "id" | "email" | "username" | "created_at" | "updated_at">;

/**
 * Request DTO for updating user data (PUT /api/users/me)
 * Based on users table with optional fields for update
 */
export type UpdateUserRequest = Partial<Pick<Tables<"users">, "username" | "email">>;

// ============================================================================
// DECK DTOs
// ============================================================================

/**
 * Basic deck response DTO
 * Based on decks table with selected fields
 */
export type DeckResponse = Pick<
  Tables<"decks">,
  "id" | "name" | "description" | "format" | "deck_size" | "created_at" | "last_modified"
>;

/**
 * Request DTO for creating a new deck (POST /api/decks)
 * Based on decks table with required fields for creation
 */
export type CreateDeckRequest = Pick<TablesInsert<"decks">, "name" | "description" | "format">;

/**
 * Request DTO for updating a deck (PUT /api/decks/{deckId})
 * Based on decks table with optional fields for update
 */
export type UpdateDeckRequest = Partial<Pick<Tables<"decks">, "name" | "description" | "format">>;

/**
 * Response DTO for deck list with pagination (GET /api/decks)
 */
export interface DeckListResponse {
  decks: DeckResponse[];
  pagination: PaginationInfo;
}

/**
 * Card data for deck card responses
 * Based on cards table with selected fields
 */
export type CardData = Pick<
  Tables<"cards">,
  "id" | "scryfall_id" | "name" | "mana_cost" | "type" | "rarity" | "image_url"
>;

/**
 * Deck card response with card data
 * Based on deck_cards table with embedded card information
 */
export interface DeckCardResponse
  extends Pick<
    Tables<"deck_cards">,
    "id" | "deck_id" | "card_id" | "quantity" | "is_sideboard" | "notes" | "added_at"
  > {
  card: CardData;
}

/**
 * Detailed deck response with cards (GET /api/decks/{deckId})
 * Extends basic deck response with cards array
 */
export interface DeckDetailResponse extends DeckResponse {
  cards: DeckCardResponse[];
}

// ============================================================================
// CARD DTOs
// ============================================================================

/**
 * Card response DTO (GET /api/cards/{cardId})
 * Based on cards table with selected fields
 */
export type CardResponse = Pick<
  Tables<"cards">,
  "id" | "scryfall_id" | "name" | "mana_cost" | "type" | "rarity" | "image_url" | "created_at"
>;

/**
 * Card search parameters (GET /api/cards/search)
 * Query parameters for card search with optional filters
 */
export interface CardSearchParams {
  q?: string;
  colors?: string[];
  mana_cost?: string;
  type?: string[];
  rarity?: string[];
  set?: string;
  page?: number;
  limit?: number;
  sort?: "name" | "mana_cost" | "created_at";
  order?: "asc" | "desc";
}

/**
 * Card search response with pagination (GET /api/cards/search)
 */
export interface CardSearchResponse {
  cards: CardResponse[];
  pagination: PaginationInfo;
}

// ============================================================================
// DECK CARD DTOs
// ============================================================================

/**
 * Request DTO for adding a card to deck (POST /api/decks/{deckId}/cards)
 * Based on deck_cards table with required fields for creation
 */
export type AddCardToDeckRequest = Pick<TablesInsert<"deck_cards">, "card_id" | "quantity" | "notes" | "is_sideboard">;

/**
 * Request DTO for updating a deck card (PUT /api/decks/{deckId}/cards/{cardId})
 * Based on deck_cards table with optional fields for update
 */
export type UpdateDeckCardRequest = Partial<Pick<Tables<"deck_cards">, "quantity" | "notes" | "is_sideboard">>;

/**
 * Deck cards response with pagination (GET /api/decks/{deckId}/cards)
 */
export interface DeckCardsResponse {
  cards: DeckCardResponse[];
  pagination: PaginationInfo;
}

// ============================================================================
// DECK STATISTICS DTOs
// ============================================================================

/**
 * Color distribution in deck statistics
 * JSON structure for color counts
 */
export interface ColorDistribution {
  W?: number;
  U?: number;
  B?: number;
  R?: number;
  G?: number;
  C?: number;
}

/**
 * Mana curve distribution in deck statistics
 * JSON structure for mana cost counts
 */
export type ManaCurve = Record<string, number>;

/**
 * Type distribution in deck statistics
 * JSON structure for card type counts
 */
export type TypeDistribution = Record<string, number>;

/**
 * Deck statistics response (GET /api/decks/{deckId}/statistics)
 * Based on deck_statistics table with typed JSON fields
 */
export interface DeckStatisticsResponse {
  deck_id: string;
  total_cards: number;
  avg_mana_cost: number | null;
  color_distribution: ColorDistribution | null;
  mana_curve: ManaCurve | null;
  type_distribution: TypeDistribution | null;
  calculated_at: string | null;
}

// ============================================================================
// COMMAND MODELS
// ============================================================================

/**
 * Command model for deck creation
 * Extends CreateDeckRequest with user context
 */
export interface CreateDeckCommand extends CreateDeckRequest {
  user_id: string;
}

/**
 * Command model for deck update
 * Extends UpdateDeckRequest with deck ownership validation
 */
export interface UpdateDeckCommand extends UpdateDeckRequest {
  deck_id: string;
  user_id: string;
}

/**
 * Command model for adding card to deck
 * Extends AddCardToDeckRequest with deck ownership validation
 */
export interface AddCardToDeckCommand extends AddCardToDeckRequest {
  deck_id: string;
  user_id: string;
}

/**
 * Command model for updating deck card
 * Extends UpdateDeckCardRequest with deck ownership validation
 */
export interface UpdateDeckCardCommand extends UpdateDeckCardRequest {
  deck_id: string;
  card_id: string;
  user_id: string;
}

/**
 * Command model for deck deletion
 * Includes deck ownership validation
 */
export interface DeleteDeckCommand {
  deck_id: string;
  user_id: string;
}

/**
 * Command model for removing card from deck
 * Includes deck ownership validation
 */
export interface RemoveCardFromDeckCommand {
  deck_id: string;
  card_id: string;
  user_id: string;
}

/**
 * Command model for recalculating deck statistics
 * Triggers statistics recalculation for a deck
 */
export interface RecalculateDeckStatisticsCommand {
  deck_id: string;
  user_id: string;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
  errors: Record<string, string[]>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Generic paginated API response
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  success: boolean;
  message?: string;
}

// ============================================================================
// DASHBOARD VIEW TYPES
// ============================================================================

/**
 * Deck view model with UI state
 */
export interface DeckViewModel extends DeckResponse {
  isEditing?: boolean;
  isDeleting?: boolean;
  lastAction?: "created" | "updated" | "deleted";
}

/**
 * Deck list state for dashboard
 */
export interface DeckListState {
  decks: DeckViewModel[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  searchQuery: string;
  filters: FilterOptions;
  sort: SortOptions;
}

/**
 * Deck search state
 */
export interface DeckSearchState {
  query: string;
  isSearching: boolean;
  suggestions: string[];
}

/**
 * Deck filters state
 */
export interface DeckFiltersState {
  format: string | null;
  sortBy: "created_at" | "last_modified" | "name";
  sortOrder: "asc" | "desc";
}

/**
 * Deck actions state
 */
export interface DeckActionsState {
  editingDeckId: string | null;
  deletingDeckId: string | null;
  actionLoading: boolean;
}

/**
 * Filter options for deck list
 */
export interface FilterOptions {
  format?: string;
  search?: string;
  sortBy?: "created_at" | "last_modified" | "name";
  sortOrder?: "asc" | "desc";
}

/**
 * Sort options for deck list
 */
export interface SortOptions {
  field: "created_at" | "last_modified" | "name";
  direction: "asc" | "desc";
}

/**
 * Search query parameters
 */
export interface SearchQuery {
  query: string;
  debounced: boolean;
}

/**
 * Empty state props
 */
export interface EmptyStateProps {
  onCreateDeck: () => void;
  message?: string;
}

// ============================================================================
// DECK EDITOR VIEW TYPES
// ============================================================================

/**
 * Stan wyszukiwania kart
 */
export interface CardSearchState {
  query: string;
  filters: FilterState;
  results: ScryfallCardResponse[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

/**
 * Stan filtrów
 */
export interface FilterState {
  colors: string[];
  manaCost: {
    exact?: number;
    min?: number;
    max?: number;
    isX?: boolean;
  };
  types: string[];
}

/**
 * Stan decka
 */
export interface DeckState {
  cards: DeckCardResponse[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

/**
 * Metadane decka
 */
export interface DeckMetadata {
  id: string;
  name: string;
  format: string;
  description?: string;
}

/**
 * Rozszerzenie CardSearchParams o dodatkowe filtry
 */
export interface ExtendedCardSearchParams extends CardSearchParams {
  colors?: string[];
  mana_cost?: string;
  type?: string[];
  rarity?: string[];
  set?: string;
}

// ============================================================================
// SCRYFALL INTEGRATION TYPES
// ============================================================================

/**
 * Karta z Scryfall przekształcona dla aplikacji
 */
export interface ScryfallCardResponse {
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
 * Parametry wyszukiwania Scryfall
 */
export interface ScryfallSearchParams {
  q?: string;
  format?: string;
  order?:
    | "name"
    | "set"
    | "released"
    | "rarity"
    | "color"
    | "usd"
    | "eur"
    | "tix"
    | "cmc"
    | "power"
    | "toughness"
    | "edhrec"
    | "penny";
  dir?: "asc" | "desc";
  page?: number;
}

/**
 * Odpowiedź wyszukiwania Scryfall
 */
export interface ScryfallSearchResponse {
  cards: ScryfallCardResponse[];
  total_cards: number;
  has_more: boolean;
  next_page?: string;
}

/**
 * Rozszerzenie DeckCardResponse o dodatkowe pola
 */
export interface ExtendedDeckCardResponse extends DeckCardResponse {
  isLand: boolean;
  canAddMore: boolean;
  currentCount: number;
}
