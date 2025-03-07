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

describe("playwright_click integration tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should click an element on a page", async () => {
    // Set up the test HTML content
    mockPage.setContent.mockResolvedValueOnce(undefined);

    // First navigate to a page
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    // Then click an element
    const selector = "#my-button";
    const result = await handleToolCall("playwright_click", { selector }, {});

    // Verify the click was called with the correct selector
    expect(mockPage.click).toHaveBeenCalledWith(selector);

    // Verify the result
    expect(result).toEqual({
      content: [{ type: "text", text: `Clicked: ${selector}` }],
      isError: false,
    });
  });

  it("should handle errors when element is not found", async () => {
    // Set up the test HTML content
    mockPage.setContent.mockResolvedValueOnce(undefined);

    // Set up the mock to throw an error when clicking
    mockPage.click.mockRejectedValueOnce(new Error("Element not found"));

    // First navigate to a page
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    // Then try to click a non-existent element
    const selector = "#non-existent";
    const result = await handleToolCall("playwright_click", { selector }, {});

    // Verify the click was called with the correct selector
    expect(mockPage.click).toHaveBeenCalledWith(selector);

    // Verify the error result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to click");
  });
});
