# Playwright MCP Server 🎭

[![smithery badge](https://smithery.ai/badge/@executeautomation/playwright-mcp-server)](https://smithery.ai/server/@executeautomation/playwright-mcp-server)

A Model Context Protocol server that provides browser automation capabilities using Playwright. This server enables LLMs to interact with web pages, take screenshots, and execute JavaScript in a real browser environment.

<a href="https://glama.ai/mcp/servers/yh4lgtwgbe"><img width="380" height="200" src="https://glama.ai/mcp/servers/yh4lgtwgbe/badge" alt="mcp-playwright MCP server" /></a>

## Screenshot
![Playwright + Claude](image/playwright_claude.png)

## [Documentation](https://executeautomation.github.io/mcp-playwright/) | [API reference](https://executeautomation.github.io/mcp-playwright/docs/playwright-web/Supported-Tools)

## Installation

You can install the package using either npm, mcp-get, or Smithery:

Using npm:
```bash
npm install -g @executeautomation/playwright-mcp-server
```

Using mcp-get:
```bash
npx @michaellatman/mcp-get@latest install @executeautomation/playwright-mcp-server
```
Using Smithery

To install Playwright MCP for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@executeautomation/playwright-mcp-server):

```bash
npx -y @smithery/cli install @executeautomation/playwright-mcp-server --client claude
```
## Configuration to use Playwright Server
Here's the Claude Desktop configuration to use the Playwright server:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

## Testing

This project uses Jest for testing. The tests are located in the `src/__tests__` directory.

### Running Tests

You can run the tests using one of the following commands:

```bash
# Run tests using the custom script (with coverage)
node run-tests.cjs

# Run tests using npm scripts
npm test           # Run tests without coverage
npm run test:coverage  # Run tests with coverage
npm run test:custom    # Run tests with custom script (same as node run-tests.cjs)
```

The test coverage report will be generated in the `coverage` directory.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=executeautomation/mcp-playwright&type=Date)](https://star-history.com/#executeautomation/mcp-playwright&Date)

## Code Generation

The MCP server now includes support for generating Playwright tests from your tool actions. This feature allows you to record your interactions and automatically generate test scripts.

### Usage

1. Start a recording session:
```typescript
const { sessionId } = await handleToolCall('start_codegen_session', {
  options: {
    outputPath: 'tests/generated',
    testNamePrefix: 'MyTest',
    includeComments: true
  }
}, {});
```

2. Perform your actions using MCP tools:
```typescript
await handleToolCall('playwright_goto', { url: 'https://example.com' }, {});
await handleToolCall('playwright_click', { selector: '#submit-button' }, {});
await handleToolCall('playwright_fill', { selector: '#search', value: 'query' }, {});
```

3. End the session and generate the test:
```typescript
const { filePath, testCode } = await handleToolCall('end_codegen_session', {
  sessionId
}, {});
```

The generated test will be saved in the specified output directory and can be run using Playwright Test:

```bash
npx playwright test tests/generated/mytest_*.spec.ts
```

### Additional Features

- **Session Management**: Use `get_codegen_session` to retrieve session information and `clear_codegen_session` to clean up sessions.
- **Customization**: Configure output paths, test name prefixes, and comment inclusion through options.
- **Tool Integration**: Automatically records all MCP tool actions for test generation.

### Generated Test Example

```typescript
import { test, expect } from '@playwright/test';

test('MyTest_2024-03-23', async ({ page }) => {
  // Navigate to example.com
  await page.goto('https://example.com');

  // Click submit button
  await page.click('#submit-button');

  // Fill search input
  await page.fill('#search', 'query');
});
```
