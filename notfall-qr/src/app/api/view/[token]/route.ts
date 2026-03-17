import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt, hashIp } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, truncateUserAgent } from "@/lib/utils";
import type { EncryptedFields } from "@/lib/validation";

// GET: Notfallinformationen abrufen (öffentlich via QR-Code)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const ip = getClientIp(request);
    const ipHashed = hashIp(ip);

    // Rate Limiting
    const rateCheck = checkRateLimit(ipHashed);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const record = await prisma.emergencyRecord.findUnique({
      where: { accessToken: token },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden oder ungültiger Link" },
        { status: 404 }
      );
    }

    if (!record.isActive) {
      return NextResponse.json(
        {
          error: "Dieser Notfalldatensatz wurde deaktiviert",
          title: record.title,
          isActive: false,
        },
        { status: 410 }
      );
    }

    // Zugriff loggen
    await prisma.accessLog.create({
      data: {
        recordId: record.id,
        action: "view",
        ipHash: ipHashed,
        userAgent: truncateUserAgent(request.headers.get("user-agent")),
      },
    });

    // Wenn PIN-geschützt: nur Titel und PIN-Hinweis zurückgeben
    if (record.pinHash) {
      return NextResponse.json({
        title: record.title,
        requiresPin: true,
        isActive: true,
      });
    }

    // Ohne PIN: alle Daten entschlüsseln und zurückgeben
    const decryptedData: EncryptedFields = JSON.parse(
      decrypt({
        encryptedData: record.encryptedData,
        iv: record.encryptionIv,
        tag: record.encryptionTag,
      })
    );

    return NextResponse.json({
      title: record.title,
      requiresPin: false,
      isActive: true,
      ...decryptedData,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
