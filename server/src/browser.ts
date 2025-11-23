import 'dotenv/config';
import { chromium, Browser } from 'playwright-core';

export async function launchBrowser(): Promise<Browser> {
  const options: any = {
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'] // Standard args for constrained environments
  };

  if (process.env.CHROMIUM_PATH) {
    options.executablePath = process.env.CHROMIUM_PATH;
  }

  // In a real scenario we might need to handle PLAYWRIGHT_BROWSERS_PATH=0
  // but that's an env var set outside the code usually.

  return await chromium.launch(options);
}
