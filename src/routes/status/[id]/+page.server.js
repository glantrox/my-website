import { error } from '@sveltejs/kit';
import { dbService } from '$lib/services/db/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const project = await dbService.getConsultation(params.id);

	if (!project) {
		throw error(404, 'Project status page not found');
	}

	return { project };
}

