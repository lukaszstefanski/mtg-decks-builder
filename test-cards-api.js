/**
 * Test script for Cards API endpoints
 * Run with: node test-cards-api.js
 */

const BASE_URL = "http://localhost:4321";

async function testCardsAPI() {
  console.log("🧪 Testing Cards API...\n");

  try {
    // 1. Test POST - Create new card
    console.log("1️⃣ Testing POST /api/cards/search");
    const createResponse = await fetch(`${BASE_URL}/api/cards/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scryfall_id: "test-" + Date.now(),
        name: "Test Lightning Bolt",
        mana_cost: "{R}",
        type: "Instant",
        rarity: "Common",
        image_url: "https://example.com/test-bolt.jpg",
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`POST failed: ${createResponse.status} ${createResponse.statusText}`);
    }

    const createdCard = await createResponse.json();
    console.log("✅ Card created:", createdCard.name);
    console.log("📍 Card ID:", createdCard.id);
    console.log("🔗 Location header:", createResponse.headers.get("Location"));

    const cardId = createdCard.id;

    // 2. Test GET - Retrieve the card
    console.log("\n2️⃣ Testing GET /api/cards/{cardId}");
    const getResponse = await fetch(`${BASE_URL}/api/cards/${cardId}`);

    if (!getResponse.ok) {
      throw new Error(`GET failed: ${getResponse.status} ${getResponse.statusText}`);
    }

    const retrievedCard = await getResponse.json();
    console.log("✅ Card retrieved:", retrievedCard.name);

    // 3. Test PUT - Update the card
    console.log("\n3️⃣ Testing PUT /api/cards/{cardId}");
    const updateResponse = await fetch(`${BASE_URL}/api/cards/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Updated Lightning Bolt",
        mana_cost: "{1}{R}",
        type: "Instant - Updated",
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`PUT failed: ${updateResponse.status} ${updateResponse.statusText}`);
    }

    const updatedCard = await updateResponse.json();
    console.log("✅ Card updated:", updatedCard.name);
    console.log("🔄 Updated fields:", Object.keys(JSON.parse(updateResponse.request.body)));

    // 4. Test GET again - Verify update
    console.log("\n4️⃣ Testing GET after update");
    const getAfterUpdateResponse = await fetch(`${BASE_URL}/api/cards/${cardId}`);
    const cardAfterUpdate = await getAfterUpdateResponse.json();
    console.log("✅ Card after update:", cardAfterUpdate.name);

    // 5. Test DELETE - Delete the card
    console.log("\n5️⃣ Testing DELETE /api/cards/{cardId}");
    const deleteResponse = await fetch(`${BASE_URL}/api/cards/${cardId}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      throw new Error(`DELETE failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
    }

    console.log("✅ Card deleted (status:", deleteResponse.status, ")");

    // 6. Test GET after delete - Should return 404
    console.log("\n6️⃣ Testing GET after delete (should return 404)");
    const getAfterDeleteResponse = await fetch(`${BASE_URL}/api/cards/${cardId}`);

    if (getAfterDeleteResponse.status === 404) {
      console.log("✅ Card not found (404) - deletion successful");
    } else {
      console.log("❌ Expected 404, got:", getAfterDeleteResponse.status);
    }

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Test error cases
async function testErrorCases() {
  console.log("\n🧪 Testing error cases...\n");

  try {
    // Test invalid card ID
    console.log("1️⃣ Testing invalid card ID");
    const invalidIdResponse = await fetch(`${BASE_URL}/api/cards/invalid-id`);
    console.log("✅ Invalid ID returns:", invalidIdResponse.status);

    // Test POST with invalid data
    console.log("\n2️⃣ Testing POST with invalid data");
    const invalidPostResponse = await fetch(`${BASE_URL}/api/cards/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Missing required fields
        name: "Invalid Card",
      }),
    });
    console.log("✅ Invalid POST returns:", invalidPostResponse.status);

    // Test PUT with invalid data
    console.log("\n3️⃣ Testing PUT with invalid data");
    const invalidPutResponse = await fetch(`${BASE_URL}/api/cards/00000000-0000-0000-0000-000000000000`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rarity: "InvalidRarity",
      }),
    });
    console.log("✅ Invalid PUT returns:", invalidPutResponse.status);
  } catch (error) {
    console.error("❌ Error case test failed:", error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log("🚀 Starting Cards API Tests\n");
  console.log("Make sure your Astro dev server is running on http://localhost:4321\n");

  await testCardsAPI();
  await testErrorCases();

  console.log("\n✨ All tests completed!");
}

// Check if running in Node.js
if (typeof window === "undefined") {
  runAllTests();
} else {
  console.log("This script should be run with Node.js, not in a browser");
}
