import { error, redirect, fail } from '@sveltejs/kit';
import { app } from '$lib';
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { adminUpdateSchema } from './schema.js';
import nodemailer from 'nodemailer';

const db = getFirestore(app);

// Helper function to send HTML emails using nodemailer
/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendHtmlEmail(to, subject, html) {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'smtp.gmail.com',
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user: process.env.SMTP_USER || '',
			pass: process.env.SMTP_PASS || ''
		}
	});

	if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
		console.log("=== MOCK EMAIL SENDING ===");
		console.log("To:", to);
		console.log("Subject:", subject);
		console.log("Mock Mode Active. Email details printed in terminal.");
		console.log("==========================");
		return;
	}

	await transporter.sendMail({
		from: `"HA Agency" <${process.env.SMTP_USER}>`,
		to,
		subject,
		html
	});
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	if (!locals.isAdmin) {
		throw error(403, 'Unauthorized');
	}

	const docRef = doc(db, 'pending_consultations', params.id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		throw error(404, 'Project not found');
	}

	const data = docSnap.data();
	const project = { id: docSnap.id, ...data };

	const form = /** @type {any} */ (
		await superValidate(
			data,
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

		// Debug payload
		try {
			const cloned = request.clone();
			const text = await cloned.text();
			console.log('updateLead Raw Request Payload:', text);
		} catch (e) {
			console.log('Error reading request payload:', e);
		}

		const form = /** @type {any} */ (
			await superValidate(request, zod(/** @type {any} */ (adminUpdateSchema)))
		);

		if (!form.valid) {
			console.log('SUPERFORM VALIDATION ERRORS:', form.errors);
			return { form };
		}

		const updateData = {
			...form.data,
			updatedAt: new Date().toISOString()
		};

		// Strip undefined values to prevent FirebaseError
		for (const key in updateData) {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		}

		const docRef = doc(db, 'pending_consultations', params.id);
		await updateDoc(docRef, updateData);

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

		const docRef = doc(db, 'pending_consultations', params.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return fail(404, { error: 'Project tidak ditemukan.' });
		}

		const project = docSnap.data();

		// Create meeting record in meetings collection
		const meetingRef = await addDoc(collection(db, 'meetings'), {
			consultationId: params.id,
			clientName: project.contactName || '',
			clientEmail: project.contactEmail || '',
			projectTitle: project.projectTitle || '',
			meetLink: meetLink,
			meetDate: meetDate,
			meetTime: meetTime,
			createdAt: new Date().toISOString()
		});

		// Update status to consulted, save meeting details and meetingId
		await updateDoc(docRef, {
			status: 'consulted',
			consultationDate: meetDate + 'T' + meetTime,
			googleMeetLink: meetLink,
			meetingId: meetingRef.id,
			updatedAt: new Date().toISOString()
		});

		/** @type {Record<string, string>} */
		const readableLabels = {
			web_service: "Website Development",
			mobile_service: "Mobile App Development",
			basic: "Basic MVP",
			intermediate: "Intermediate Custom Website",
			industrial: "Industrial / Enterprise",
			under_1_month: "Under 1 Month",
			"1_to_3_months": "1 – 3 Months",
			"3_to_6_months": "3 - 6 Months Goal",
			flexible: "Flexible"
		};

		const clientName = project.contactName || 'Client';
		const clientEmail = project.contactEmail || '';
		const serviceTypeStr = readableLabels[project.serviceType] || project.serviceType || 'Website Development';
		const projectTitleStr = `${project.projectTitle || 'Project'} (${serviceTypeStr})`;
		
		const formattedDate = new Date(meetDate).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const servicePackage = readableLabels[project.projectTier] || project.projectTier || 'Basic MVP';
		const durationWindow = readableLabels[project.targetTimeline] || project.targetTimeline || 'Flexible';

		// Dynamic HTML Email Invitation Template
		const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Consultation Session is Confirmed</title>
  <style type="text/css">
    #outlook a { padding:0; }
    body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; background-color: #09090b; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { outline:none; text-decoration:none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .column-gap { height: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #09090b;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #09090b; border: 1px solid #18181b; border-radius: 16px; text-align: left;">
          <tr>
            <td style="padding: 40px; border-bottom: 1px solid #18181b;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><span style="background-color: #18181b; border: 1px solid #27272a; color: #ffffff; font-weight: 600; font-size: 14px; padding: 8px 12px; border-radius: 6px;">HA</span></td>
                  <td align="right" style="font-size: 11px; text-transform: uppercase; color: #71717a;">Consultation Confirmed</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Let's build something<br />exceptional together.</h1>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Hi ${clientName}, your project consultation session has been successfully locked in.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Proposed Project</span>
                    <span style="font-size: 15px; font-weight: 600; color: #ffffff; display: block; margin-top: 4px;">${projectTitleStr}</span>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                      <tr>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Consultation Date</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block;">${formattedDate}</span>
                        </td>
                        <td class="column-gap" width="4%"></td>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Service Package</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block;">${servicePackage}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 40px 32px 40px;">
              <a href="${meetLink}" target="_blank" style="display: block; background-color: #ffffff; color: #09090b; font-weight: 600; font-size: 14px; text-decoration: none; padding: 14px; border-radius: 8px; text-align: center;">Enter Google Meet Space</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

		try {
			if (clientEmail) {
				await sendHtmlEmail(clientEmail, "Your Consultation Session is Confirmed", emailHtml);
			}
			throw redirect(303, `/dashboard/${params.id}?success_email=true`);
		} catch (error) {
			const e = /** @type {any} */ (error);
			if (e && e.status === 303) throw e;
			console.error('Error scheduling meeting:', e);
			return fail(500, { error: 'Failed to schedule meeting.' });
		}
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

		const docRef = doc(db, 'pending_consultations', params.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return fail(404, { error: 'Project tidak ditemukan.' });
		}

		const project = docSnap.data();

		await updateDoc(docRef, {
			status: 'consulted',
			proposalUrl,
			quotedPrice,
			downPaymentRequirement,
			updatedAt: new Date().toISOString()
		});

		const clientName = project.contactName || 'Client';
		const clientEmail = project.contactEmail || '';
		const projectTitle = project.projectTitle || 'Project';

		const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif;">
			<h2>Project Proposal & Quotation Prepared</h2>
			<p>Hi ${clientName},</p>
			<p>We have finalized the proposal and quotation details for <strong>${projectTitle}</strong>.</p>
			<div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin: 20px 0;">
				<p style="margin: 4px 0;"><strong>Finalized Price:</strong> Rp ${quotedPrice.toLocaleString('id-ID')}</p>
				<p style="margin: 4px 0;"><strong>Down Payment Required:</strong> ${downPaymentRequirement}</p>
			</div>
			<p>You can review the full project proposal/scope specification by clicking below:</p>
			<a href="${proposalUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #09090b; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Project Proposal</a>
		</div>`;

		try {
			if (clientEmail) {
				await sendHtmlEmail(clientEmail, `Project Proposal & Down Payment Invoice: ${projectTitle}`, emailHtml);
			}
			throw redirect(303, `/dashboard/${params.id}?success_email=true`);
		} catch (error) {
			const e = /** @type {any} */ (error);
			if (e && e.status === 303) throw e;
			console.error('Error sending proposal:', e);
			return fail(500, { error: 'Failed to send proposal.' });
		}
	},

	pushProgressUpdate: async ({ request, params, locals }) => {
		if (!locals.isAdmin) {
			throw error(403, 'Unauthorized');
		}

		const data = await request.formData();
		const repoLink = data.get('repoLink')?.toString() || '';
		const stagingUrl = data.get('stagingUrl')?.toString() || '';
		const managementBoardUrl = data.get('managementBoardUrl')?.toString() || '';

		const docRef = doc(db, 'pending_consultations', params.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return fail(404, { error: 'Project tidak ditemukan.' });
		}

		const project = docSnap.data();

		await updateDoc(docRef, {
			status: 'in_progress',
			repoLink,
			stagingUrl,
			managementBoardUrl,
			updatedAt: new Date().toISOString()
		});

		const clientName = project.contactName || 'Client';
		const clientEmail = project.contactEmail || '';
		const projectTitle = project.projectTitle || 'Project';

		const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif;">
			<h2>Development Progress Update</h2>
			<p>Hi ${clientName},</p>
			<p>Development is actively underway for <strong>${projectTitle}</strong>!</p>
			<p>Here are your active engineering workspace links to track progress in real-time:</p>
			<ul>
				<li><strong>Staging Environment:</strong> <a href="${stagingUrl}" style="color: #60a5fa;">${stagingUrl}</a></li>
				<li><strong>Git Repository:</strong> <a href="${repoLink}" style="color: #60a5fa;">${repoLink}</a></li>
				<li><strong>Task Board:</strong> <a href="${managementBoardUrl}" style="color: #60a5fa;">${managementBoardUrl}</a></li>
			</ul>
		</div>`;

		try {
			if (clientEmail) {
				await sendHtmlEmail(clientEmail, `Active Development Workspace Linked: ${projectTitle}`, emailHtml);
			}
			throw redirect(303, `/dashboard/${params.id}?success_email=true`);
		} catch (error) {
			const e = /** @type {any} */ (error);
			if (e && e.status === 303) throw e;
			console.error('Error sending progress update:', e);
			return fail(500, { error: 'Failed to send progress update.' });
		}
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

		const docRef = doc(db, 'pending_consultations', params.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return fail(404, { error: 'Project tidak ditemukan.' });
		}

		const project = docSnap.data();

		await updateDoc(docRef, {
			status: 'review',
			feedbackTrackerUrl,
			milestoneFrontendComplete,
			milestoneDbSynced,
			milestonePaymentVerified,
			updatedAt: new Date().toISOString()
		});

		const clientName = project.contactName || 'Client';
		const clientEmail = project.contactEmail || '';
		const projectTitle = project.projectTitle || 'Project';

		const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif;">
			<h2>Staging Environment Sign-Off Request</h2>
			<p>Hi ${clientName},</p>
			<p>The core features for <strong>${projectTitle}</strong> are ready on our staging server for QA and review.</p>
			<p>Please test the staging environment and submit any feedback through the Loom or Notion tracker link:</p>
			<div style="margin: 20px 0;">
				<a href="${feedbackTrackerUrl}" style="background-color: #ffffff; color: #09090b; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Feedback Tracker</a>
			</div>
			<p>Once you are happy, please authorize the final sign-off.</p>
		</div>`;

		try {
			if (clientEmail) {
				await sendHtmlEmail(clientEmail, `Platform Ready for Review: ${projectTitle}`, emailHtml);
			}
			throw redirect(303, `/dashboard/${params.id}?success_email=true`);
		} catch (error) {
			const e = /** @type {any} */ (error);
			if (e && e.status === 303) throw e;
			console.error('Error sending sign-off request:', e);
			return fail(500, { error: 'Failed to send review sign-off request.' });
		}
	},

	sendHandover: async ({ request, params, locals }) => {
		if (!locals.isAdmin) {
			throw error(403, 'Unauthorized');
		}

		const data = await request.formData();
		const productionUrl = data.get('productionUrl')?.toString() || '';
		const codebaseTransferUrl = data.get('codebaseTransferUrl')?.toString() || '';

		const docRef = doc(db, 'pending_consultations', params.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return fail(404, { error: 'Project tidak ditemukan.' });
		}

		const project = docSnap.data();

		// Set warranty end date (3 months from now)
		const warrantyDate = new Date();
		warrantyDate.setMonth(warrantyDate.getMonth() + 3);

		await updateDoc(docRef, {
			status: 'completed',
			productionUrl,
			codebaseTransferUrl,
			warrantyEndDate: warrantyDate.toISOString().split('T')[0],
			updatedAt: new Date().toISOString()
		});

		const clientName = project.contactName || 'Client';
		const clientEmail = project.contactEmail || '';
		const projectTitle = project.projectTitle || 'Project';

		const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif;">
			<h2>Project Handover Package</h2>
			<p>Hi ${clientName},</p>
			<p>Congratulations! We have officially deployed <strong>${projectTitle}</strong> to production.</p>
			<p>Here are your final project access credentials and downloadable source files:</p>
			<ul>
				<li><strong>Live Application:</strong> <a href="${productionUrl}" style="color: #60a5fa;">${productionUrl}</a></li>
				<li><strong>ZIP Archive / Repository Transfer:</strong> <a href="${codebaseTransferUrl}" style="color: #60a5fa;">${codebaseTransferUrl}</a></li>
				<li><strong>Support / Warranty Window Ends:</strong> ${warrantyDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
			</ul>
		</div>`;

		try {
			if (clientEmail) {
				await sendHtmlEmail(clientEmail, `Final Handover Package Confirmed: ${projectTitle}`, emailHtml);
			}
			throw redirect(303, `/dashboard/${params.id}?success_email=true`);
		} catch (error) {
			const e = /** @type {any} */ (error);
			if (e && e.status === 303) throw e;
			console.error('Error sending handover package:', e);
			return fail(500, { error: 'Failed to send handover package.' });
		}
	},

	restoreLead: async ({ params, locals }) => {
		if (!locals.isAdmin) {
			throw error(403, 'Unauthorized');
		}

		const docRef = doc(db, 'pending_consultations', params.id);
		await updateDoc(docRef, {
			status: 'pending',
			meetingId: '',
			updatedAt: new Date().toISOString()
		});

		throw redirect(303, `/dashboard/${params.id}`);
	}
};
