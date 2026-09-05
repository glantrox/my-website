import { json } from '@sveltejs/kit';
import { dbService } from '$lib/services/db/firestore';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
  if (!locals.isAdmin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const consultations = await dbService.getPendingConsultations();

    const notifications = consultations.slice(0, 20).map((c) => ({
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

    return json({
      notifications,
      total: notifications.length
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
