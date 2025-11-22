import t from 'tap';
import express from 'express';
import http from 'http';
import { PlaywrightProxyDriver } from '../src/drivers/PlaywrightProxyDriver.js';
import { launchBrowser } from '../src/browser.js';

// What: Verify the "Script Injection" mechanism for Option A
// Why: To ensure the frontend can communicate with the proxied page inside the iframe.

t.test('Interaction Injection E2E', async (t) => {
    // 1. Setup Target Server (The website we want to scrape)
    const targetApp = express();
    const targetServer = http.createServer(targetApp);
    targetApp.get('/target', (req, res) => {
        res.send(`<html><body><h1 id="target">Target Content</h1></body></html>`);
    });
    await new Promise<void>(resolve => targetServer.listen(0, resolve));
    const targetPort = (targetServer.address() as any).port;
    const targetUrl = `http://localhost:${targetPort}/target`;

    // 2. Setup Proxy Driver (Our Backend Logic)
    // We need to extend the driver or configure it to inject a specific script.
    // For this test, we assume the driver has a method `setInjectionScript` or similar,
    // or we pass it during fetch. Let's assume a new method `fetchWithInjection`.
    const driver = new PlaywrightProxyDriver();
    const injectionScript = `
        window.parent.postMessage({ type: 'HANDSHAKE', payload: 'Hello from iframe' }, '*');
        console.log('Injected script running');
    `;

    // We will test two things:
    // A. The returned HTML contains the script.
    // B. When loaded in a browser, the script executes and sends a message.

    // A. Check HTML content
    // Note: We are calling a method that doesn't exist yet (Red phase)
    // casting to any to avoid TS errors during the "Red" phase creation if checking strictly
    const html = await (driver as any).fetch(targetUrl, injectionScript);

    t.match(html, injectionScript, 'HTML should contain the injected script');

    // B. Browser Verification (The "playwright-termux script" requested)
    // We act as the "Client App" here.
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // We can't just load `html` string directly into a page with goto easily without a server
    // or using setContent. setContent is fine for this verification.

    // Set up a listener for console logs to verify execution
    const consoleLogs: string[] = [];
    page.on('console', msg => consoleLogs.push(msg.text()));

    // We need to simulate the iframe environment.
    // So we load a "Host Page" that contains an iframe with the content.
    // Actually, simplified: We just load the content with `setContent` and check if it runs.
    // But `window.parent.postMessage` implies we are in an iframe or window.

    // Let's try to intercept the postMessage.
    // In Playwright, we can expose a binding, but `window.parent.postMessage` targets the parent window.
    // If we load this html as the top level page, window.parent === window.

    await page.setContent(html);

    // Wait a bit for execution
    await page.waitForTimeout(100);

    t.ok(consoleLogs.includes('Injected script running'), 'Injected script should execute and log to console');

    await browser.close();
    targetServer.close();
});
