import { IProxyDriver } from '../interfaces/IProxyDriver.js';
import { launchBrowser } from '../browser.js';
import * as cheerio from 'cheerio';
import { Browser, Page } from 'playwright-core';

export class PlaywrightProxyDriver implements IProxyDriver {

    async fetch(url: string, injectionScript?: string): Promise<string> {
        const browser: Browser = await launchBrowser();
        try {
            // Emulate a mobile device
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36',
                viewport: { width: 375, height: 812 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            });

            const page: Page = await context.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            const content = await page.content();
            const $ = cheerio.load(content);

            // Helper to rewrite URLs
            const rewriteUrl = (attrName: string, element: any) => {
                const val = $(element).attr(attrName);
                if (val) {
                    try {
                        // Resolve absolute URL based on the current page URL
                        const absoluteUrl = new URL(val, url).toString();
                        $(element).attr(attrName, absoluteUrl);
                    } catch (e) {
                        // Ignore invalid URLs
                    }
                }
            };

            // Rewrite common attributes that contain URLs
            $('img').each((_, el) => rewriteUrl('src', el));
            $('script').each((_, el) => rewriteUrl('src', el));
            $('link').each((_, el) => rewriteUrl('href', el));
            $('a').each((_, el) => rewriteUrl('href', el));

            // TODO: Rewrite CSS url() values if needed, but that requires parsing CSS.
            // For now, we handle the main HTML elements.

            if (injectionScript) {
                $('body').append(`<script>${injectionScript}</script>`);
            }

            return $.html();
        } finally {
            await browser.close();
        }
    }
}
