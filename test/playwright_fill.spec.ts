import {
  mockPage,
  mockChromium,
  mockRequest,
  mockFs,
  mockPath,
  resetAllMocks,
} from "./helpers";

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

describe("playwright_fill unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_fill tool", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      {}
    );

    const name = "playwright_fill";
    const args = { selector: "input", value: "test" };
    const server = {};

    const result = await handleToolCall(name, args, server);

    // Verify the waitForSelector and fill were called with the correct parameters
    expect(mockPage.waitForSelector).toHaveBeenCalledWith("input");
    expect(mockPage.fill).toHaveBeenCalledWith("input", "test");

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe(`Filled input with: test`);
  });
});
