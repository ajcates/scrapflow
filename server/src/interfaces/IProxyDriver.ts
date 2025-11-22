export interface IProxyDriver {
    /**
     * Fetches the content of a URL, rewriting relative paths to absolute ones.
     * @param url The URL to fetch.
     * @returns The HTML content of the page with rewritten paths.
     */
    fetch(url: string): Promise<string>;
}
