import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { projectSchema } from './schema.js';
import { app } from '$lib';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // Use the default zod adapter but force v3 compatibility if needed, or try zod(projectSchema)
  // The error says "If using Zod v4, import { zod4 }". Let's try importing zod as is first, maybe the issue is just the adapter usage.
  // Wait, I am already importing { zod }. The error says "import { zod4 } from ... instead of { zod }".
  const form = await superValidate(zod(projectSchema));
  return { 
    form,
    isAdmin: locals.isAdmin 
  };
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    // Basic admin check
    if (!locals.isAdmin) {
      return fail(403, { error: 'Unauthorized access' });
    }

    const form = await superValidate(request, zod(projectSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Transform techStack string to array for storage
    const techStackArray = form.data.techStack
      ? form.data.techStack.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const projectData = {
      ...form.data,
      techStack: techStackArray, 
      createdAt: new Date().toISOString()
    };

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'selected-projects'), projectData);
      return message(form, 'Project added successfully!');
    } catch (e) {
      console.error('Error adding document: ', e);
      return message(form, 'Failed to add project.', { status: 500 });
    }
  }
};
