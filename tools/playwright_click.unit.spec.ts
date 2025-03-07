import { mockPage } from "../helpers/mocks";
import {
  setupPlaywrightMocks,
  setupToolsHandlerIntegrationMocks,
  resetAllMocks,
} from "../helpers/mockSetup";

// Set up all mocks
setupPlaywrightMocks();
setupToolsHandlerIntegrationMocks();

// IMPORTANT: Import the actual handleToolCall function AFTER mocking
import { handleToolCall } from "../src/toolsHandler";

describe("playwright_click unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_click tool", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    const name = "playwright_click";
    const args = { selector: "#test-button" };
    const server = {};

    const result = await handleToolCall(name, args, server);

    // Verify the click was called with the correct selector
    expect(mockPage.click).toHaveBeenCalledWith("#test-button");

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe(`Clicked: #test-button`);
  });

  it("should handle errors in tools", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    // Mock the click method to throw an error
    mockPage.click.mockRejectedValueOnce(new Error("Element not found"));

    const name = "playwright_click";
    const args = { selector: "#non-existent" };
    const server = {};

    const result = await handleToolCall(name, args, server);

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to click");
  });

  it("should handle playwright_click after playwright_screenshot with selector", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    // Take a screenshot with a selector
    await handleToolCall(
      "playwright_screenshot",
      { selector: "#screenshot-element", name: "test-screenshot" },
      {}
    );

    const name = "playwright_click";
    const args = { selector: "#test-button" };
    const server = {};

    const result = await handleToolCall(name, args, server);

    // Verify the click was called with the correct selector
    expect(mockPage.click).toHaveBeenCalledWith("#test-button");

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe(`Clicked: #test-button`);
  });
});
