/** Bearer tokens are only attached to same-origin requests so they never leak to third-party hosts. */
declare function isSameOrigin(url: string): boolean;
declare function adminFetch(url: string, options?: RequestInit): Promise<Response>;

export { adminFetch, isSameOrigin };
