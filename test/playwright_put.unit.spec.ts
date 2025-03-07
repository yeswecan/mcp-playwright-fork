import {
  mockPage,
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

describe("playwright_put unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should handle playwright_put tool", async () => {
    const name = "playwright_put";
    const args = { url: "https://example.com/api", value: { test: "data" } };
    const server = {};

    // Mock the API response
    mockApiContext.put.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true }),
      status: jest.fn().mockReturnValueOnce(200),
    });

    const result = await handleToolCall(name, args, server);

    // Verify the put was called with the correct URL and data
    expect(mockApiContext.put).toHaveBeenCalledWith(
      "https://example.com/api",
      expect.objectContaining({
        data: { test: "data" },
        headers: expect.any(Object),
      })
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain(
      `Performed PUT Operation https://example.com/api`
    );
    expect(result.content[2].text).toBe("Response code 200");
  });
});
