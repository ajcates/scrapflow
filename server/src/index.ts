import 'dotenv/config';
import express from 'express';
import { PlaywrightProxyDriver } from './drivers/PlaywrightProxyDriver.js';

export const app = express();

const proxyDriver = new PlaywrightProxyDriver();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/proxy', async (req, res) => {
    const url = req.query.url as string;
    if (!url) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        // Injection script to handle interaction (Option A)
        // This script will capture clicks and send them to the parent window
        const injectionScript = `
            document.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const target = e.target;
                // Simple path generator (can be improved)
                let className = '';
                if (target.classList && target.classList.length > 0) {
                    className = '.' + Array.from(target.classList).join('.');
                }
                const path = target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + className;

                window.parent.postMessage({
                    type: 'ELEMENT_SELECTED',
                    payload: {
                        tagName: target.tagName,
                        path: path,
                        text: target.innerText
                    }
                }, '*');

                // Highlight effect (temporary)
                target.style.outline = '2px solid red';
            }, true);

            console.log('ScrapFlow proxy script injected');
        `;

        const html = await proxyDriver.fetch(url, injectionScript);
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching URL');
    }
});

// Only start the server if this file is run directly
/* c8 ignore start */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
/* c8 ignore stop */
