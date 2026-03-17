-- CreateTable
CREATE TABLE "EmergencyRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'direct',
    "pbkdfSalt" TEXT,
    "accessId" TEXT NOT NULL,
    "editToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publicHint" TEXT NOT NULL DEFAULT 'Notfallinformationen hinterlegt'
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    CONSTRAINT "AccessLog_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "EmergencyRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyRecord_accessId_key" ON "EmergencyRecord"("accessId");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyRecord_editToken_key" ON "EmergencyRecord"("editToken");

-- CreateIndex
CREATE INDEX "EmergencyRecord_accessId_idx" ON "EmergencyRecord"("accessId");

-- CreateIndex
CREATE INDEX "EmergencyRecord_editToken_idx" ON "EmergencyRecord"("editToken");

-- CreateIndex
CREATE INDEX "AccessLog_recordId_idx" ON "AccessLog"("recordId");

-- CreateIndex
CREATE INDEX "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");
