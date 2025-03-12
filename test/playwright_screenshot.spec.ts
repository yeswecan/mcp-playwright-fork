import {
  mockPage,
  mockFs,
  mockPath,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and ScreenshotTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { ScreenshotTool } from "../src/tools/browser/screenshot";

describe("playwright_screenshot unit tests", () => {
  let screenshotTool: ScreenshotTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the ScreenshotTool
    screenshotTool = new ScreenshotTool(mockServer);
  });

  it("should handle screenshot tool directly", async () => {
    // Set up the mock
    mockPage.screenshot.mockResolvedValueOnce(Buffer.from("mock-screenshot"));
    mockFs.existsSync.mockReturnValueOnce(true);
    mockPath.join.mockReturnValueOnce("/mock/path/screenshot.png");
    mockPath.relative.mockReturnValueOnce("mock/path/screenshot.png");

    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await screenshotTool.execute(
      { name: "test-screenshot" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Screenshot saved to");
    expect(mockPage.screenshot).toHaveBeenCalled();
    expect(mockServer.notification).toHaveBeenCalled();
  });

  it("should handle playwright_screenshot tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Set up the mock
    mockPage.screenshot.mockResolvedValueOnce(Buffer.from("mock-screenshot"));
    mockFs.existsSync.mockReturnValueOnce(true);
    mockPath.join.mockReturnValueOnce("/mock/path/screenshot.png");
    mockPath.relative.mockReturnValueOnce("mock/path/screenshot.png");

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_screenshot",
      { name: "test-screenshot" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Screenshot saved to");
    expect(mockPage.screenshot).toHaveBeenCalled();
    expect(mockServer.notification).toHaveBeenCalled();
  });

  it("should handle screenshot with selector", async () => {
    // Set up the mock
    const mockElement = { id: "mock-element" };
    mockPage.$.mockResolvedValueOnce(mockElement);
    mockPage.screenshot.mockResolvedValueOnce(Buffer.from("mock-screenshot"));
    mockFs.existsSync.mockReturnValueOnce(true);
    mockPath.join.mockReturnValueOnce("/mock/path/screenshot.png");
    mockPath.relative.mockReturnValueOnce("mock/path/screenshot.png");

    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await screenshotTool.execute(
      { 
        name: "test-screenshot",
        selector: "#test-element"
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Screenshot saved to");
    expect(mockPage.$).toHaveBeenCalledWith("#test-element");
    expect(mockPage.screenshot).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement
      })
    );
  });

  it("should handle error when selector not found", async () => {
    // Set up the mock to return null for the selector
    mockPage.$.mockResolvedValueOnce(null);

    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await screenshotTool.execute(
      { 
        name: "test-screenshot",
        selector: "#non-existent-element"
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Element not found");
    expect(mockPage.$).toHaveBeenCalledWith("#non-existent-element");
    expect(mockPage.screenshot).not.toHaveBeenCalled();
  });

  it("should handle fullPage screenshot", async () => {
    // Set up the mock
    mockPage.screenshot.mockResolvedValueOnce(Buffer.from("mock-screenshot"));
    mockFs.existsSync.mockReturnValueOnce(true);
    mockPath.join.mockReturnValueOnce("/mock/path/screenshot.png");
    mockPath.relative.mockReturnValueOnce("mock/path/screenshot.png");

    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await screenshotTool.execute(
      { 
        name: "test-screenshot",
        fullPage: true
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Screenshot saved to");
    expect(mockPage.screenshot).toHaveBeenCalledWith(
      expect.objectContaining({
        fullPage: true
      })
    );
  });

  it("should handle error when page is not available", async () => {
    // Create a context without a page
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await screenshotTool.execute(
      { name: "test-screenshot" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Browser page not initialized");
    expect(mockPage.screenshot).not.toHaveBeenCalled();
  });
});
