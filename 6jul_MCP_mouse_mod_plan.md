# MCP Mouse Commands Modification Plan
**Date**: July 6, 2025  
**Project**: Adding Mouse Control Commands to Playwright MCP Server

## 📋 Overview
Add mouse control commands to the Playwright MCP server to enable precise mouse movement and dragging through MCP calls instead of direct Playwright API usage.

## 🎯 Goals
1. Add `playwright_mouse_move` command for precise mouse positioning
2. Add `playwright_smooth_drag` command for complete drag operations
3. Enable visual drag testing through MCP calls
4. Maintain compatibility with existing MCP server functionality

## 📝 Commands to Add

### Command 1: `playwright_mouse_move`
- **Purpose**: Move mouse to specific coordinates without clicking
- **Parameters**: 
  - `x` (number, required): X coordinate
  - `y` (number, required): Y coordinate  
  - `steps` (number, optional): Intermediate steps for smooth movement (default: 1)
- **Implementation**: Uses `page.mouse.move(x, y, {steps})`

### Command 2: `playwright_smooth_drag`
- **Purpose**: Complete drag operation from start to end coordinates
- **Parameters**:
  - `fromX` (number, required): Start X coordinate
  - `fromY` (number, required): Start Y coordinate
  - `toX` (number, required): End X coordinate
  - `toY` (number, required): End Y coordinate
  - `steps` (number, optional): Steps for smooth movement (default: 10)
  - `delay` (number, optional): Delay between steps in ms (default: 100)
- **Implementation**: 
  1. `page.mouse.move(fromX, fromY)`
  2. `page.mouse.down()`
  3. Loop with `page.mouse.move()` for intermediate positions
  4. `page.mouse.up()`

## 🏗️ Implementation Steps

### Step 1: Add Tool Definitions
- **File**: `dist/tools.js`
- **Action**: Add schema definitions for both new commands
- **Test**: Verify tool definitions are loaded correctly

### Step 2: Create Mouse Tool Classes
- **File**: `dist/tools/browser/mouse.js` (new file)
- **Action**: Create `MouseMoveTool` and `SmoothDragTool` classes
- **Test**: Unit test each tool class independently

### Step 3: Update Tool Handler
- **File**: `dist/toolHandler.js`
- **Action**: Add routing for new mouse commands
- **Test**: Verify commands are properly routed to handlers

### Step 4: Update Browser Tools List
- **File**: Multiple files
- **Action**: Add new commands to BROWSER_TOOLS array and exports
- **Test**: Verify commands appear in tool listings

### Step 5: Build and Test
- **Action**: Run `npm run build` to compile changes
- **Test**: Verify no compilation errors

## 🧪 Testing Strategy

### Test Phase 1: MCP Command Verification
- **Test File**: `test-mouse-commands.js`
- **Actions**:
  1. Connect to MCP server
  2. List tools to verify new commands exist
  3. Test each command individually
  4. Verify error handling
- **Success Criteria**: Commands execute without errors

### Test Phase 2: Visual Drag Test via MCP
- **Test File**: `mcp-visual-drag-test.js`
- **Actions**:
  1. Start HTML test server
  2. Connect to MCP server
  3. Open browser via `playwright_navigate`
  4. Use `playwright_mouse_move` for positioning
  5. Use `playwright_smooth_drag` for drag operations
  6. Verify visual feedback (red dot, trails, coordinates)
- **Success Criteria**: 
  - Mouse movements visible in browser
  - Drag trails appear correctly
  - Coordinates match expected positions

### Test Phase 3: Integration Test
- **Test File**: `complete-mcp-integration-test.js`
- **Actions**:
  1. Run 5 complete drag demonstrations
  2. Log mouse positions and button states
  3. Compare with original direct Playwright test
  4. Verify performance and reliability
- **Success Criteria**: MCP version matches direct Playwright behavior

## 📁 File Structure Changes

```
dist/
├── tools/
│   └── browser/
│       ├── mouse.js (NEW)
│       └── index.js (UPDATED - export mouse tools)
├── tools.js (UPDATED - add tool definitions)
├── toolHandler.js (UPDATED - add command routing)
└── types.js (UPDATED if needed)

test files/
├── test-mouse-commands.js (NEW)
├── mcp-visual-drag-test.js (NEW)
└── complete-mcp-integration-test.js (NEW)
```

## ✅ Success Criteria

1. **Functional Requirements**:
   - `playwright_mouse_move` moves mouse to exact coordinates
   - `playwright_smooth_drag` performs complete drag operations
   - Commands work with existing browser management

2. **Visual Requirements**:
   - Red dot follows mouse movements precisely
   - Green dot appears during drag operations
   - Trail dots show drag path accurately
   - Coordinates display matches mouse position

3. **Integration Requirements**:
   - No breaking changes to existing MCP commands
   - Proper error handling and validation
   - Performance comparable to direct Playwright calls

4. **Testing Requirements**:
   - All test phases pass successfully
   - Visual drag test matches original behavior
   - Commands work in both headless and non-headless modes

## 🚨 Risk Mitigation

1. **Backup Strategy**: Keep original working test files
2. **Incremental Testing**: Test each step before proceeding
3. **Rollback Plan**: Document exact file changes for easy reversion
4. **Compatibility**: Ensure no changes affect existing functionality

## 📊 Acceptance Test

Final acceptance test will be running the visual drag demonstration entirely through MCP commands, showing:
- 5 drag operations from (100,100) to (300,300)
- 10-second smooth drag duration
- Console logging of mouse positions and button states
- Visual feedback matching original direct Playwright test

## 📋 Deliverables

1. Modified MCP server with mouse commands
2. Test suite demonstrating functionality
3. Documentation of changes made
4. Execution report with observations and results