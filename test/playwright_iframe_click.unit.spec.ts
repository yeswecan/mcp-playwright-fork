import {
  mockPage,
  mockChromium,
  mockRequest,
  mockFs,
  mockPath,
} from "../helpers/mocks";
import { resetAllMocks } from "../helpers/mockSetup";

// Mock the playwright module
jest.mock("playwright", () => {
  return {
    chromium: mockChromium,
    request: mockRequest,
  };
});

// Mock the fs module
jest.mock("node:fs", () => mockFs);

// Mock the path module
jest.mock("node:path", () => mockPath);

// Import the toolsHandler after mocking dependencies
import { handleToolCall } from "../src/toolsHandler";

describe("playwright_iframe_click unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_iframe_click tool", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    // Mock the iframe locator
    const mockIframeLocator = {
      locator: jest.fn().mockReturnValue({
        click: jest.fn().mockResolvedValue(undefined),
      }),
    };
    mockPage.frameLocator = jest.fn().mockReturnValue(mockIframeLocator);

    const name = "playwright_iframe_click";
    const args = { iframeSelector: "#my-iframe", selector: "#my-button" };
    const server = {};

    const result = await handleToolCall(name, args, server);

    // Verify the frameLocator was called with the correct selector
    expect(mockPage.frameLocator).toHaveBeenCalledWith("#my-iframe");
    expect(mockIframeLocator.locator).toHaveBeenCalledWith("#my-button");
    expect(mockIframeLocator.locator().click).toHaveBeenCalled();

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe(
      `Clicked: #my-button (iframe: #my-iframe)`
    );
  });
});
