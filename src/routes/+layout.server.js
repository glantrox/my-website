import { app } from '$lib';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
  // Check if any draft details exist in cookies
  const hasDraft = !!(
    cookies.get('contactName') ||
    cookies.get('contactEmail') ||
    cookies.get('companyName') ||
    cookies.get('projectTitle')
  );

  // Count pending consultations for admin sidebar badge
  let pendingCount = 0;
  if (locals.isAdmin) {
    try {
      const db = getFirestore(app);
      const q = query(collection(db, 'pending_consultations'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      pendingCount = snapshot.size;
    } catch (e) {
      // Silently fail — badge just won't show count
    }
  }

  return {
    isAdmin: locals.isAdmin,
    hasDraft,
    pendingCount
  };
}