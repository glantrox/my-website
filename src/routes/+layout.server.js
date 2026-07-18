import { dbService } from '$lib/services/db/firestore';

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
      pendingCount = await dbService.getPendingConsultationsCount();
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