import { error } from '@sveltejs/kit';
import { app } from '$lib';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const docRef = doc(db, 'pending_consultations', params.id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		throw error(404, 'Project status page not found');
	}

	const data = docSnap.data();
	const project = { id: docSnap.id, ...data };

	return { project };
}
