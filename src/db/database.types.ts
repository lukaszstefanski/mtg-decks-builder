export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      card_images: {
        Row: {
          cached_at: string | null;
          card_id: string;
          id: string;
          image_data: string | null;
          image_url: string;
        };
        Insert: {
          cached_at?: string | null;
          card_id: string;
          id?: string;
          image_data?: string | null;
          image_url: string;
        };
        Update: {
          cached_at?: string | null;
          card_id?: string;
          id?: string;
          image_data?: string | null;
          image_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "card_images_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: true;
            referencedRelation: "cards";
            referencedColumns: ["id"];
          },
        ];
      };
      cards: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string | null;
          mana_cost: string | null;
          name: string;
          rarity: string;
          scryfall_id: string;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          mana_cost?: string | null;
          name: string;
          rarity: string;
          scryfall_id: string;
          type: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          mana_cost?: string | null;
          name?: string;
          rarity?: string;
          scryfall_id?: string;
          type?: string;
        };
        Relationships: [];
      };
      deck_cards: {
        Row: {
          added_at: string | null;
          card_id: string;
          deck_id: string;
          id: string;
          is_sideboard: boolean | null;
          notes: string | null;
          quantity: number;
        };
        Insert: {
          added_at?: string | null;
          card_id: string;
          deck_id: string;
          id?: string;
          is_sideboard?: boolean | null;
          notes?: string | null;
          quantity?: number;
        };
        Update: {
          added_at?: string | null;
          card_id?: string;
          deck_id?: string;
          id?: string;
          is_sideboard?: boolean | null;
          notes?: string | null;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "deck_cards_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deck_cards_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
      deck_statistics: {
        Row: {
          avg_mana_cost: number | null;
          calculated_at: string | null;
          color_distribution: Json | null;
          deck_id: string;
          id: string;
          mana_curve: Json | null;
          total_cards: number;
          type_distribution: Json | null;
        };
        Insert: {
          avg_mana_cost?: number | null;
          calculated_at?: string | null;
          color_distribution?: Json | null;
          deck_id: string;
          id?: string;
          mana_curve?: Json | null;
          total_cards?: number;
          type_distribution?: Json | null;
        };
        Update: {
          avg_mana_cost?: number | null;
          calculated_at?: string | null;
          color_distribution?: Json | null;
          deck_id?: string;
          id?: string;
          mana_curve?: Json | null;
          total_cards?: number;
          type_distribution?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "deck_statistics_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: true;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
      decks: {
        Row: {
          created_at: string | null;
          deck_size: number | null;
          description: string | null;
          format: string;
          id: string;
          last_modified: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deck_size?: number | null;
          description?: string | null;
          format: string;
          id?: string;
          last_modified?: string | null;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deck_size?: number | null;
          description?: string | null;
          format?: string;
          id?: string;
          last_modified?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "decks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          supabase_auth_id: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          supabase_auth_id: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          supabase_auth_id?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
