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

  // Count pending consultations and fetch recent lead notifications for admin
  let pendingCount = 0;
  /** @type {any[]} */
  let notifications = [];
  if (locals.isAdmin) {
    try {
      const consultations = await dbService.getPendingConsultations();
      pendingCount = consultations.filter((c) => c.status === 'pending').length;
      notifications = consultations.slice(0, 20).map((c) => ({
        id: c.id,
        type: 'new_lead',
        title: `New Client Lead: ${c.contactName}`,
        contactName: c.contactName,
        companyName: c.companyName,
        projectTitle: c.projectTitle,
        serviceType: c.serviceType,
        projectTier: c.projectTier,
        status: c.status,
        createdAt: c.createdAt,
        phone: c.contactPhone,
        email: c.contactEmail,
        alreadyConsulted: c.alreadyConsulted,
        url: `/dashboard/${c.id}`
      }));
    } catch (e) {
      // Silently fail — badge just won't show count
    }
  }

  return {
    isAdmin: locals.isAdmin,
    hasDraft,
    pendingCount,
    notifications
  };
}