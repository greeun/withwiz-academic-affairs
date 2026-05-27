/**
 * Filename sanitizer for HWPX outputs (Sprint 3 amendment (c)).
 *
 * - Strips path separators (`/`, `\\`), control characters, and `..`.
 * - Collapses internal whitespace.
 * - Trims to 200 UTF-8 bytes to stay well under common ZIP filename limits.
 */
const CONTROL_CHAR_RE = new RegExp("[\\x00-\\x1F\\x7F]", "g");

export function sanitizeFilename(name: string): string {
  let s = name ?? "";
  // Replace path separators and parent-dir indicator with underscore.
  s = s.replace(/\\/g, "_");
  s = s.replace(/\//g, "_");
  s = s.replace(/\.\.+/g, "_");
  // Remove control chars (0x00–0x1F, 0x7F).
  s = s.replace(CONTROL_CHAR_RE, "_");
  // Collapse runs of whitespace.
  s = s.replace(/\s+/g, " ").trim();
  if (s.length === 0) s = "untitled";

  // Trim to 200 UTF-8 bytes.
  const enc = new TextEncoder();
  let bytes = enc.encode(s);
  if (bytes.length <= 200) return s;
  // Walk back code-points until we fit.
  let truncated = s;
  while (bytes.length > 200 && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    bytes = enc.encode(truncated);
  }
  return truncated || "untitled";
}

/**
 * RFC 6266 percent-encoding for `Content-Disposition: filename*=UTF-8''...`.
 * Encodes UTF-8 bytes per RFC 8187 (token chars left alone).
 */
export function encodeRfc5987(value: string): string {
  return encodeURIComponent(value)
    .replace(/['()]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
    .replace(/\*/g, "%2A");
}
