import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY muss ein 64-stelliger Hex-String (32 Bytes) sein"
    );
  }
  return Buffer.from(key, "hex");
}

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
  tag: string;
}

export function encrypt(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decrypt(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(payload.encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/** Generiert ein kryptographisch starkes Token für QR-Code-URLs */
export function generateAccessToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/** Generiert ein Token für Bearbeitungszugriff */
export function generateEditToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/** Hasht eine IP-Adresse für DSGVO-konformes Logging */
export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.ENCRYPTION_KEY || ""))
    .digest("hex")
    .substring(0, 16);
}

/** Hasht einen PIN mit bcrypt-ähnlichem Verfahren (hier einfacher SHA256+Salt für MVP) */
export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(pin + salt)
    .digest("hex");
  return `${salt}:${hash}`;
}

/** Verifiziert einen PIN gegen den Hash */
export function verifyPin(pin: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const computedHash = crypto
    .createHash("sha256")
    .update(pin + salt)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(computedHash, "hex")
  );
}
