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
        ...data,
        // Ensure default values for missing fields if any
        colSpan: data.colSpan || 1,
        // Handle potentially missing fields gracefully
        techStack: data.techStack || [],
        links: data.links || { live: '#', github: '#' },
        // Convert Firestore timestamp to serializable date if needed, 
        // though we stored it as ISO string or Date object in current implementation
        // If it's a Firestore Timestamp, we need to convert toMillis or similar.
        // In new/+page.server.js we stored: createdAt: new Date().toISOString() (actually I changed it to this in my last memory update)
        // Wait, let me check the last edit to new/+page.server.js
      };
    });

    return {
      projects,
      isAdmin: locals.isAdmin 
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      projects: [],
      isAdmin: locals.isAdmin,
      error: "Failed to load projects"
    };
  }
}
