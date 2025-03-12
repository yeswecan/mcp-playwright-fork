import {
  mockBrowser,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and CloseBrowserTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { CloseBrowserTool } from "../src/tools/browser/navigation";

describe("playwright_close unit tests", () => {
  let closeBrowserTool: CloseBrowserTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the CloseBrowserTool
    closeBrowserTool = new CloseBrowserTool(mockServer);
  });

  it("should handle close browser tool directly", async () => {
    // Set up the mock
    mockBrowser.close.mockResolvedValueOnce(undefined);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await closeBrowserTool.execute({}, context);

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Browser closed successfully");
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it("should handle playwright_close tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Set up the mock
    mockBrowser.close.mockResolvedValueOnce(undefined);

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_close",
      {},
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Browser closed successfully");
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it("should handle case when browser is not available", async () => {
    // Create a context without a browser
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await closeBrowserTool.execute({}, context);

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("No browser instance to close");
    expect(mockBrowser.close).not.toHaveBeenCalled();
  });
}); 