import { error, fail } from '@sveltejs/kit';
import { dbService } from '$lib/services/db/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const project = await dbService.getConsultation(params.id);

	if (!project) {
		throw error(404, 'Project status page not found');
	}

	return { project };
}

/** @type {import('./$types').Actions} */
export const actions = {
	uploadProof: async ({ request, params }) => {
		const formData = await request.formData();
		const file = formData.get('proofFile');
		const senderBank = formData.get('senderBank')?.toString() || '';
		const senderName = formData.get('senderName')?.toString() || '';
		const notes = formData.get('notes')?.toString() || '';

		if (!file || !(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Silakan pilih file bukti transfer yang valid.' });
		}

		// Validate file size (< 8MB)
		if (file.size > 8 * 1024 * 1024) {
			return fail(400, { error: 'Ukuran file bukti transfer maksimal 8MB.' });
		}

		// Validate mime type
		const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
		if (!validTypes.includes(file.type)) {
			return fail(400, { error: 'Format file harus berupa gambar (JPG, PNG, WebP) atau PDF.' });
		}

		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const downloadUrl = await dbService.uploadPaymentProof(
				params.id,
				buffer,
				file.name,
				file.type
			);

			await dbService.updateConsultation(params.id, {
				paymentProofUrl: downloadUrl,
				paymentProofUploadedAt: new Date().toISOString(),
				paymentProofBank: senderBank,
				paymentProofSenderName: senderName,
				paymentProofNotes: notes
			});

			return { success: true };
		} catch (e) {
			console.error('Error uploading payment proof:', e);
			return fail(500, { error: 'Gagal mengunggah bukti transfer. Silakan coba lagi.' });
		}
	},

	deleteProof: async ({ params }) => {
		try {
			await dbService.updateConsultation(params.id, {
				paymentProofUrl: '',
				paymentProofUploadedAt: '',
				paymentProofBank: '',
				paymentProofSenderName: '',
				paymentProofNotes: ''
			});
			return { success: true };
		} catch (e) {
			console.error('Error deleting payment proof:', e);
			return fail(500, { error: 'Gagal menghapus bukti transfer.' });
		}
	}
};

