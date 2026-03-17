/**
 * Client-side encryption using Web Crypto API (AES-256-GCM)
 * NEVER import this in server components or API routes.
 */

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function encrypt(plaintext: string): Promise<{ encryptedData: string; iv: string; key: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  const rawKey = await crypto.subtle.exportKey("raw", cryptoKey);

  return {
    encryptedData: toBase64Url(encrypted),
    iv: toBase64Url(iv.buffer as ArrayBuffer),
    key: toBase64Url(rawKey),
  };
}

export async function decrypt(encryptedData: string, iv: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(fromBase64Url(key)) as unknown as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(fromBase64Url(iv)) as unknown as ArrayBuffer },
    cryptoKey,
    new Uint8Array(fromBase64Url(encryptedData)) as unknown as ArrayBuffer
  );

  return new TextDecoder().decode(decrypted);
}

export function buildHashUrl(baseUrl: string, encryptedData: string, iv: string, key: string): string {
  return `${baseUrl}/view#v1.${encryptedData}.${iv}.${key}`;
}

export function parseHash(hash: string): { encryptedData: string; iv: string; key: string } | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw.startsWith("v1.")) return null;
  const parts = raw.slice(3).split(".");
  if (parts.length !== 3) return null;
  return { encryptedData: parts[0], iv: parts[1], key: parts[2] };
}
