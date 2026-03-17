import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, generateAccessToken, generateEditToken, hashPin } from "@/lib/crypto";
import { emergencyRecordSchema, type EncryptedFields } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = emergencyRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingabe", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Sensible Felder verschlüsseln
    const sensitiveData: EncryptedFields = {
      accessInfo: data.accessInfo || "",
      gasShutoff: data.gasShutoff || "",
      electricPanel: data.electricPanel || "",
      waterShutoff: data.waterShutoff || "",
      additionalNotes: data.additionalNotes || "",
      contactPerson: data.contactPerson || "",
      pets: data.pets || "",
    };

    const encrypted = encrypt(JSON.stringify(sensitiveData));

    // Tokens generieren
    const accessToken = generateAccessToken();
    const editToken = generateEditToken();

    // Optional PIN hashen
    let pinHash: string | null = null;
    if (data.pin && data.pin.length >= 4) {
      pinHash = hashPin(data.pin);
    }

    const record = await prisma.emergencyRecord.create({
      data: {
        title: data.title,
        encryptedData: encrypted.encryptedData,
        encryptionIv: encrypted.iv,
        encryptionTag: encrypted.tag,
        accessToken,
        editToken,
        pinHash,
        email: data.email || null,
      },
    });

    return NextResponse.json({
      id: record.id,
      accessToken: record.accessToken,
      editToken: record.editToken,
      title: record.title,
      hasPIN: !!pinHash,
    }, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen des Datensatzes:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
