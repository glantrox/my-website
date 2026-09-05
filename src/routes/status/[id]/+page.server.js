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
		const paymentType = formData.get('paymentType')?.toString() || 'dp';

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

			if (paymentType === 'final') {
				await dbService.updateConsultation(params.id, {
					finalPaymentProofUrl: downloadUrl,
					finalPaymentProofUploadedAt: new Date().toISOString(),
					finalPaymentProofBank: senderBank,
					finalPaymentProofSenderName: senderName,
					finalPaymentProofNotes: notes
				});
			} else {
				await dbService.updateConsultation(params.id, {
					paymentProofUrl: downloadUrl,
					paymentProofUploadedAt: new Date().toISOString(),
					paymentProofBank: senderBank,
					paymentProofSenderName: senderName,
					paymentProofNotes: notes
				});
			}

			return { success: true };
		} catch (e) {
			console.error('Error uploading payment proof:', e);
			return fail(500, { error: 'Gagal mengunggah bukti transfer. Silakan coba lagi.' });
		}
	},

	deleteProof: async ({ request, params }) => {
		try {
			const formData = await request.formData().catch(() => null);
			const paymentType = formData?.get('paymentType')?.toString() || 'dp';

			if (paymentType === 'final') {
				await dbService.updateConsultation(params.id, {
					finalPaymentProofUrl: '',
					finalPaymentProofUploadedAt: '',
					finalPaymentProofBank: '',
					finalPaymentProofSenderName: '',
					finalPaymentProofNotes: ''
				});
			} else {
				await dbService.updateConsultation(params.id, {
					paymentProofUrl: '',
					paymentProofUploadedAt: '',
					paymentProofBank: '',
					paymentProofSenderName: '',
					paymentProofNotes: ''
				});
			}
			return { success: true };
		} catch (e) {
			console.error('Error deleting payment proof:', e);
			return fail(500, { error: 'Gagal menghapus bukti transfer.' });
		}
	},

	approveBrd: async ({ params }) => {
		try {
			await dbService.updateConsultation(params.id, {
				brdApprovedAt: new Date().toISOString()
			});
			return { success: true };
		} catch (e) {
			console.error('Error approving BRD:', e);
			return fail(500, { error: 'Gagal menyetujui dokumen spesifikasi BRD.' });
		}
	},

	approveUat: async ({ params }) => {
		try {
			await dbService.updateConsultation(params.id, {
				uatApprovedAt: new Date().toISOString()
			});
			return { success: true };
		} catch (e) {
			console.error('Error approving UAT:', e);
			return fail(500, { error: 'Gagal menyetujui hasil testing UAT.' });
		}
	},

	switchPaymentScheme: async ({ request, params }) => {
		const formData = await request.formData();
		const scheme = formData.get('scheme')?.toString();

		const validBaseSchemes = ['30% DP', '50% DP', 'Full 100%'];
		if (!scheme || !validBaseSchemes.includes(scheme)) {
			return fail(400, { error: 'Pilihan skema pembayaran tidak valid.' });
		}

		try {
			const project = await dbService.getConsultation(params.id);
			if (!project) {
				return fail(404, { error: 'Proyek tidak ditemukan.' });
			}

			// Security check: Only allowed if paymentStatus is unpaid
			if (project.paymentStatus && project.paymentStatus !== 'unpaid') {
				return fail(400, { error: 'Skema pembayaran tidak dapat diubah karena pembayaran telah diverifikasi.' });
			}

			let requirementLabel = scheme;
			if (project.quotedPrice) {
				const price = Number(project.quotedPrice);
				if (scheme === '30% DP') {
					requirementLabel = `30% DP (Rp ${Math.round(price * 0.3).toLocaleString('id-ID')})`;
				} else if (scheme === '50% DP') {
					requirementLabel = `50% DP (Rp ${Math.round(price * 0.5).toLocaleString('id-ID')})`;
				} else if (scheme === 'Full 100%') {
					requirementLabel = `Full 100% (Rp ${price.toLocaleString('id-ID')})`;
				}
			}

			await dbService.updateConsultation(params.id, {
				downPaymentRequirement: requirementLabel
			});

			return { success: true, message: `Skema pembayaran berhasil diubah ke ${scheme}` };
		} catch (e) {
			console.error('Error switching payment scheme:', e);
			return fail(500, { error: 'Gagal mengubah skema pembayaran.' });
		}
	}
};

