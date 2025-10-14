import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardService } from "../card.service";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../db/database.types";
import { NotFoundError } from "../../utils/error-handler";

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
} as unknown as SupabaseClient<Database>;

// Mock query builder
const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

describe("CardService", () => {
  let cardService: CardService;

  beforeEach(() => {
    vi.clearAllMocks();
    cardService = new CardService(mockSupabase);
    mockSupabase.from = vi.fn().mockReturnValue(mockQueryBuilder);
  });

  describe("getCardById", () => {
    it("should return card when found", async () => {
      const mockCard = {
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      };

      mockQueryBuilder.single.mockResolvedValue({
        data: mockCard,
        error: null,
      });

      const result = await cardService.getCardById("card-1");

      expect(mockSupabase.from).toHaveBeenCalledWith("cards");
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("*");
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", "card-1");
      expect(mockQueryBuilder.single).toHaveBeenCalled();
      expect(result).toEqual({
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      });
    });

    it("should throw NotFoundError when card not found", async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: "PGRST116", message: "No rows returned" },
      });

      await expect(cardService.getCardById("nonexistent")).rejects.toThrow(NotFoundError);
    });

    it("should throw error for other database errors", async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: "PGRST001", message: "Database error" },
      });

      await expect(cardService.getCardById("card-1")).rejects.toThrow();
    });
  });

  describe("createCard", () => {
    it("should create new card when it does not exist", async () => {
      const cardData = {
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
      };

      const mockCard = {
        id: "card-1",
        ...cardData,
        created_at: "2024-01-01T00:00:00Z",
      };

      // Mock the find existing card query (returns no results)
      mockQueryBuilder.single
        .mockResolvedValueOnce({
          data: null,
          error: { code: "PGRST116", message: "No rows returned" },
        })
        // Mock the insert query
        .mockResolvedValueOnce({
          data: mockCard,
          error: null,
        });

      const result = await cardService.createCard(cardData);

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("scryfall_id", "scryfall-1");
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith([cardData]);
      expect(result).toEqual({
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      });
    });

    it("should return existing card when it already exists", async () => {
      const cardData = {
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
      };

      const existingCard = {
        id: "card-1",
        ...cardData,
        created_at: "2024-01-01T00:00:00Z",
      };

      mockQueryBuilder.single.mockResolvedValue({
        data: existingCard,
        error: null,
      });

      const result = await cardService.createCard(cardData);

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("scryfall_id", "scryfall-1");
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      });
    });
  });

  describe("updateCard", () => {
    it("should update card successfully", async () => {
      const updateData = {
        name: "Updated Lightning Bolt",
        mana_cost: "{R}{R}",
      };

      const updatedCard = {
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Updated Lightning Bolt",
        mana_cost: "{R}{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      };

      mockQueryBuilder.single.mockResolvedValue({
        data: updatedCard,
        error: null,
      });

      const result = await cardService.updateCard("card-1", updateData);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(updateData);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", "card-1");
      expect(result).toEqual({
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Updated Lightning Bolt",
        mana_cost: "{R}{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      });
    });

    it("should throw NotFoundError when card not found", async () => {
      const updateData = { name: "Updated Name" };

      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: "PGRST116", message: "No rows returned" },
      });

      await expect(cardService.updateCard("nonexistent", updateData)).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteCard", () => {
    it("should delete card successfully", async () => {
      // Mock the delete method to return the query builder
      const deleteMock = vi.fn().mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.delete = deleteMock;

      mockQueryBuilder.eq.mockResolvedValue({
        error: null,
      });

      await cardService.deleteCard("card-1");

      expect(deleteMock).toHaveBeenCalled();
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", "card-1");
    });

    it("should throw error when deletion fails", async () => {
      // Mock the delete method to return the query builder
      const deleteMock = vi.fn().mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.delete = deleteMock;

      mockQueryBuilder.eq.mockResolvedValue({
        error: { code: "PGRST001", message: "Database error" },
      });

      await expect(cardService.deleteCard("card-1")).rejects.toThrow();
    });
  });

  describe("transformCard", () => {
    it("should transform card data correctly", () => {
      const cardData = {
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      };

      const result = cardService.transformCard(cardData);

      expect(result).toEqual({
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
        created_at: "2024-01-01T00:00:00Z",
      });
    });

    it("should add default created_at when missing", () => {
      const cardData = {
        id: "card-1",
        scryfall_id: "scryfall-1",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "common",
        image_url: "https://example.com/bolt.jpg",
      };

      const result = cardService.transformCard(cardData);

      expect(result.created_at).toBeDefined();
      expect(new Date(result.created_at)).toBeInstanceOf(Date);
    });
  });
});
