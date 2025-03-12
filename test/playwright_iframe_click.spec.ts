import {
  mockPage,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and IframeClickTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { IframeClickTool } from "../src/tools/browser/interaction";

describe("playwright_iframe_click unit tests", () => {
  let iframeClickTool: IframeClickTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the IframeClickTool
    iframeClickTool = new IframeClickTool(mockServer);
  });

  it("should handle iframe click tool directly", async () => {
    // Set up the mock
    const mockFrameLocator = {
      locator: jest.fn().mockReturnValue({
        click: jest.fn().mockResolvedValue(undefined)
      })
    };
    mockPage.frameLocator.mockReturnValueOnce(mockFrameLocator);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await iframeClickTool.execute(
      { 
        iframeSelector: "#test-iframe",
        selector: "#test-button" 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Clicked element #test-button inside iframe #test-iframe");
    expect(mockPage.frameLocator).toHaveBeenCalledWith("#test-iframe");
    expect(mockFrameLocator.locator).toHaveBeenCalledWith("#test-button");
    expect(mockFrameLocator.locator().click).toHaveBeenCalled();
  });

  it("should handle playwright_iframe_click tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Set up the mock
    const mockFrameLocator = {
      locator: jest.fn().mockReturnValue({
        click: jest.fn().mockResolvedValue(undefined)
      })
    };
    mockPage.frameLocator.mockReturnValueOnce(mockFrameLocator);

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_iframe_click",
      { 
        iframeSelector: "#test-iframe",
        selector: "#test-button" 
      },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Clicked element #test-button inside iframe #test-iframe");
    expect(mockPage.frameLocator).toHaveBeenCalledWith("#test-iframe");
    expect(mockFrameLocator.locator).toHaveBeenCalledWith("#test-button");
    expect(mockFrameLocator.locator().click).toHaveBeenCalled();
  });

  it("should handle iframe click errors", async () => {
    // Set up the mock to throw an error
    const mockFrameLocator = {
      locator: jest.fn().mockReturnValue({
        click: jest.fn().mockRejectedValue(new Error("Element not found in iframe"))
      })
    };
    mockPage.frameLocator.mockReturnValueOnce(mockFrameLocator);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await iframeClickTool.execute(
      { 
        iframeSelector: "#test-iframe",
        selector: "#non-existent-button" 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Operation failed: Element not found in iframe");
  });

  it("should handle error when page is not available", async () => {
    // Create a context without a page
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await iframeClickTool.execute(
      { 
        iframeSelector: "#test-iframe",
        selector: "#test-button" 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Browser page not initialized");
    expect(mockPage.frameLocator).not.toHaveBeenCalled();
  });
});
