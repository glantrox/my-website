import { error, redirect, fail } from '@sveltejs/kit';
import { dbService } from '$lib/services/db/firestore';
import { emailService } from '$lib/services/email/nodemailer';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { adminUpdateSchema } from './schema.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  if (!locals.isAdmin) {
    throw error(403, 'Unauthorized');
  }

  const project = await dbService.getConsultation(params.id);

  if (!project) {
    throw error(404, 'Project not found');
  }

  const form = /** @type {any} */ (
    await superValidate(
      project,
      zod(/** @type {any} */ (adminUpdateSchema))
    )
  );

  return { project, form };
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateLead: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const form = /** @type {any} */ (
      await superValidate(request, zod(/** @type {any} */ (adminUpdateSchema)))
    );

    if (!form.valid) {
      return { form };
    }

    try {
      await dbService.updateConsultation(params.id, form.data);
    } catch (e) {
      console.error('Error updating consultation lead:', e);
      return fail(500, { form, error: 'Database update failed' });
    }

    throw redirect(303, `/dashboard/${params.id}`);
  },

  scheduleMeeting: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const meetLink = data.get('meetLink')?.toString() || '';
    const meetDate = data.get('meetDate')?.toString() || '';
    const meetTime = data.get('meetTime')?.toString() || '';

    if (!meetLink || !meetDate || !meetTime) {
      return fail(400, { error: 'Semua kolom meeting (Link, Tanggal, Jam) wajib diisi.' });
    }

    const project = await dbService.getConsultation(params.id);
    if (!project) {
      return fail(404, { error: 'Project tidak ditemukan.' });
    }

    try {
      // Create meeting record
      const meetingId = await dbService.createMeeting({
        consultationId: params.id,
        clientName: project.contactName || '',
        clientEmail: project.contactEmail || '',
        projectTitle: project.projectTitle || '',
        meetLink: meetLink,
        meetDate: meetDate,
        meetTime: meetTime,
        createdAt: new Date().toISOString()
      });

      // Update consultation status
      await dbService.updateConsultation(params.id, {
        status: 'consulted',
        consultationDate: meetDate + 'T' + meetTime,
        googleMeetLink: meetLink,
        meetingId: meetingId
      });

      // Send confirmation email
      if (project.contactEmail) {
        await emailService.sendMeetingConfirmation(
          project.contactEmail,
          project.contactName || 'Client',
          project.projectTitle || 'Project',
          project.serviceType,
          project.projectTier,
          project.targetTimeline,
          meetLink,
          meetDate,
          meetTime
        );
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      return fail(500, { error: 'Failed to schedule meeting.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_email=true`);
  },

  sendProposal: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const proposalUrl = data.get('proposalUrl')?.toString() || '';
    const quotedPriceVal = data.get('quotedPrice')?.toString() || '';
    const downPaymentRequirement = data.get('downPaymentRequirement')?.toString() || '';

    const quotedPrice = quotedPriceVal ? Number(quotedPriceVal) : 0;

    const project = await dbService.getConsultation(params.id);
    if (!project) {
      return fail(404, { error: 'Project tidak ditemukan.' });
    }

    try {
      await dbService.updateConsultation(params.id, {
        status: 'consulted',
        proposalUrl,
        quotedPrice,
        downPaymentRequirement
      });

      if (project.contactEmail) {
        await emailService.sendProposalEmail(
          project.contactEmail,
          project.contactName || 'Client',
          project.projectTitle || 'Project',
          quotedPrice,
          downPaymentRequirement,
          proposalUrl
        );
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      return fail(500, { error: 'Failed to send proposal.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_email=true`);
  },

  pushProgressUpdate: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const repoLink = data.get('repoLink')?.toString() || '';
    const stagingUrl = data.get('stagingUrl')?.toString() || '';
    const managementBoardUrl = data.get('managementBoardUrl')?.toString() || '';

    const project = await dbService.getConsultation(params.id);
    if (!project) {
      return fail(404, { error: 'Project tidak ditemukan.' });
    }

    try {
      await dbService.updateConsultation(params.id, {
        status: 'in_progress',
        repoLink,
        stagingUrl,
        managementBoardUrl
      });

      if (project.contactEmail) {
        await emailService.sendProgressUpdateEmail(
          project.contactEmail,
          project.contactName || 'Client',
          project.projectTitle || 'Project',
          repoLink,
          stagingUrl,
          managementBoardUrl
        );
      }
    } catch (error) {
      console.error('Error sending progress update:', error);
      return fail(500, { error: 'Failed to send progress update.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_email=true`);
  },

  requestSignOff: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const feedbackTrackerUrl = data.get('feedbackTrackerUrl')?.toString() || '';
    const milestoneFrontendComplete = data.get('milestoneFrontendComplete') === 'true';
    const milestoneDbSynced = data.get('milestoneDbSynced') === 'true';
    const milestonePaymentVerified = data.get('milestonePaymentVerified') === 'true';

    const project = await dbService.getConsultation(params.id);
    if (!project) {
      return fail(404, { error: 'Project tidak ditemukan.' });
    }

    try {
      await dbService.updateConsultation(params.id, {
        status: 'review',
        feedbackTrackerUrl,
        milestoneFrontendComplete,
        milestoneDbSynced,
        milestonePaymentVerified
      });

      if (project.contactEmail) {
        await emailService.sendSignOffRequestEmail(
          project.contactEmail,
          project.contactName || 'Client',
          project.projectTitle || 'Project',
          feedbackTrackerUrl
        );
      }
    } catch (error) {
      console.error('Error sending sign-off request:', error);
      return fail(500, { error: 'Failed to send review sign-off request.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_email=true`);
  },

  sendHandover: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const productionUrl = data.get('productionUrl')?.toString() || '';
    const codebaseTransferUrl = data.get('codebaseTransferUrl')?.toString() || '';

    const project = await dbService.getConsultation(params.id);
    if (!project) {
      return fail(404, { error: 'Project tidak ditemukan.' });
    }

    try {
      const warrantyDate = new Date();
      warrantyDate.setMonth(warrantyDate.getMonth() + 3);
      const warrantyEndDate = warrantyDate.toISOString().split('T')[0];

      await dbService.updateConsultation(params.id, {
        status: 'completed',
        productionUrl,
        codebaseTransferUrl,
        warrantyEndDate
      });

      if (project.contactEmail) {
        await emailService.sendHandoverPackageEmail(
          project.contactEmail,
          project.contactName || 'Client',
          project.projectTitle || 'Project',
          productionUrl,
          codebaseTransferUrl,
          warrantyEndDate
        );
      }
    } catch (error) {
      console.error('Error sending handover package:', error);
      return fail(500, { error: 'Failed to send handover package.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_email=true`);
  },

  restoreLead: async ({ params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    try {
      await dbService.updateConsultation(params.id, {
        status: 'pending',
        meetingId: '' // Clear meeting ID
      });
    } catch (e) {
      console.error('Error restoring consultation lead:', e);
      throw error(500, 'Database write failed');
    }

    throw redirect(303, `/dashboard/${params.id}`);
  },

  deleteProject: async ({ params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    try {
      await dbService.deleteConsultation(params.id);
    } catch (e) {
      console.error('Error deleting consultation lead:', e);
      throw error(500, 'Database delete failed');
    }

    throw redirect(303, '/dashboard');
  },

  verifyPayment: async ({ request, params, locals }) => {
    if (!locals.isAdmin) {
      throw error(403, 'Unauthorized');
    }

    const data = await request.formData();
    const paymentStatus = data.get('paymentStatus')?.toString() || 'dp_paid';

    try {
      await dbService.updateConsultation(params.id, {
        paymentStatus,
        milestonePaymentVerified: true
      });
    } catch (e) {
      console.error('Error verifying payment:', e);
      return fail(500, { error: 'Gagal memperbarui status pembayaran.' });
    }

    throw redirect(303, `/dashboard/${params.id}?success_payment=true`);
  }
};
