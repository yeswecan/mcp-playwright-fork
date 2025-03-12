import {
  mockPage,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and EvaluateTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { EvaluateTool } from "../src/tools/browser/interaction";

describe("playwright_evaluate unit tests", () => {
  let evaluateTool: EvaluateTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the EvaluateTool
    evaluateTool = new EvaluateTool(mockServer);
  });

  it("should handle evaluate tool directly", async () => {
    // Set up the mock
    mockPage.evaluate.mockResolvedValueOnce({ result: "test result" });
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await evaluateTool.execute(
      { script: "return { result: 'test result' };" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Executed JavaScript:");
    expect(result.content[1].text).toBe("return { result: 'test result' };");
    expect(result.content[2].text).toBe("Result:");
    expect(result.content[3].text).toContain("test result");
    expect(mockPage.evaluate).toHaveBeenCalledWith("return { result: 'test result' };");
  });

  it("should handle playwright_evaluate tool through handler", async () => {
    // First navigate to a page to ensure browser is initialized
    await handleToolCall(
      "playwright_navigate",
      { url: "https://example.com" },
      mockServer
    );

    // Set up the mock
    mockPage.evaluate.mockResolvedValueOnce({ result: "test result" });

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_evaluate",
      { script: "return { result: 'test result' };" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Executed JavaScript:");
    expect(result.content[1].text).toBe("return { result: 'test result' };");
    expect(result.content[2].text).toBe("Result:");
    expect(result.content[3].text).toContain("test result");
    expect(mockPage.evaluate).toHaveBeenCalledWith("return { result: 'test result' };");
  });

  it("should handle evaluate errors", async () => {
    // Set up the mock to throw an error
    mockPage.evaluate.mockRejectedValueOnce(new Error("Script error"));
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await evaluateTool.execute(
      { script: "throw new Error('Script error');" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Operation failed: Script error");
  });

  it("should handle non-JSON-stringifiable results", async () => {
    // Create a circular reference object that can't be stringified
    const circularObj: any = { name: "circular" };
    circularObj.self = circularObj;
    
    // Set up the mock
    mockPage.evaluate.mockResolvedValueOnce(circularObj);
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await evaluateTool.execute(
      { script: "const obj = {}; obj.self = obj; return obj;" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe("Executed JavaScript:");
    expect(result.content[1].text).toBe("const obj = {}; obj.self = obj; return obj;");
    expect(result.content[2].text).toBe("Result:");
    expect(result.content[3].text).toContain("[object Object]");
  });

  it("should handle error when page is not available", async () => {
    // Create a context without a page
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await evaluateTool.execute(
      { script: "return document.title;" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Browser page not initialized");
    expect(mockPage.evaluate).not.toHaveBeenCalled();
  });
});
