import { dbService } from '$lib/services/db/firestore';
import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';

const ProjectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  timeline: z.string().min(1, 'Timeline range is required'),
  status: z.enum(['In Progress', 'Completed']),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubLink: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  if (!locals.isAdmin) {
    throw redirect(303, '/login');
  }

  try {
    // 1. Fetch consultations
    const consultations = await dbService.getPendingConsultations();

    // 2. Fetch portfolio projects & map field names to support legacy dashboard layout keys
    const projectsData = await dbService.getProjects();
    const projects = projectsData.map((p) => {
      return {
        id: p.id,
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        role: p.role,
        timeline: p.timeline,
        date: p.timeline, // legacy compat
        status: p.status,
        imageUrl: p.imageUrl,
        image: p.imageUrl, // legacy compat
        techStack: p.techStack,
        links: p.links,
        createdAt: p.createdAt
      };
    });

    const pendingCount = consultations.filter((c) => c.status === 'pending').length;

    return {
      consultations,
      projects,
      pendingCount
    };
  } catch (e) {
    console.error("Error in dashboard load:", e);
    return {
      consultations: [],
      projects: [],
      pendingCount: 0,
      error: "Failed to load dashboard data"
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  createProject: async ({ request, locals }) => {
    if (!locals.isAdmin) {
      return fail(403, { error: 'Unauthorized access' });
    }

    const data = await request.formData();
    const title = data.get('title')?.toString() || '';
    const tagline = data.get('tagline')?.toString() || '';
    const description = data.get('description')?.toString() || '';
    const role = data.get('role')?.toString() || '';
    const timeline = data.get('timeline')?.toString() || '';
    const status = data.get('status')?.toString() || 'In Progress';
    const imageUrl = data.get('imageUrl')?.toString() || '';
    const techStackRaw = data.get('techStack')?.toString() || '';
    const liveLink = data.get('liveLink')?.toString() || '';
    const githubLink = data.get('githubLink')?.toString() || '';

    // Validate using Zod
    const parseResult = ProjectFormSchema.safeParse({
      title,
      tagline,
      description,
      role,
      timeline,
      status,
      imageUrl,
      liveLink,
      githubLink
    });

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return fail(400, { error: `Validation failed: ${errorMsg}` });
    }

    const techStack = techStackRaw
      ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web'];

    const projectData = {
      title,
      tagline,
      description,
      role,
      timeline,
      status,
      imageUrl,
      techStack,
      links: {
        live: liveLink,
        github: githubLink
      }
    };

    try {
      await dbService.createProject(projectData);
      return { success: true, message: 'Project created successfully' };
    } catch (e) {
      console.error('Error creating project:', e);
      return fail(500, { error: 'Failed to create project' });
    }
  },

  updateProject: async ({ request, locals }) => {
    if (!locals.isAdmin) {
      return fail(403, { error: 'Unauthorized access' });
    }

    const data = await request.formData();
    const id = data.get('id')?.toString() || '';
    if (!id) {
      return fail(400, { error: 'Project ID is required' });
    }

    const title = data.get('title')?.toString() || '';
    const tagline = data.get('tagline')?.toString() || '';
    const description = data.get('description')?.toString() || '';
    const role = data.get('role')?.toString() || '';
    const timeline = data.get('timeline')?.toString() || '';
    const status = data.get('status')?.toString() || 'In Progress';
    const imageUrl = data.get('imageUrl')?.toString() || '';
    const techStackRaw = data.get('techStack')?.toString() || '';
    const liveLink = data.get('liveLink')?.toString() || '';
    const githubLink = data.get('githubLink')?.toString() || '';

    // Validate using Zod
    const parseResult = ProjectFormSchema.safeParse({
      title,
      tagline,
      description,
      role,
      timeline,
      status,
      imageUrl,
      liveLink,
      githubLink
    });

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return fail(400, { error: `Validation failed: ${errorMsg}` });
    }

    const techStack = techStackRaw
      ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web'];

    const projectData = {
      title,
      tagline,
      description,
      role,
      timeline,
      status,
      imageUrl,
      techStack,
      links: {
        live: liveLink,
        github: githubLink
      }
    };

    try {
      await dbService.updateProject(id, projectData);
      return { success: true, message: 'Project updated successfully' };
    } catch (e) {
      console.error('Error updating project:', e);
      return fail(500, { error: 'Failed to update project' });
    }
  },

  deleteProject: async ({ request, locals }) => {
    if (!locals.isAdmin) {
      return fail(403, { error: 'Unauthorized access' });
    }

    const data = await request.formData();
    const id = data.get('id')?.toString() || '';
    if (!id) {
      return fail(400, { error: 'Project ID is required' });
    }

    try {
      await dbService.deleteProject(id);
      return { success: true, message: 'Project deleted successfully' };
    } catch (e) {
      console.error('Error deleting project:', e);
      return fail(500, { error: 'Failed to delete project' });
    }
  }
};
