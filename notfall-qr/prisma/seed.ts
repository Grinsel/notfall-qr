import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function encrypt(plaintext: string): { encryptedData: string; iv: string; tag: string } {
  const key = Buffer.from(
    process.env.ENCRYPTION_KEY || "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    "hex"
  );
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

async function main() {
  console.log("Seeding database...");

  const sensitiveData = JSON.stringify({
    accessInfo: "Ersatzschlüssel beim Nachbarn, Hausnummer 4, Familie Schmidt, 1. OG rechts. Klingeln und nach dem Schlüssel für Familie Müller fragen.",
    gasShutoff: "Keller, rechts neben dem Heizungsraum, roter Hebel an der Wand",
    electricPanel: "Flur, hinter der Garderobe, grauer Kasten mit Klapptür",
    waterShutoff: "Keller, neben der Waschmaschine, blaues Ventil an der Wand",
    additionalNotes: "Dachboden nur über ausziehbare Leiter im Flur erreichbar (Klappe an der Decke). Im Keller lagern keine Gefahrstoffe.",
    contactPerson: "Max Mustermann, Tel. 0171-1234567 (Vermieter)",
    pets: "1 Katze (grau-getigert, Name: Minka), scheu bei Fremden",
  });

  const encrypted = encrypt(sensitiveData);

  await prisma.emergencyRecord.create({
    data: {
      title: "Wohnung Familie Müller, Musterstraße 12, 2. OG links",
      encryptedData: encrypted.encryptedData,
      encryptionIv: encrypted.iv,
      encryptionTag: encrypted.tag,
      accessToken: crypto.randomBytes(32).toString("base64url"),
      editToken: crypto.randomBytes(32).toString("base64url"),
      isActive: true,
      email: "mueller@example.com",
    },
  });

  console.log("Demo-Datensatz erstellt.");
  console.log("Hinweis: Zum Anzeigen die Anwendung starten und /erstellen aufrufen.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
