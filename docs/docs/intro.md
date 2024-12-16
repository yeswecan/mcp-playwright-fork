---
sidebar_position: 1
---

# Playwright MCP Server

A ***Playwright Model Context Protocol server*** that provides Browser and API automation capabilities using Playwright. 

***Playwright MCP server*** enables LLMs to interact with web pages, take screenshots, and execute JavaScript in a real browser environment and perform API tests.

## Configuring Playwright MCP in Claude Desktop 
Here's the Claude Desktop configuration to use the Playwright MCP server.

Modify your `claude-desktop-config.json` file as shown below

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


You can install Playwright MCP Server package using either **npm**, **mcp-get**, or **Smithery**:

### Installing via NPM
To install Playwright MCP for Claude Desktop automatically via Smithery:

```bash
npx npm install -g @executeautomation/playwright-mcp-server
```

### Installing via Smithery
To install Playwright MCP for Claude Desktop automatically via Smithery:

```bash
npx @smithery/cli install @executeautomation/playwright-mcp-server --client claude
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

### Installing via MCP-GET
To install Playwright MCP for Claude Desktop automatically via Smithery:

```bash
npx @michaellatman/mcp-get@latest install @executeautomation/playwright-mcp-server
```