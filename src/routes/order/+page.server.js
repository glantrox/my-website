import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { intakeSchema } from './schema.js';
import { dbService } from '$lib/services/db/firestore';
import { emailService } from '$lib/services/email/nodemailer';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, cookies }) {
  const serviceType = url.searchParams.get('service_type') || cookies.get('serviceType') || 'web_service';
  const tier = url.searchParams.get('tier') || cookies.get('projectTier') || 'basic';

  const form = /** @type {any} */(await superValidate(zod(/** @type {any} */(intakeSchema))));
  
  // Prefill fields from cookies or fallback to query parameters / defaults
  form.data.contactName = cookies.get('contactName') || '';
  form.data.contactEmail = cookies.get('contactEmail') || '';
  form.data.contactPhone = cookies.get('contactPhone') || '';
  form.data.companyName = cookies.get('companyName') || '';
  form.data.industry = cookies.get('industry') || '';
  form.data.websiteUrl = cookies.get('websiteUrl') || '';
  form.data.projectTitle = cookies.get('projectTitle') || '';
  form.data.serviceType = serviceType === 'mobile_service' ? 'mobile_service' : 'web_service';
  form.data.projectTier = ['basic', 'intermediate', 'industrial'].includes(tier) ? tier : 'basic';
  form.data.coreObjective = cookies.get('coreObjective') || '';
  form.data.requestedDomain = cookies.get('requestedDomain') || '';
  form.data.domainSetupType = cookies.get('domainSetupType') || 'none';
  form.data.domainEstimatedPrice = cookies.get('domainEstimatedPrice') || '';
  form.data.alreadyConsulted = cookies.get('alreadyConsulted') === 'true';
  form.data.consultationChannel = cookies.get('consultationChannel') || '';
  form.data.consultationDate = cookies.get('consultationDate') || '';
  form.data.consultationTime = cookies.get('consultationTime') || '10:00 - 11:00 WIB';
  form.data.meetingNotes = cookies.get('meetingNotes') || '';
  
  const savedFeatures = cookies.get('keyFeatures');
  try {
    form.data.keyFeatures = savedFeatures ? JSON.parse(savedFeatures) : [];
  } catch (e) {
    form.data.keyFeatures = [];
  }
  
  return { form };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies, url }) => {
    const form = /** @type {any} */(await superValidate(request, zod(/** @type {any} */(intakeSchema))));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (form.data.infrastructureAck !== true || form.data.termsAck !== true) {
      const errors = { ...form.errors };
      if (form.data.infrastructureAck !== true) {
        errors.infrastructureAck = ['Anda wajib menyetujui tanggung jawab biaya infrastruktur pihak ketiga.'];
      }
      if (form.data.termsAck !== true) {
        errors.termsAck = ['Anda wajib menyetujui Syarat dan Ketentuan Layanan.'];
      }
      const formWithErrors = {
        ...form,
        errors
      };
      return fail(400, { form: formWithErrors });
    }

    let consultationId = '';
    try {
      const cleanedData = { ...form.data };
      for (const [key, value] of Object.entries(cleanedData)) {
        if (value === undefined) {
          delete cleanedData[key];
        }
      }

      consultationId = await dbService.createConsultation({
        ...cleanedData,
        status: form.data.alreadyConsulted ? 'consulted' : 'pending'
      });
    } catch (e) {
      console.error('Error saving consultation request:', e);
      const err = /** @type {any} */ (e);
      return fail(500, { form, error: `Gagal menyimpan ke database: ${err?.message || err}` });
    }

    // Send project submission confirmation email with tracking ID & URL
    if (form.data.contactEmail && consultationId) {
      try {
        const trackingUrl = `${url.origin}/status/${consultationId}`;
        await emailService.sendOrderSubmissionEmail(
          form.data.contactEmail,
          form.data.contactName,
          form.data.projectTitle || 'Project Specification',
          form.data.serviceType,
          form.data.projectTier,
          form.data.consultationDate || '',
          form.data.consultationTime || '',
          consultationId,
          trackingUrl,
          form.data.alreadyConsulted
        );
      } catch (emailErr) {
        console.error('Failed to send order confirmation email:', emailErr);
      }
    }

    // Clear draft cookies on successful submission
    const draftCookies = [
      'contactName', 
      'contactEmail', 
      'contactPhone',
      'companyName', 
      'industry', 
      'websiteUrl', 
      'projectTitle', 
      'serviceType', 
      'projectTier', 
      'coreObjective', 
      'requestedDomain',
      'domainSetupType',
      'domainEstimatedPrice',
      'keyFeatures',
      'alreadyConsulted',
      'consultationChannel',
      'consultationDate',
      'consultationTime',
      'meetingNotes'
    ];
    draftCookies.forEach(name => cookies.delete(name, { path: '/' }));

    // Redirect to success page with Project ID
    const formData = /** @type {any} */(form.data);
    throw redirect(303, `/order/success?id=${encodeURIComponent(consultationId)}&name=${encodeURIComponent(formData.contactName)}&email=${encodeURIComponent(formData.contactEmail)}&phone=${encodeURIComponent(formData.contactPhone || '')}&title=${encodeURIComponent(formData.projectTitle || '')}&tier=${encodeURIComponent(formData.projectTier)}&service_type=${encodeURIComponent(formData.serviceType)}&date=${encodeURIComponent(formData.consultationDate || '')}&time=${encodeURIComponent(formData.consultationTime || '')}&already_consulted=${encodeURIComponent(formData.alreadyConsulted ? 'true' : 'false')}&domain=${encodeURIComponent(formData.requestedDomain || '')}&domain_type=${encodeURIComponent(formData.domainSetupType || '')}&domain_price=${encodeURIComponent(formData.domainEstimatedPrice || '')}`);
  }
};

