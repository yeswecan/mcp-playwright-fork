import {
  mockChromium,
  mockApiContext,
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

describe("playwright_delete unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_delete tool", async () => {
    const name = "playwright_delete";
    const args = { url: "https://example.com/api" };
    const server = {};

    // Mock the API response
    mockApiContext.delete.mockResolvedValueOnce({
      status: jest.fn().mockReturnValueOnce(204),
    });

    const result = await handleToolCall(name, args, server);

    // Verify the delete was called with the correct URL
    expect(mockApiContext.delete).toHaveBeenCalledWith(
      "https://example.com/api"
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe(
      `Performed delete Operation https://example.com/api`
    );
    expect(result.content[1].text).toBe("Response code 204");
  });
});
