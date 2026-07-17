import { app } from '$lib';
import { getFirestore, collection, getDocs, query, orderBy, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { redirect, fail } from '@sveltejs/kit';

const db = getFirestore(app);

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  if (!locals.isAdmin) {
    throw redirect(303, '/login');
  }

  try {
    // 1. Fetch consultations (leads)
    const consultationsQuery = query(collection(db, 'pending_consultations'), orderBy('createdAt', 'desc'));
    const consultationsSnapshot = await getDocs(consultationsQuery);
    const consultations = consultationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        projectTitle: data.projectTitle || '',
        companyName: data.companyName || '',
        contactName: data.contactName || '',
        contactEmail: data.contactEmail || '',
        industry: data.industry || '',
        websiteUrl: data.websiteUrl || '',
        serviceType: data.serviceType || '',
        projectTier: data.projectTier || '',
        status: data.status || 'pending',
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || null
      };
    });

    // 2. Fetch portfolio projects
    const projectsQuery = query(collection(db, 'selected-projects'), orderBy('createdAt', 'desc'));
    const projectsSnapshot = await getDocs(projectsQuery);
    const projects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title ?? '',
        tagline: data.tagline ?? '',
        description: data.description ?? '',
        role: data.role ?? '',
        timeline: data.date ?? '', // map date to timeline range
        status: data.status ?? 'In Progress',
        imageUrl: data.image ?? '', // map image to imageUrl
        techStack: data.techStack ?? [],
        links: data.links ?? { live: '', github: '' },
        createdAt: data.createdAt ?? null
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

    const techStack = techStackRaw
      ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web'];

    const projectData = {
      title,
      tagline,
      description,
      role,
      date: timeline, // map to database field
      status,
      image: imageUrl, // map to database field
      techStack,
      links: {
        live: liveLink,
        github: githubLink
      },
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'selected-projects'), projectData);
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

    const techStack = techStackRaw
      ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web'];

    const projectData = {
      title,
      tagline,
      description,
      role,
      date: timeline, // map to database field
      status,
      image: imageUrl, // map to database field
      techStack,
      links: {
        live: liveLink,
        github: githubLink
      },
      updatedAt: new Date().toISOString()
    };

    try {
      const docRef = doc(db, 'selected-projects', id);
      await updateDoc(docRef, projectData);
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
      const docRef = doc(db, 'selected-projects', id);
      await deleteDoc(docRef);
      return { success: true, message: 'Project deleted successfully' };
    } catch (e) {
      console.error('Error deleting project:', e);
      return fail(500, { error: 'Failed to delete project' });
    }
  }
};
