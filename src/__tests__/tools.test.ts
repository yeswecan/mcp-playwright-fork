import { createToolDefinitions, BROWSER_TOOLS, API_TOOLS } from '../tools';

describe('Tool Definitions', () => {
  const toolDefinitions = createToolDefinitions();

  test('should return an array of tool definitions', () => {
    expect(Array.isArray(toolDefinitions)).toBe(true);
    expect(toolDefinitions.length).toBeGreaterThan(0);
  });

  test('each tool definition should have required properties', () => {
    toolDefinitions.forEach(tool => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      expect(tool.inputSchema).toHaveProperty('type');
      expect(tool.inputSchema).toHaveProperty('properties');
    });
  });

  test('BROWSER_TOOLS should contain browser-related tool names', () => {
    expect(Array.isArray(BROWSER_TOOLS)).toBe(true);
    expect(BROWSER_TOOLS.length).toBeGreaterThan(0);
    
    BROWSER_TOOLS.forEach(toolName => {
      expect(toolDefinitions.some(tool => tool.name === toolName)).toBe(true);
    });
  });

  test('API_TOOLS should contain API-related tool names', () => {
    expect(Array.isArray(API_TOOLS)).toBe(true);
    expect(API_TOOLS.length).toBeGreaterThan(0);
    
    API_TOOLS.forEach(toolName => {
      expect(toolDefinitions.some(tool => tool.name === toolName)).toBe(true);
    });
  });

  test('should validate navigate tool schema', () => {
    const navigateTool = toolDefinitions.find(tool => tool.name === 'playwright_navigate');
    expect(navigateTool).toBeDefined();
    expect(navigateTool!.inputSchema.properties).toHaveProperty('url');
    expect(navigateTool!.inputSchema.properties).toHaveProperty('waitUntil');
    expect(navigateTool!.inputSchema.properties).toHaveProperty('timeout');
    expect(navigateTool!.inputSchema.properties).toHaveProperty('width');
    expect(navigateTool!.inputSchema.properties).toHaveProperty('height');
    expect(navigateTool!.inputSchema.properties).toHaveProperty('headless');
    expect(navigateTool!.inputSchema.required).toEqual(['url']);
  });
}); 