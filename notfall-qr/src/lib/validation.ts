import { z } from "zod";

export const emergencyRecordSchema = z.object({
  title: z
    .string()
    .min(2, "Titel muss mindestens 2 Zeichen lang sein")
    .max(100, "Titel darf maximal 100 Zeichen lang sein"),
  accessInfo: z
    .string()
    .max(500, "Zugangshinweis darf maximal 500 Zeichen lang sein")
    .optional()
    .default(""),
  gasShutoff: z
    .string()
    .max(300, "Maximal 300 Zeichen")
    .optional()
    .default(""),
  electricPanel: z
    .string()
    .max(300, "Maximal 300 Zeichen")
    .optional()
    .default(""),
  waterShutoff: z
    .string()
    .max(300, "Maximal 300 Zeichen")
    .optional()
    .default(""),
  additionalNotes: z
    .string()
    .max(1000, "Maximal 1000 Zeichen")
    .optional()
    .default(""),
  contactPerson: z
    .string()
    .max(200, "Maximal 200 Zeichen")
    .optional()
    .default(""),
  pets: z
    .string()
    .max(300, "Maximal 300 Zeichen")
    .optional()
    .default(""),
  pin: z
    .string()
    .regex(/^\d{4,6}$/, "PIN muss 4-6 Ziffern enthalten")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Ungültige E-Mail-Adresse")
    .optional()
    .or(z.literal("")),
});

export type EmergencyRecordInput = z.infer<typeof emergencyRecordSchema>;

export const pinVerifySchema = z.object({
  pin: z.string().min(4).max(6),
});

/** Felder, die verschlüsselt gespeichert werden */
export interface EncryptedFields {
  accessInfo: string;
  gasShutoff: string;
  electricPanel: string;
  waterShutoff: string;
  additionalNotes: string;
  contactPerson: string;
  pets: string;
}
