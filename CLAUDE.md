# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScrapFlow is a mobile web scraper with a visual, point-and-click interface. Users interact with proxied web pages in an iframe to define scraping rules without writing code. The system uses Playwright for browser automation and follows strict Test-Driven Development (TDD) practices.

**Current Status**: Phase 2 complete (Proxy System), Phase 3 partial (App Shell)

## Monorepo Structure

This is an npm workspaces monorepo:
- `client/` - Vue 3 + Vite + Material Web Components frontend
- `server/` - Express + Playwright-core backend
- Root `package.json` orchestrates both workspaces

## Development Commands

```bash
# Start both client and server in watch mode
npm run dev

# Run all tests (both workspaces)
npm test

# Client development server (http://localhost:5173)
cd client && npm run dev

# Server development with watch mode (tsx)
cd server && npm run dev

# Server start without watch
cd server && npm start

# Client tests with Vitest
cd client && npm test

# Server tests with node-tap
cd server && npm test
```

## Testing Philosophy

**Strict TDD with Red-Green-Refactor**:
- Write failing tests first (Red phase)
- Implement minimal code to pass (Green phase)
- Refactor with confidence

**Frameworks**:
- Server: `node-tap` (TAP protocol, built-in assertions)
  - Configuration: `.taprc` in server directory allows incomplete coverage
- Client: `Vitest` with `@vue/test-utils` and `happy-dom`
  - Configured to treat `md-*` elements as custom elements (Material Web Components)

**Test Organization**:
- Unit tests: Individual class/function behavior
- Integration tests: API endpoints and component interactions
- E2E tests: Full browser automation with Playwright

**Running single tests**:
```bash
# Server - use node-tap's grep option
cd server && npm test -- --grep="test name pattern"

# Client - use Vitest's filter
cd client && npm test -- -t "test name pattern"
```

## Architecture Patterns

### Proxy-Based Architecture

The core pattern: Server fetches web content via Playwright, rewrites URLs, injects interaction scripts, and serves modified HTML to the client's iframe.

**Key file**: `server/src/drivers/PlaywrightProxyDriver.ts`

```typescript
interface IProxyDriver {
    fetch(url: string, injectionScript?: string): Promise<string>;
}
```

**URL Rewriting**: Uses Cheerio to convert all relative URLs to absolute (images, scripts, links, stylesheets) so they work when served through the proxy.

**Script Injection**: Injects event handlers into proxied pages to capture user interactions (clicks) and communicate with parent window via `postMessage`.

### Communication Flow

```
User clicks element in iframe → Injected script → postMessage →
Parent window (App.vue) → State update → UI reflects selection
```

**Key file**: `client/src/App.vue` (lines 90-104 for postMessage listener)

### Mobile Emulation

All proxy requests use Playwright's mobile emulation:
- Viewport: 375x812 (iPhone X)
- User Agent: Android 10 Pixel 3
- Device scale factor: 3x

**Rationale**: Project specifically targets mobile web scraping for consistent rendering.

### Interface-Driven Design

The `IProxyDriver` interface allows multiple implementations (future: WebSocket driver, Puppeteer driver, etc.). Current implementation is `PlaywrightProxyDriver`.

## Termux Environment

This project runs in Termux (Android terminal). Critical configurations:

**Environment variables** (`.env` file in repository root):
```bash
PLAYWRIGHT_BROWSERS_PATH=0
CHROMIUM_PATH=/data/data/com.termux/files/usr/bin/chromium-browser
```

**IMPORTANT**: These environment variables MUST be set before playwright-core is imported, otherwise it will fail with "Unsupported platform: android" error. The server package.json scripts automatically set these variables.

**Browser launch flags**:
- `--no-sandbox` (required for Termux)
- `--disable-gpu`
- Headless mode

**Key file**: `server/src/browser.ts`

## TypeScript Configuration

Three-level configuration hierarchy:
- `tsconfig.base.json` - Shared base (ES2022, NodeNext modules, strict mode)
- `server/tsconfig.json` - Extends base
- `client/tsconfig.{json,app.json,node.json}` - Client-specific configs

**Strict mode enabled** across all workspaces.

## Key Files & Entry Points

### Server
- `src/index.ts` - Express app, routes, proxy endpoint
- `src/browser.ts` - Playwright browser launcher with Termux config
- `src/drivers/PlaywrightProxyDriver.ts` - Core proxy logic
- `src/interfaces/IProxyDriver.ts` - Driver interface contract

### Client
- `src/main.ts` - Vue app initialization, Material Web Components registration
- `src/App.vue` - Main component with iframe, URL bar, element selection display
- `index.html` - Entry point

### Tests
- `server/tests/playwright_proxy.test.ts` - Driver unit tests (103 lines)
- `server/tests/integration_proxy_endpoint.test.ts` - API integration tests
- `server/tests/interaction_e2e.test.ts` - End-to-end browser tests
- `client/tests/App.test.ts` - Component tests

## Critical Design Decisions

1. **Cheerio for HTML manipulation**: Faster than Playwright's DOM API for simple URL rewrites
2. **Script injection over WebSocket**: Simpler initial implementation, works well with iframe sandbox
3. **Interface abstraction**: `IProxyDriver` enables future alternative implementations
4. **Mobile-first always**: All proxied content uses mobile emulation
5. **Monorepo with workspaces**: Shared TypeScript config, unified testing

## Project Roadmap Context

The `notes/RoadMap.md` outlines 5 phases:
1. ✅ Project initialization
2. ✅ Proxy driver system
3. ⚠️ Frontend core (partial - app shell done, element selection in progress)
4. ❌ Scraping engine (not started)
5. ❌ Data persistence (not started)

Reference `notes/RoadMap.md` for detailed phase specifications and `notes/prompt.md` for original requirements.

## Code Quality Standards

- **Test coverage**: Current ratio is 2.1:1 (test lines to source lines)
- **TDD required**: Write tests before implementation
- **Type safety**: Strict TypeScript, no `any` types without justification
- **Error handling**: All async operations must handle errors, close browser instances in `finally` blocks

## Test Configuration

### Server (node-tap)
The `.taprc` file in `server/` directory contains:
```yaml
disable-coverage: false
allow-incomplete-coverage: true
```
This allows tests to pass even if coverage isn't 100%, which is necessary because some code paths (like error handling) are difficult to test.

### Client (Vitest)
The `vite.config.ts` configures Material Web Components as custom elements:
```typescript
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('md-')
    }
  }
})
```
This prevents Vue warnings about unresolved components during tests.

## Common Development Patterns

### Adding a new proxy endpoint
1. Define interface contract in `IProxyDriver`
2. Write unit tests (Red phase)
3. Implement in `PlaywrightProxyDriver` (Green phase)
4. Add Express route in `src/index.ts`
5. Write integration test

### Adding a new client feature
1. Write Vitest component test
2. Implement in `App.vue` or new component
3. Ensure Material Web Components are properly imported
4. Test postMessage communication if involving iframe

### Browser automation tests
- Use ephemeral HTTP servers with port 0 (auto-assign)
- Always close browsers in `finally` blocks
- Use `waitUntil: 'domcontentloaded'` for faster loads
- Verify mobile User Agent in tests

## Debugging Tips

- Server logs go to console (check Express output)
- Client errors visible in browser console
- **"Unsupported platform: android" error**: This means PLAYWRIGHT_BROWSERS_PATH=0 was not set before playwright-core was imported. The server package.json scripts handle this automatically. If running tests or server manually, always set these env vars first.
- Playwright browser crashes: Check Termux browser path and flags in `.env` file
- CORS issues: Verify iframe sandbox attributes and postMessage origins
- Proxy not loading: Check URL rewriting logic in PlaywrightProxyDriver

## Environment Variable Loading

Due to playwright-core's platform check at import time, environment variables must be set BEFORE any module imports playwright-core. This is why:
- Server package.json scripts prefix commands with `PLAYWRIGHT_BROWSERS_PATH=0 CHROMIUM_PATH=...`
- All source files import `'dotenv/config'` at the top (as a fallback)
- If you run node directly, always set these env vars in the command