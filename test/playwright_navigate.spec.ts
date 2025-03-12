import {
  mockPage,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and NavigationTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { NavigationTool } from "../src/tools/browser/navigation";

describe("playwright_navigate unit tests", () => {
  let navigationTool: NavigationTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the NavigationTool
    navigationTool = new NavigationTool(mockServer);
  });

  it("should handle navigation tool directly", async () => {
    // Set up the mock
    mockPage.goto.mockResolvedValueOnce(undefined);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await navigationTool.execute(
      { url: "https://example.com" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Navigated to https://example.com");
    expect(mockPage.goto).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        timeout: 30000,
        waitUntil: "load"
      })
    );
  });

  it("should handle playwright_navigate tool through handler", async () => {
    // Set up the mock
    mockPage.goto.mockResolvedValueOnce(undefined);

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Navigated to https://example.com");
    expect(mockPage.goto).toHaveBeenCalled();
  });

  it("should handle custom timeout and waitUntil options", async () => {
    // Set up the mock
    mockPage.goto.mockResolvedValueOnce(undefined);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly with custom options
    const result = await navigationTool.execute(
      { 
        url: "https://example.com",
        timeout: 5000,
        waitUntil: "networkidle"
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Navigated to https://example.com");
    expect(mockPage.goto).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        timeout: 5000,
        waitUntil: "networkidle"
      })
    );
  });

  it("should handle navigation errors", async () => {
    // Set up the mock to throw an error
    mockPage.goto.mockRejectedValueOnce(new Error("Navigation failed"));
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await navigationTool.execute(
      { url: "https://example.com" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Operation failed: Navigation failed");
  });

  it("should handle error when page is not available", async () => {
    // Create a context without a page
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await navigationTool.execute(
      { url: "https://example.com" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Browser page not initialized");
    expect(mockPage.goto).not.toHaveBeenCalled();
  });
});
