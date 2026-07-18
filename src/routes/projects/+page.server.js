import { dbService } from '$lib/services/db/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  try {
    const projectsData = await dbService.getProjects();
    const projects = projectsData.map(p => ({
      ...p,
      image: p.imageUrl, // Map imageUrl to image for client layout compat
      date: p.timeline, // Map timeline to date for client layout compat
      colSpan: 1 // default value
    }));

    return {
      projects,
      isAdmin: Boolean(locals.isAdmin)
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      projects: [],
      isAdmin: Boolean(locals.isAdmin),
      error: "Failed to load projects"
    };
  }
}

