import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt, verifyPin, hashIp } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, truncateUserAgent } from "@/lib/utils";
import { pinVerifySchema, type EncryptedFields } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const ip = getClientIp(request);
    const ipHashed = hashIp(ip);

    // Strengeres Rate Limiting für PIN-Versuche
    const pinRateKey = `pin:${ipHashed}`;
    const rateCheck = checkRateLimit(pinRateKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Zu viele PIN-Versuche. Bitte warten Sie." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = pinVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige PIN" },
        { status: 400 }
      );
    }

    const record = await prisma.emergencyRecord.findUnique({
      where: { accessToken: token },
    });

    if (!record || !record.isActive || !record.pinHash) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden" },
        { status: 404 }
      );
    }

    // PIN-Versuch loggen
    await prisma.accessLog.create({
      data: {
        recordId: record.id,
        action: "pin_attempt",
        ipHash: ipHashed,
        userAgent: truncateUserAgent(request.headers.get("user-agent")),
      },
    });

    // PIN verifizieren
    const isValid = verifyPin(parsed.data.pin, record.pinHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Falsche PIN" },
        { status: 403 }
      );
    }

    // Erfolgreichen Zugriff loggen
    await prisma.accessLog.create({
      data: {
        recordId: record.id,
        action: "view_details",
        ipHash: ipHashed,
        userAgent: truncateUserAgent(request.headers.get("user-agent")),
      },
    });

    // Entschlüsselte Daten zurückgeben
    const decryptedData: EncryptedFields = JSON.parse(
      decrypt({
        encryptedData: record.encryptedData,
        iv: record.encryptionIv,
        tag: record.encryptionTag,
      })
    );

    return NextResponse.json({
      title: record.title,
      isActive: true,
      ...decryptedData,
    });
  } catch (error) {
    console.error("Fehler bei PIN-Verifizierung:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
