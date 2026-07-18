import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { projectSchema } from './schema.js';
import { dbService } from '$lib/services/db/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const form = /** @type {any} */(await superValidate(zod(/** @type {any} */(projectSchema))));
  return { 
    form,
    isAdmin: locals.isAdmin 
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    // Basic admin check
    if (!locals.isAdmin) {
      return fail(403, { error: 'Unauthorized access' });
    }

    const form = /** @type {any} */(await superValidate(request, zod(/** @type {any} */(projectSchema))));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Transform techStack string to array for storage
    const techStackArray = form.data.techStack
      ? form.data.techStack.split(',').map((/** @type {string} */ s) => s.trim()).filter(Boolean)
      : [];

    const projectData = {
      title: form.data.title,
      tagline: form.data.tagline,
      description: form.data.description || '',
      role: form.data.role || '',
      timeline: form.data.date || '', // Map form date to timeline
      status: form.data.status || 'In Progress',
      imageUrl: form.data.image || '', // Map form image to imageUrl
      techStack: techStackArray,
      links: {
        live: form.data.links?.live || '',
        github: form.data.links?.github || ''
      }
    };

    try {
      await dbService.createProject(projectData);
      return message(form, 'Project added successfully!');
    } catch (e) {
      console.error('Error adding document: ', e);
      return message(form, 'Failed to add project.', { status: 500 });
    }
  }
};

