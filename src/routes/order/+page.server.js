import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { intakeSchema } from './schema.js';
import { app } from '$lib';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, cookies }) {
  const serviceType = url.searchParams.get('service_type') || cookies.get('serviceType') || 'web_service';
  const tier = url.searchParams.get('tier') || cookies.get('projectTier') || 'basic';

  const form = /** @type {any} */(await superValidate(zod(/** @type {any} */(intakeSchema))));
  
  // Prefill fields from cookies or fallback to query parameters / defaults
  form.data.contactName = cookies.get('contactName') || '';
  form.data.contactEmail = cookies.get('contactEmail') || '';
  form.data.companyName = cookies.get('companyName') || '';
  form.data.industry = cookies.get('industry') || '';
  form.data.websiteUrl = cookies.get('websiteUrl') || '';
  form.data.projectTitle = cookies.get('projectTitle') || '';
  form.data.serviceType = serviceType === 'mobile_service' ? 'mobile_service' : 'web_service';
  form.data.projectTier = ['basic', 'intermediate', 'industrial'].includes(tier) ? tier : 'basic';
  form.data.coreObjective = cookies.get('coreObjective') || '';
  
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
  default: async ({ request, cookies }) => {
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

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'pending_consultations'), {
        ...form.data,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
    } catch (e) {
      console.error('Error saving consultation request:', e);
      return fail(500, { form, error: 'Database write failed' });
    }

    // Clear draft cookies on successful submission
    const draftCookies = [
      'contactName', 
      'contactEmail', 
      'companyName', 
      'industry', 
      'websiteUrl', 
      'projectTitle', 
      'serviceType', 
      'projectTier', 
      'coreObjective', 
      'keyFeatures'
    ];
    draftCookies.forEach(name => cookies.delete(name, { path: '/' }));

    // Redirect to success page
    const formData = /** @type {any} */(form.data);
    throw redirect(303, `/order/success?name=${encodeURIComponent(formData.contactName)}&email=${encodeURIComponent(formData.contactEmail)}&tier=${encodeURIComponent(formData.projectTier)}&service_type=${encodeURIComponent(formData.serviceType)}`);
  }
};
