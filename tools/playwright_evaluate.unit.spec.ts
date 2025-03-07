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

describe("playwright_evaluate unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_evaluate tool", async () => {
    const name = "playwright_evaluate";
    const args = { script: "return document.title" };
    const server = {};

    // Mock the evaluate method to return a result
    mockPage.evaluate.mockResolvedValueOnce({
      result: "Example Domain",
      logs: ["[log] Document title: Example Domain"],
    });

    const result = await handleToolCall(name, args, server);

    // Verify the evaluate was called with the correct script
    expect(mockPage.evaluate).toHaveBeenCalledWith(
      expect.any(Function),
      "return document.title"
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Execution result");
    expect(result.content[0].text).toContain("Example Domain");
  });
});
