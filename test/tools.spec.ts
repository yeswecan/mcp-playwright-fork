import { createToolDefinitions } from "../src/tools";

describe("tools unit tests", () => {
  it("should create tool definitions", () => {
    const tools = createToolDefinitions();
    
    // Verify the tools array is not empty
    expect(tools.length).toBeGreaterThan(0);
    
    // Verify each tool has the required properties
    tools.forEach(tool => {
      expect(tool).toHaveProperty("name");
      expect(tool).toHaveProperty("description");
      expect(tool).toHaveProperty("inputSchema");
    });
    
    // Verify some specific tools exist
    const toolNames = tools.map(tool => tool.name);
    expect(toolNames).toContain("playwright_navigate");
    expect(toolNames).toContain("playwright_screenshot");
    expect(toolNames).toContain("playwright_click");
  });
});
