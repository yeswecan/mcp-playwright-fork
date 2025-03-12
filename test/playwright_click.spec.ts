import {
  mockPage,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and ClickTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { ClickTool } from "../src/tools/browser/interaction";

describe("playwright_click unit tests", () => {
  let clickTool: ClickTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the ClickTool
    clickTool = new ClickTool(mockServer);
  });

  it("should handle click tool directly", async () => {
    // Set up the mock
    mockPage.click.mockResolvedValueOnce(undefined);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await clickTool.execute(
      { selector: "#test-button" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Clicked element: #test-button");
    expect(mockPage.click).toHaveBeenCalledWith("#test-button");
  });

  it("should handle playwright_click tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Set up the mock
    mockPage.click.mockResolvedValueOnce(undefined);

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_click",
      { selector: "#test-button" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Clicked element: #test-button");
    expect(mockPage.click).toHaveBeenCalledWith("#test-button");
  });

  it("should handle click errors", async () => {
    // Set up the mock to throw an error
    mockPage.click.mockRejectedValueOnce(new Error("Element not found"));
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await clickTool.execute(
      { selector: "#non-existent-button" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Operation failed: Element not found");
  });

  it("should handle error when page is not available", async () => {
    // Create a context without a page
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await clickTool.execute(
      { selector: "#test-button" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Browser page not initialized");
    expect(mockPage.click).not.toHaveBeenCalled();
  });
});
