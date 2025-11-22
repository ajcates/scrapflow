import t from 'tap';
import { app } from '../src/index.js';
import http from 'http';
import express from 'express';

// What: Verify the Proxy Endpoint integration
// Why: To ensure the Express route correctly invokes the driver and returns content.

t.test('Proxy Endpoint Integration', async (t) => {
    // 1. Setup Target Server
    const targetApp = express();
    const targetServer = http.createServer(targetApp);
    targetApp.get('/target', (req, res) => {
        res.send(`<html><body><h1 id="target">Target Content</h1></body></html>`);
    });
    await new Promise<void>(resolve => targetServer.listen(0, resolve));
    const targetPort = (targetServer.address() as any).port;
    const targetUrl = `http://localhost:${targetPort}/target`;

    // 2. Setup Main Server
    const server = http.createServer(app);
    await new Promise<void>(resolve => server.listen(0, resolve));
    const port = (server.address() as any).port;
    const baseUrl = `http://localhost:${port}`;

    t.teardown(() => {
        server.close();
        targetServer.close();
    });

    // 3. Test request
    const res = await fetch(`${baseUrl}/proxy?url=${encodeURIComponent(targetUrl)}`);
    t.equal(res.status, 200, 'Should return 200 OK');

    const html = await res.text();
    t.match(html, /Target Content/, 'Should contain target content');
    t.match(html, /ScrapFlow proxy script injected/, 'Should contain injected script');
});
