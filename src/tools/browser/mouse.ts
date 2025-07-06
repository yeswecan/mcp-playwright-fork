import { BrowserToolBase } from './base.js';
import { ToolContext, ToolResponse, createSuccessResponse, createErrorResponse } from '../common/types.js';

/**
 * Tool for moving mouse to specific coordinates with smooth animation
 */
export class MouseMoveTool extends BrowserToolBase {
  /**
   * Execute the mouse move tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    // Parameter validation
    if (typeof args.x !== 'number' || typeof args.y !== 'number') {
      return createErrorResponse('x and y coordinates must be numbers');
    }

    if (args.x < 0 || args.y < 0) {
      return createErrorResponse('Coordinates must be non-negative');
    }

    const steps = args.steps || 1;
    if (typeof steps !== 'number' || steps < 1 || steps > 100) {
      return createErrorResponse('Steps must be a number between 1 and 100');
    }

    return this.safeExecute(context, async (page) => {
      await page.mouse.move(args.x, args.y, { steps });
      return createSuccessResponse(`Mouse moved to coordinates: (${args.x}, ${args.y}) with ${steps} steps`);
    });
  }
}

/**
 * Tool for performing smooth drag operations from start to end coordinates
 */
export class SmoothDragTool extends BrowserToolBase {
  /**
   * Execute the smooth drag tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    // Parameter validation
    const requiredParams = ['fromX', 'fromY', 'toX', 'toY'];
    for (const param of requiredParams) {
      if (typeof args[param] !== 'number') {
        return createErrorResponse(`${param} must be a number`);
      }
      if (args[param] < 0) {
        return createErrorResponse(`${param} must be non-negative`);
      }
    }

    const steps = args.steps || 10;
    const delay = args.delay || 100;

    if (typeof steps !== 'number' || steps < 1 || steps > 100) {
      return createErrorResponse('Steps must be a number between 1 and 100');
    }

    if (typeof delay !== 'number' || delay < 0 || delay > 5000) {
      return createErrorResponse('Delay must be a number between 0 and 5000 milliseconds');
    }

    return this.safeExecute(context, async (page) => {
      const { fromX, fromY, toX, toY } = args;
      
      // Move to starting position
      await page.mouse.move(fromX, fromY);
      
      // Press mouse button down
      await page.mouse.down();
      
      // Perform smooth drag with intermediate steps
      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const currentX = fromX + (toX - fromX) * progress;
        const currentY = fromY + (toY - fromY) * progress;
        
        await page.mouse.move(currentX, currentY);
        
        // Add delay between steps (except after the last step)
        if (i < steps && delay > 0) {
          await page.waitForTimeout(delay);
        }
      }
      
      // Release mouse button
      await page.mouse.up();
      
      const totalTime = steps * delay;
      return createSuccessResponse(
        `Smooth drag completed from (${fromX}, ${fromY}) to (${toX}, ${toY}) with ${steps} steps over ${totalTime}ms`
      );
    });
  }
}