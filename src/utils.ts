import { readFileSync } from 'fs';

/**
 * Load CSS from file
 */
export function loadCSS(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

/**
 * Load HTML from file
 */
export function loadHTML(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

/**
 * Inline images as base64
 */
export function inlineImage(imagePath: string, mimeType?: string): string {
  const buffer = readFileSync(imagePath);
  const base64 = buffer.toString('base64');
  const mime = mimeType || guessMimeType(imagePath);
  return `data:${mime};base64,${base64}`;
}

function guessMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  };
  return mimeTypes[ext || ''] || 'image/png';
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
