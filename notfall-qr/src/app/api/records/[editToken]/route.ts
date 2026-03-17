import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt, hashPin } from "@/lib/crypto";
import { emergencyRecordSchema, type EncryptedFields } from "@/lib/validation";

// GET: Datensatz zum Bearbeiten laden
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;

    const record = await prisma.emergencyRecord.findUnique({
      where: { editToken },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden" },
        { status: 404 }
      );
    }

    // Daten entschlüsseln
    const decryptedData: EncryptedFields = JSON.parse(
      decrypt({
        encryptedData: record.encryptedData,
        iv: record.encryptionIv,
        tag: record.encryptionTag,
      })
    );

    return NextResponse.json({
      id: record.id,
      title: record.title,
      accessToken: record.accessToken,
      editToken: record.editToken,
      isActive: record.isActive,
      hasPIN: !!record.pinHash,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      ...decryptedData,
    });
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// PUT: Datensatz aktualisieren
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;
    const body = await request.json();
    const parsed = emergencyRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingabe", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const record = await prisma.emergencyRecord.findUnique({
      where: { editToken },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden" },
        { status: 404 }
      );
    }

    const data = parsed.data;

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

    let pinHash = record.pinHash;
    if (data.pin && data.pin.length >= 4) {
      pinHash = hashPin(data.pin);
    } else if (data.pin === "") {
      pinHash = null;
    }

    const updated = await prisma.emergencyRecord.update({
      where: { editToken },
      data: {
        title: data.title,
        encryptedData: encrypted.encryptedData,
        encryptionIv: encrypted.iv,
        encryptionTag: encrypted.tag,
        pinHash,
        email: data.email || null,
      },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      accessToken: updated.accessToken,
      hasPIN: !!pinHash,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// DELETE: Datensatz löschen
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;

    const record = await prisma.emergencyRecord.findUnique({
      where: { editToken },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden" },
        { status: 404 }
      );
    }

    await prisma.emergencyRecord.delete({
      where: { editToken },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// PATCH: Aktivieren/Deaktivieren
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;
    const body = await request.json();

    const record = await prisma.emergencyRecord.findUnique({
      where: { editToken },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Datensatz nicht gefunden" },
        { status: 404 }
      );
    }

    if (typeof body.isActive === "boolean") {
      const updated = await prisma.emergencyRecord.update({
        where: { editToken },
        data: { isActive: body.isActive },
      });

      return NextResponse.json({
        id: updated.id,
        isActive: updated.isActive,
      });
    }

    return NextResponse.json(
      { error: "Ungültige Anfrage" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
