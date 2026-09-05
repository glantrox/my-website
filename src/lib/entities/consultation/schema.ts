import { z } from 'zod';

export const intakeSchema = z.object({
  contactName: z.string().min(2, "Nama kontak wajib diisi"),
  contactEmail: z.string().email("Format email tidak valid"),
  contactPhone: z.string().min(8, "Nomor WhatsApp wajib diisi minimal 8 digit").regex(/^[+0-9\s-]{8,20}$/, "Format nomor WhatsApp tidak valid"),
  companyName: z.string().min(2, "Nama perusahaan/klien wajib diisi"),
  industry: z.string().min(2, "Silakan tentukan sektor industri Anda"),
  websiteUrl: z.string().url("Format URL tidak valid").optional().or(z.literal('')),

  // Technical Context
  projectTitle: z.string().min(3, "Berikan judul sementara untuk proyek Anda"),
  serviceType: z.enum(["web_service", "mobile_service"]),
  projectTier: z.enum(["basic", "intermediate", "industrial"]),
  coreObjective: z.string().min(20, "Tuliskan ringkasan tujuan utama minimal 20 karakter"),
  
  // Domain Request (For Website Service)
  requestedDomain: z.string().optional().default(''),
  domainSetupType: z.enum(["new_domain", "existing_domain", "need_consultation", "none"]).optional().default("none"),
  domainEstimatedPrice: z.string().optional().default(''),
  
  // Scope Checkboxes
  keyFeatures: z.array(z.string()).min(1, "Pilih minimal satu fitur yang dibutuhkan"),
  targetTimeline: z.enum(["under_1_month", "1_to_3_months", "3_to_6_months", "flexible"]),
  
  // Infrastructure Awareness acknowledgement
  infrastructureAck: z.boolean(),
  
  // Terms of Service acknowledgement
  termsAck: z.boolean(),

  // Meeting Schedule & Consultation Option
  alreadyConsulted: z.boolean().optional().default(false),
  consultationChannel: z.string().optional().default(''),
  consultationDate: z.string().optional().default(''),
  consultationTime: z.string().optional().default(''),
  meetingNotes: z.string().optional().default('')
}).superRefine((data, ctx) => {
  if (!data.alreadyConsulted && (!data.consultationDate || data.consultationDate.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Pilih tanggal pertemuan konsultasi",
      path: ["consultationDate"]
    });
  }
});
