import { BrowserToolBase } from './base.js';
import { createSuccessResponse, createErrorResponse } from '../common/types.js';

/**
 * Tool for moving mouse to specific coordinates
 */
export class MouseMoveTool extends BrowserToolBase {
    /**
     * Execute the mouse move tool
     */
    async execute(args, context) {
        return this.safeExecute(context, async (page) => {
            const { x, y, steps = 1 } = args;
            
            // Validate coordinates
            if (typeof x !== 'number' || typeof y !== 'number') {
                return createErrorResponse("x and y coordinates must be numbers");
            }
            
            if (x < 0 || y < 0) {
                return createErrorResponse("Coordinates must be non-negative");
            }
            
            // Move mouse using Playwright's native mouse API
            await page.mouse.move(x, y, { steps });
            
            return createSuccessResponse(`Mouse moved to coordinates: (${x}, ${y})${steps > 1 ? ` with ${steps} steps` : ''}`);
        });
    }
}

/**
 * Tool for performing smooth drag operations
 */
export class SmoothDragTool extends BrowserToolBase {
    /**
     * Execute the smooth drag tool
     */
    async execute(args, context) {
        return this.safeExecute(context, async (page) => {
            const { fromX, fromY, toX, toY, steps = 10, delay = 100 } = args;
            
            // Validate coordinates
            if (typeof fromX !== 'number' || typeof fromY !== 'number' || 
                typeof toX !== 'number' || typeof toY !== 'number') {
                return createErrorResponse("All coordinates (fromX, fromY, toX, toY) must be numbers");
            }
            
            if (fromX < 0 || fromY < 0 || toX < 0 || toY < 0) {
                return createErrorResponse("All coordinates must be non-negative");
            }
            
            if (steps < 1) {
                return createErrorResponse("Steps must be at least 1");
            }
            
            if (delay < 0) {
                return createErrorResponse("Delay must be non-negative");
            }
            
            try {
                // Step 1: Move to start position
                await page.mouse.move(fromX, fromY);
                
                // Step 2: Press mouse button down
                await page.mouse.down();
                
                // Step 3: Perform smooth drag with intermediate steps
                for (let step = 1; step <= steps; step++) {
                    const progress = step / steps;
                    const currentX = fromX + (toX - fromX) * progress;
                    const currentY = fromY + (toY - fromY) * progress;
                    
                    await page.mouse.move(currentX, currentY);
                    
                    // Add delay between steps if specified
                    if (delay > 0 && step < steps) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
                
                // Step 4: Release mouse button
                await page.mouse.up();
                
                const totalTime = steps * delay;
                return createSuccessResponse(
                    `Smooth drag completed from (${fromX}, ${fromY}) to (${toX}, ${toY}) ` +
                    `with ${steps} steps${delay > 0 ? ` over ${totalTime}ms` : ''}`
                );
                
            } catch (error) {
                return createErrorResponse(`Drag operation failed: ${error.message}`);
            }
        });
    }
}