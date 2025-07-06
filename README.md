<div align="center" markdown="1">
  <table>
    <tr>
      <td align="center" valign="middle">
        <a href="https://mseep.ai/app/executeautomation-mcp-playwright">
          <img src="https://mseep.net/pr/executeautomation-mcp-playwright-badge.png" alt="MseeP.ai Security Assessment Badge" height="80"/>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=mcp-playwright">
          <img alt="Warp sponsorship" width="200" src="https://github.com/user-attachments/assets/ab8dd143-b0fd-4904-bdc5-dd7ecac94eae"/>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center"><sub>MseeP.ai Security Assessment</sub></td>
      <td align="center"><sub>Special thanks to <a href="https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=mcp-playwright">Warp, the AI terminal for developers</a></sub></td>
    </tr>
  </table>
</div>
<hr>

# Playwright MCP Server 🎭

[![smithery badge](https://smithery.ai/badge/@executeautomation/playwright-mcp-server)](https://smithery.ai/server/@executeautomation/playwright-mcp-server)

A Model Context Protocol server that provides browser automation capabilities using Playwright. This server enables LLMs to interact with web pages, take screenshots, generate test code, web scraps the page and execute JavaScript in a real browser environment.

<a href="https://glama.ai/mcp/servers/yh4lgtwgbe"><img width="380" height="200" src="https://glama.ai/mcp/servers/yh4lgtwgbe/badge" alt="mcp-playwright MCP server" /></a>

## Screenshot
![Playwright + Claude](image/playwright_claude.png)

## [Documentation](https://executeautomation.github.io/mcp-playwright/) | [API reference](https://executeautomation.github.io/mcp-playwright/docs/playwright-web/Supported-Tools)

## Installation

This fork includes additional **smooth mouse control commands** not available in the original version. Install this enhanced version:

### 🎯 **Recommended Installation (This Fork with Mouse Commands)**

#### For Claude Code:
```bash
claude mcp add --scope user playwright -- npx github:yeswecan/mcp-playwright-fork
```

#### For Claude Desktop:
Add this to your MCP configuration:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["github:yeswecan/mcp-playwright-fork"]
    }
  }
}
```

#### Alternative Installation Methods:
```bash
# Direct npx usage
npx github:yeswecan/mcp-playwright-fork

# Install globally from GitHub
npm install -g github:yeswecan/mcp-playwright-fork
```

### 📦 **Original Version Installation**

If you prefer the original version without mouse commands:

```bash
# Original via npm
npm install -g @executeautomation/playwright-mcp-server

# Original via npx  
npx @executeautomation/playwright-mcp-server
```

## Quick Start

After installation, you can immediately use all Playwright commands plus the new mouse control features:

```javascript
// New smooth mouse commands
await playwright_mouse_move({ x: 200, y: 200, steps: 10 });
await playwright_smooth_drag({ 
  fromX: 100, fromY: 100, 
  toX: 300, toY: 300, 
  steps: 15, delay: 200 
});
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

### Running evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval src/evals/evals.ts src/tools/codegen/index.ts
```

## Contributing

When adding new tools, please be mindful of the tool name length. Some clients, like Cursor, have a 60-character limit for the combined server and tool name (`server_name:tool_name`).

Our server name is `playwright-mcp`. Please ensure your tool names are short enough to not exceed this limit.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=executeautomation/mcp-playwright&type=Date)](https://star-history.com/#executeautomation/mcp-playwright&Date)
