export { adminFetch } from './admin-fetch.js';

declare class NextApiResponse {
    static success<T>(data: T, status?: number): Response;
    static paginated<T>(items: T[], page: number, pageSize: number, total: number, dataKey?: string): Response;
    static created<T>(data: T): Response;
    static noContent(): Response;
    static error(message: string, status?: number, code?: string): Response;
    static notFound(message?: string): Response;
    static unauthorized(message?: string): Response;
    static forbidden(message?: string): Response;
    static serverError(message?: string): Response;
}

declare function cn(...classes: (string | undefined | null | false)[]): string;

declare function formatDate(date: string | Date): string;
declare function timeAgo(dateStr: string): string;

interface ResizeResult {
    file: File;
    wasResized: boolean;
    originalSize: number;
    newSize: number;
}
declare function resizeImageIfNeeded(file: File): Promise<ResizeResult>;
declare function validateImageSize(file: File): string | null;

export { NextApiResponse, type ResizeResult, cn, formatDate, resizeImageIfNeeded, timeAgo, validateImageSize };
