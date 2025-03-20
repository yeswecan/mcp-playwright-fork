import type { Browser, Page } from 'playwright';
import { ToolHandler, ToolContext, ToolResponse, createErrorResponse } from '../common/types.js';

/**
 * Base class for all browser-based tools
 * Provides common functionality and error handling
 */
export abstract class BrowserToolBase implements ToolHandler {
  protected server: any;

  constructor(server: any) {
    this.server = server;
  }

  /**
   * Main execution method that all tools must implement
   */
  abstract execute(args: any, context: ToolContext): Promise<ToolResponse>;

  /**
   * Ensures a page is available and returns it
   * @param context The tool context containing browser and page
   * @returns The page or null if not available
   */
  protected ensurePage(context: ToolContext): Page | null {
    if (!context.page) {
      return null;
    }
    return context.page;
  }

  /**
   * Validates that a page is available and returns an error response if not
   * @param context The tool context
   * @returns Either null if page is available, or an error response
   */
  protected validatePageAvailable(context: ToolContext): ToolResponse | null {
    if (!this.ensurePage(context)) {
      return createErrorResponse("Browser page not initialized");
    }
    return null;
  }

  /**
   * Safely executes a browser operation with proper error handling
   * @param context The tool context
   * @param operation The async operation to perform
   * @returns The tool response
   */
  protected async safeExecute(
    context: ToolContext,
    operation: (page: Page) => Promise<ToolResponse>
  ): Promise<ToolResponse> {
    // Basic validation first
    if (!context.page || !context.browser) {
      const { resetBrowserState } = await import('../../toolHandler.js');
      resetBrowserState();
      return createErrorResponse("Browser session not available. Please try again with a new action.");
    }

    try {
      // Verify browser and page are in a good state
      if (!context.browser.isConnected || context.page.isClosed()) {
        const { resetBrowserState } = await import('../../toolHandler.js');
        resetBrowserState();
        return createErrorResponse("Browser session has been closed. Please try again with a new action.");
      }

      // Execute the operation if everything looks good
      return await operation(context.page);
    } catch (error) {
      // Handle specific errors
      const errorMessage = (error as Error).message;
      
      // Check for connection-related errors
      if (
        errorMessage.includes("Target page, context or browser has been closed") ||
        errorMessage.includes("Protocol error") ||
        errorMessage.includes("Connection closed") ||
        errorMessage.includes("Browser has been closed")
      ) {
        const { resetBrowserState } = await import('../../toolHandler.js');
        resetBrowserState();
        return createErrorResponse("Browser connection was lost. Please try again with a new action.");
      }
      
      // For other errors, just report them
      return createErrorResponse(`Operation failed: ${errorMessage}`);
    }
  }
} 