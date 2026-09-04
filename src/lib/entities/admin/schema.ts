import { z } from 'zod';

export const adminUpdateSchema = z.object({
  status: z.enum(['pending', 'consulted', 'in_progress', 'review', 'completed', 'rejected', 'archived']),
  adminNotes: z.string().optional().default(''),
  quotedPrice: z.preprocess((val) => val === '' || val === undefined || val === null ? undefined : Number(val), z.number().min(0).optional()),
  consultationDate: z.string().optional().default(''),
  consultationTime: z.string().optional().default(''),
  googleMeetLink: z.string().optional().default(''),
  meetingId: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  estimatedDelivery: z.string().optional().default(''),
  actualDelivery: z.string().optional().default(''),
  paymentStatus: z.enum(['unpaid', 'dp_paid', 'partial', 'settled']).optional().default('unpaid'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
  
  // New action fields
  proposalUrl: z.string().optional().default(''),
  downPaymentRequirement: z.string().optional().default(''),
  repoLink: z.string().optional().default(''),
  stagingUrl: z.string().optional().default(''),
  managementBoardUrl: z.string().optional().default(''),
  feedbackTrackerUrl: z.string().optional().default(''),
  milestoneFrontendComplete: z.boolean().optional().default(false),
  milestoneDbSynced: z.boolean().optional().default(false),
  milestonePaymentVerified: z.boolean().optional().default(false),
  productionUrl: z.string().optional().default(''),
  codebaseTransferUrl: z.string().optional().default(''),
  archiveReason: z.string().optional().default(''),
  archiveDate: z.string().optional().default(''),
  paymentProofUrl: z.string().optional().default(''),
  paymentProofUploadedAt: z.string().optional().default(''),
  paymentProofNotes: z.string().optional().default(''),
  paymentProofBank: z.string().optional().default(''),
  paymentProofSenderName: z.string().optional().default('')
});
