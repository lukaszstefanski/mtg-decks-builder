import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/db/database.types";

/**
 * Funkcja do czyszczenia bazy danych po zakończonych testach e2e
 * Usuwa wszystkie rekordy z tabeli decks (i powiązanych tabel przez CASCADE)
 */
export async function cleanupDatabase(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_KEY");
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    console.log("🧹 Rozpoczynam czyszczenie bazy danych...");

    // Spróbuj usunąć wszystkie rekordy z tabeli decks
    // RLS może blokować tę operację, ale spróbujemy
    const { error } = await supabase.from("decks").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.error("❌ Błąd podczas czyszczenia tabeli decks:", error);
      console.log("⚠️ Prawdopodobnie RLS blokuje operację DELETE");
      console.log("ℹ️ Tabela może nie być pusta, ale testy powinny działać z izolacją");
      // Nie rzucamy błędu, żeby nie przerwać procesu teardown
      return;
    }

    console.log("✅ Baza danych została wyczyszczona pomyślnie");
  } catch (error) {
    console.error("❌ Błąd podczas czyszczenia bazy danych:", error);
    console.log("⚠️ Czyszczenie nie powiodło się, ale testy mogą nadal działać");
    // Nie rzucamy błędu, żeby nie przerwać procesu teardown
  }
}

/**
 * Funkcja do czyszczenia bazy danych z obsługą błędów
 * Używana w teardown Playwright
 */
export async function safeCleanupDatabase(): Promise<void> {
  try {
    await cleanupDatabase();
  } catch (error) {
    console.error("⚠️ Nie udało się wyczyścić bazy danych:", error);
    // Nie rzucamy błędu dalej, żeby nie przerwać procesu teardown
  }
}
