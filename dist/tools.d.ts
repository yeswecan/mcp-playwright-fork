export declare function createToolDefinitions(): [{
    readonly name: "start_codegen_session";
    readonly description: "Start a new code generation session to record Playwright actions";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly options: {
                readonly type: "object";
                readonly description: "Code generation options";
                readonly properties: {
                    readonly outputPath: {
                        readonly type: "string";
                        readonly description: "Directory path where generated tests will be saved (use absolute path)";
                    };
                    readonly testNamePrefix: {
                        readonly type: "string";
                        readonly description: "Prefix to use for generated test names (default: 'GeneratedTest')";
                    };
                    readonly includeComments: {
                        readonly type: "boolean";
                        readonly description: "Whether to include descriptive comments in generated tests";
                    };
                };
                readonly required: readonly ["outputPath"];
            };
        };
        readonly required: readonly ["options"];
    };
}, {
    readonly name: "end_codegen_session";
    readonly description: "End a code generation session and generate the test file";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sessionId: {
                readonly type: "string";
                readonly description: "ID of the session to end";
            };
        };
        readonly required: readonly ["sessionId"];
    };
}, {
    readonly name: "get_codegen_session";
    readonly description: "Get information about a code generation session";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sessionId: {
                readonly type: "string";
                readonly description: "ID of the session to retrieve";
            };
        };
        readonly required: readonly ["sessionId"];
    };
}, {
    readonly name: "clear_codegen_session";
    readonly description: "Clear a code generation session without generating a test";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sessionId: {
                readonly type: "string";
                readonly description: "ID of the session to clear";
            };
        };
        readonly required: readonly ["sessionId"];
    };
}, {
    readonly name: "playwright_navigate";
    readonly description: "Navigate to a URL";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to navigate to the website specified";
            };
            readonly browserType: {
                readonly type: "string";
                readonly description: "Browser type to use (chromium, firefox, webkit). Defaults to chromium";
                readonly enum: readonly ["chromium", "firefox", "webkit"];
            };
            readonly width: {
                readonly type: "number";
                readonly description: "Viewport width in pixels (default: 1280)";
            };
            readonly height: {
                readonly type: "number";
                readonly description: "Viewport height in pixels (default: 720)";
            };
            readonly timeout: {
                readonly type: "number";
                readonly description: "Navigation timeout in milliseconds";
            };
            readonly waitUntil: {
                readonly type: "string";
                readonly description: "Navigation wait condition";
            };
            readonly headless: {
                readonly type: "boolean";
                readonly description: "Run browser in headless mode (default: false)";
            };
        };
        readonly required: readonly ["url"];
    };
}, {
    readonly name: "playwright_screenshot";
    readonly description: "Take a screenshot of the current page or a specific element";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly name: {
                readonly type: "string";
                readonly description: "Name for the screenshot";
            };
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for element to screenshot";
            };
            readonly width: {
                readonly type: "number";
                readonly description: "Width in pixels (default: 800)";
            };
            readonly height: {
                readonly type: "number";
                readonly description: "Height in pixels (default: 600)";
            };
            readonly storeBase64: {
                readonly type: "boolean";
                readonly description: "Store screenshot in base64 format (default: true)";
            };
            readonly fullPage: {
                readonly type: "boolean";
                readonly description: "Store screenshot of the entire page (default: false)";
            };
            readonly savePng: {
                readonly type: "boolean";
                readonly description: "Save screenshot as PNG file (default: false)";
            };
            readonly downloadsDir: {
                readonly type: "string";
                readonly description: "Custom downloads directory path (default: user's Downloads folder)";
            };
        };
        readonly required: readonly ["name"];
    };
}, {
    readonly name: "playwright_click";
    readonly description: "Click an element on the page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for the element to click";
            };
        };
        readonly required: readonly ["selector"];
    };
}, {
    readonly name: "playwright_iframe_click";
    readonly description: "Click an element in an iframe on the page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly iframeSelector: {
                readonly type: "string";
                readonly description: "CSS selector for the iframe containing the element to click";
            };
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for the element to click";
            };
        };
        readonly required: readonly ["iframeSelector", "selector"];
    };
}, {
    readonly name: "playwright_iframe_fill";
    readonly description: "Fill an element in an iframe on the page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly iframeSelector: {
                readonly type: "string";
                readonly description: "CSS selector for the iframe containing the element to fill";
            };
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for the element to fill";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Value to fill";
            };
        };
        readonly required: readonly ["iframeSelector", "selector", "value"];
    };
}, {
    readonly name: "playwright_fill";
    readonly description: "fill out an input field";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for input field";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Value to fill";
            };
        };
        readonly required: readonly ["selector", "value"];
    };
}, {
    readonly name: "playwright_select";
    readonly description: "Select an element on the page with Select tag";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for element to select";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Value to select";
            };
        };
        readonly required: readonly ["selector", "value"];
    };
}, {
    readonly name: "playwright_hover";
    readonly description: "Hover an element on the page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for element to hover";
            };
        };
        readonly required: readonly ["selector"];
    };
}, {
    readonly name: "playwright_upload_file";
    readonly description: "Upload a file to an input[type='file'] element on the page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for the file input element";
            };
            readonly filePath: {
                readonly type: "string";
                readonly description: "Absolute path to the file to upload";
            };
        };
        readonly required: readonly ["selector", "filePath"];
    };
}, {
    readonly name: "playwright_evaluate";
    readonly description: "Execute JavaScript in the browser console";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly script: {
                readonly type: "string";
                readonly description: "JavaScript code to execute";
            };
        };
        readonly required: readonly ["script"];
    };
}, {
    readonly name: "playwright_console_logs";
    readonly description: "Retrieve console logs from the browser with filtering options";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly description: "Type of logs to retrieve (all, error, warning, log, info, debug, exception)";
                readonly enum: readonly ["all", "error", "warning", "log", "info", "debug", "exception"];
            };
            readonly search: {
                readonly type: "string";
                readonly description: "Text to search for in logs (handles text with square brackets)";
            };
            readonly limit: {
                readonly type: "number";
                readonly description: "Maximum number of logs to return";
            };
            readonly clear: {
                readonly type: "boolean";
                readonly description: "Whether to clear logs after retrieval (default: false)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_close";
    readonly description: "Close the browser and release all resources";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_get";
    readonly description: "Perform an HTTP GET request";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to perform GET operation";
            };
        };
        readonly required: readonly ["url"];
    };
}, {
    readonly name: "playwright_post";
    readonly description: "Perform an HTTP POST request";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to perform POST operation";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Data to post in the body";
            };
            readonly token: {
                readonly type: "string";
                readonly description: "Bearer token for authorization";
            };
            readonly headers: {
                readonly type: "object";
                readonly description: "Additional headers to include in the request";
                readonly additionalProperties: {
                    readonly type: "string";
                };
            };
        };
        readonly required: readonly ["url", "value"];
    };
}, {
    readonly name: "playwright_put";
    readonly description: "Perform an HTTP PUT request";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to perform PUT operation";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Data to PUT in the body";
            };
        };
        readonly required: readonly ["url", "value"];
    };
}, {
    readonly name: "playwright_patch";
    readonly description: "Perform an HTTP PATCH request";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to perform PUT operation";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Data to PATCH in the body";
            };
        };
        readonly required: readonly ["url", "value"];
    };
}, {
    readonly name: "playwright_delete";
    readonly description: "Perform an HTTP DELETE request";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly url: {
                readonly type: "string";
                readonly description: "URL to perform DELETE operation";
            };
        };
        readonly required: readonly ["url"];
    };
}, {
    readonly name: "playwright_expect_response";
    readonly description: "Ask Playwright to start waiting for a HTTP response. This tool initiates the wait operation but does not wait for its completion.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "string";
                readonly description: "Unique & arbitrary identifier to be used for retrieving this response later with `Playwright_assert_response`.";
            };
            readonly url: {
                readonly type: "string";
                readonly description: "URL pattern to match in the response.";
            };
        };
        readonly required: readonly ["id", "url"];
    };
}, {
    readonly name: "playwright_assert_response";
    readonly description: "Wait for and validate a previously initiated HTTP response wait operation.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier of the HTTP response initially expected using `Playwright_expect_response`.";
            };
            readonly value: {
                readonly type: "string";
                readonly description: "Data to expect in the body of the HTTP response. If provided, the assertion will fail if this value is not found in the response body.";
            };
        };
        readonly required: readonly ["id"];
    };
}, {
    readonly name: "playwright_custom_user_agent";
    readonly description: "Set a custom User Agent for the browser";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly userAgent: {
                readonly type: "string";
                readonly description: "Custom User Agent for the Playwright browser instance";
            };
        };
        readonly required: readonly ["userAgent"];
    };
}, {
    readonly name: "playwright_get_visible_text";
    readonly description: "Get the visible text content of the current page";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_get_visible_html";
    readonly description: "Get the HTML content of the current page. By default, all <script> tags are removed from the output unless removeScripts is explicitly set to false.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector to limit the HTML to a specific container";
            };
            readonly removeScripts: {
                readonly type: "boolean";
                readonly description: "Remove all script tags from the HTML (default: true)";
            };
            readonly removeComments: {
                readonly type: "boolean";
                readonly description: "Remove all HTML comments (default: false)";
            };
            readonly removeStyles: {
                readonly type: "boolean";
                readonly description: "Remove all style tags from the HTML (default: false)";
            };
            readonly removeMeta: {
                readonly type: "boolean";
                readonly description: "Remove all meta tags from the HTML (default: false)";
            };
            readonly cleanHtml: {
                readonly type: "boolean";
                readonly description: "Perform comprehensive HTML cleaning (default: false)";
            };
            readonly minify: {
                readonly type: "boolean";
                readonly description: "Minify the HTML output (default: false)";
            };
            readonly maxLength: {
                readonly type: "number";
                readonly description: "Maximum number of characters to return (default: 20000)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_go_back";
    readonly description: "Navigate back in browser history";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_go_forward";
    readonly description: "Navigate forward in browser history";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
        readonly required: readonly [];
    };
}, {
    readonly name: "playwright_drag";
    readonly description: "Drag an element to a target location";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sourceSelector: {
                readonly type: "string";
                readonly description: "CSS selector for the element to drag";
            };
            readonly targetSelector: {
                readonly type: "string";
                readonly description: "CSS selector for the target location";
            };
        };
        readonly required: readonly ["sourceSelector", "targetSelector"];
    };
}, {
    readonly name: "playwright_press_key";
    readonly description: "Press a keyboard key";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly key: {
                readonly type: "string";
                readonly description: "Key to press (e.g. 'Enter', 'ArrowDown', 'a')";
            };
            readonly selector: {
                readonly type: "string";
                readonly description: "Optional CSS selector to focus before pressing key";
            };
        };
        readonly required: readonly ["key"];
    };
}, {
    readonly name: "playwright_save_as_pdf";
    readonly description: "Save the current page as a PDF file";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly outputPath: {
                readonly type: "string";
                readonly description: "Directory path where PDF will be saved";
            };
            readonly filename: {
                readonly type: "string";
                readonly description: "Name of the PDF file (default: page.pdf)";
            };
            readonly format: {
                readonly type: "string";
                readonly description: "Page format (e.g. 'A4', 'Letter')";
            };
            readonly printBackground: {
                readonly type: "boolean";
                readonly description: "Whether to print background graphics";
            };
            readonly margin: {
                readonly type: "object";
                readonly description: "Page margins";
                readonly properties: {
                    readonly top: {
                        readonly type: "string";
                    };
                    readonly right: {
                        readonly type: "string";
                    };
                    readonly bottom: {
                        readonly type: "string";
                    };
                    readonly left: {
                        readonly type: "string";
                    };
                };
            };
        };
        readonly required: readonly ["outputPath"];
    };
}, {
    readonly name: "playwright_click_and_switch_tab";
    readonly description: "Click a link and switch to the newly opened tab";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly selector: {
                readonly type: "string";
                readonly description: "CSS selector for the link to click";
            };
        };
        readonly required: readonly ["selector"];
    };
}];
export declare const BROWSER_TOOLS: string[];
export declare const API_TOOLS: string[];
export declare const CODEGEN_TOOLS: string[];
export declare const tools: string[];
