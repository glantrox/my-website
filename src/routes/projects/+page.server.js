import { app } from '$lib';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const db = getFirestore(app);
  const projectsCollection = collection(db, 'selected-projects');
  
  // Order by creation date descending
  const q = query(projectsCollection, orderBy('createdAt', 'desc'));
  
  try {
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title ?? '',
        tagline: data.tagline ?? '',
        date: data.date ?? '',
        role: data.role ?? '',
        status: data.status ?? '',
        image: data.image ?? '',
        description: data.description ?? '',
        colSpan: Number(data.colSpan ?? 1),
        techStack: Array.isArray(data.techStack)
          ? data.techStack.filter((item) => typeof item === 'string')
          : [],
        links: {
          live: data.links?.live ?? '#',
          github: data.links?.github ?? '#'
        }
      };
    });

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
