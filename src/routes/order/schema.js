import { z } from 'zod';

export const intakeSchema = z.object({
  contactName: z.string().min(2, "Nama kontak wajib diisi"),
  contactEmail: z.string().email("Format email tidak valid"),
  companyName: z.string().min(2, "Nama perusahaan/klien wajib diisi"),
  industry: z.string().min(2, "Silakan tentukan sektor industri Anda"),
  websiteUrl: z.string().url("Format URL tidak valid").optional().or(z.literal('')),

  // Technical Context
  projectTitle: z.string().min(3, "Berikan judul sementara untuk proyek Anda"),
  serviceType: z.enum(["web_service", "mobile_service"]),
  projectTier: z.enum(["basic", "intermediate", "industrial"]),
  coreObjective: z.string().min(20, "Tuliskan ringkasan tujuan utama minimal 20 karakter"),
  
  // Scope Checkboxes
  keyFeatures: z.array(z.string()).min(1, "Pilih minimal satu fitur yang dibutuhkan"),
  targetTimeline: z.enum(["under_1_month", "1_to_3_months", "3_to_6_months", "flexible"]),
  
  // Infrastructure Awareness acknowledgement
  infrastructureAck: z.boolean(),
  
  // Terms of Service acknowledgement
  termsAck: z.boolean()
});
