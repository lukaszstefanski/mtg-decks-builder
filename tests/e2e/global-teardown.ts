import { safeCleanupDatabase } from "./teardown";

/**
 * Globalny teardown dla testów e2e Playwright
 * Uruchamiany po zakończeniu wszystkich testów
 */
async function globalTeardown() {
  console.log("🔄 Uruchamianie globalnego teardown...");
  
  try {
    await safeCleanupDatabase();
    console.log("✅ Globalny teardown zakończony pomyślnie");
  } catch (error) {
    console.error("❌ Błąd podczas globalnego teardown:", error);
    process.exit(1);
  }
}

export default globalTeardown;
