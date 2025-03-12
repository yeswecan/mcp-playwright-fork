import {
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and ConsoleLogsTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { ConsoleLogsTool } from "../src/tools/browser/console";

describe("playwright_console_logs unit tests", () => {
  let consoleLogsTool: ConsoleLogsTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the ConsoleLogsTool
    consoleLogsTool = new ConsoleLogsTool(mockServer);
  });

  it("should handle console logs tool directly", async () => {
    // Add some test logs
    consoleLogsTool.registerConsoleMessage("log", "Test log message");
    consoleLogsTool.registerConsoleMessage("error", "Test error message");
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await consoleLogsTool.execute({}, context);

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Retrieved 2 console log(s)");
    expect(result.content[1].text).toContain("Test log message");
    expect(result.content[2].text).toContain("Test error message");
  });

  it("should handle playwright_console_logs tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_console_logs",
      {},
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
  });

  it("should filter logs by type", async () => {
    // Add some test logs of different types
    consoleLogsTool.registerConsoleMessage("log", "Regular log message");
    consoleLogsTool.registerConsoleMessage("error", "Error message");
    consoleLogsTool.registerConsoleMessage("warning", "Warning message");
    consoleLogsTool.registerConsoleMessage("info", "Info message");
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly with type filter
    const result = await consoleLogsTool.execute(
      { type: "error" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Retrieved 1 console log(s)");
    expect(result.content[1].text).toContain("Error message");
    expect(result.content.length).toBe(2); // Header + 1 log
  });

  it("should filter logs by search text", async () => {
    // Add some test logs with different content
    consoleLogsTool.registerConsoleMessage("log", "First test message");
    consoleLogsTool.registerConsoleMessage("log", "Second test message");
    consoleLogsTool.registerConsoleMessage("log", "Another message");
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly with search filter
    const result = await consoleLogsTool.execute(
      { search: "test" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Retrieved 2 console log(s)");
    expect(result.content[1].text).toContain("First test message");
    expect(result.content[2].text).toContain("Second test message");
    expect(result.content.length).toBe(3); // Header + 2 logs
  });

  it("should limit the number of logs returned", async () => {
    // Add several test logs
    for (let i = 0; i < 10; i++) {
      consoleLogsTool.registerConsoleMessage("log", `Log message ${i}`);
    }
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly with limit
    const result = await consoleLogsTool.execute(
      { limit: 3 },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Retrieved 3 console log(s)");
    expect(result.content.length).toBe(4); // Header + 3 logs
  });

  it("should clear logs when requested", async () => {
    // Add some test logs
    consoleLogsTool.registerConsoleMessage("log", "Test log message");
    consoleLogsTool.registerConsoleMessage("error", "Test error message");
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly with clear flag
    const result = await consoleLogsTool.execute(
      { clear: true },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Retrieved 2 console log(s)");
    
    // Verify logs were cleared by calling again
    const secondResult = await consoleLogsTool.execute({}, context);
    expect(secondResult.isError).toBe(false);
    expect(secondResult.content[0].text).toContain("No console logs matching the criteria");
  });

  it("should handle no logs available", async () => {
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly without adding any logs
    const result = await consoleLogsTool.execute({}, context);

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("No console logs matching the criteria");
  });
}); 