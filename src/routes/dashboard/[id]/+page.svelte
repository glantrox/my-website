<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import {
		ArrowLeft,
		User,
		Building2,
		Globe,
		Mail,
		Phone,
		Sparkles,
		FileText,
		Clock,
		Coins,
		AlertTriangle,
		CheckCircle2,
		Shield,
		Calendar,
		Briefcase,
		Rocket,
		Beaker,
		Gift,
		FolderArchive,
		ExternalLink,
		Github,
		Share2,
		CreditCard,
		Maximize2,
		X,
		FileCheck,
		Check,
		Lock
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import Modal from '$lib/components/Modal.svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const project = $derived(data.project);
	const isFinanceActive = $derived(Boolean(project.quotedPrice && project.quotedPrice > 0));

	import { toast } from '$lib/entities/toast';
	import Spinner from '$lib/components/ui/spinner.svelte';

	let isSavingLead = $state(false);
	let isScheduling = $state(false);
	let isSendingProposal = $state(false);
	let isPushingProgress = $state(false);
	let isRequestingSignoff = $state(false);
	let isSendingHandover = $state(false);
	let isRestoring = $state(false);
	let isDeleting = $state(false);
	let isVerifyingPayment = $state(false);
	let showProofLightbox = $state(false);
	let lightboxImage = $state('');

	function openLightbox(url: string) {
		lightboxImage = url;
		showProofLightbox = true;
	}

	const { form, enhance: superEnhance } = superForm(data.form, {
		onSubmit: () => {
			isSavingLead = true;
		},
		onResult: ({ result }) => {
			isSavingLead = false;
			if (result.type === 'redirect' || result.type === 'success') {
				toast.success('Lead detail berhasil diperbarui!');
			} else if (result.type === 'failure' || result.type === 'error') {
				toast.error('Gagal memperbarui lead detail.');
			}
		}
	});

	function handleScheduleEnhance() {
		isScheduling = true;
		const toastId = toast.loading('Menjadwalkan meeting...');
		return async ({ result, update }: any) => {
			isScheduling = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Meeting berhasil dijadwalkan!', duration: 3000 });
				isRescheduling = false;
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal menjadwalkan meeting.', duration: 4000 });
			}
		};
	}

	function handleProposalEnhance() {
		isSendingProposal = true;
		const toastId = toast.loading('Mengirim proposal...');
		return async ({ result, update }: any) => {
			isSendingProposal = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Proposal berhasil dikirim!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal mengirim proposal.', duration: 4000 });
			}
		};
	}

	function handleProgressEnhance() {
		isPushingProgress = true;
		const toastId = toast.loading('Menambahkan progress update...');
		return async ({ result, update }: any) => {
			isPushingProgress = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Progress update berhasil ditambahkan!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal menambahkan progress update.', duration: 4000 });
			}
		};
	}

	function handleSignoffEnhance() {
		isRequestingSignoff = true;
		const toastId = toast.loading('Mengirim permintaan sign-off...');
		return async ({ result, update }: any) => {
			isRequestingSignoff = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Permintaan sign-off berhasil dikirim!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal mengirim permintaan sign-off.', duration: 4000 });
			}
		};
	}

	function handleHandoverEnhance() {
		isSendingHandover = true;
		const toastId = toast.loading('Mengirim paket handover...');
		return async ({ result, update }: any) => {
			isSendingHandover = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Paket handover berhasil dikirim!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal mengirim paket handover.', duration: 4000 });
			}
		};
	}

	function handleRestoreEnhance() {
		isRestoring = true;
		const toastId = toast.loading('Memulihkan lead ke aktif...');
		return async ({ result, update }: any) => {
			isRestoring = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Lead berhasil dipulihkan!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal memulihkan lead.', duration: 4000 });
			}
		};
	}

	function handleDeleteEnhance() {
		isDeleting = true;
		showDeleteModal = false;
		const toastId = toast.loading('Menghapus lead secara permanen...');
		return async ({ result, update }: any) => {
			isDeleting = false;
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Lead berhasil dihapus!', duration: 3000 });
				await update();
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal menghapus lead.', duration: 4000 });
			}
		};
	}

	function handleVerifyPaymentEnhance() {
		isVerifyingPayment = true;
		const toastId = toast.loading('Memperbarui status pembayaran...');
		return async ({ result, update }: any) => {
			isVerifyingPayment = false;
			await update();
			if (result.type === 'redirect' || result.type === 'success') {
				toast.update(toastId, { type: 'success', message: 'Status pembayaran berhasil diverifikasi!', duration: 3000 });
			} else {
				toast.update(toastId, { type: 'error', message: 'Gagal memverifikasi pembayaran.', duration: 4000 });
			}
		};
	}

	// Delete Confirmation state
	let showDeleteModal = $state(false);
	let confirmProjectName = $state('');
	let confirmClientEmail = $state('');

	function openDeleteModal() {
		showDeleteModal = true;
		confirmProjectName = '';
		confirmClientEmail = '';
	}

	function closeDeleteModal() {
		showDeleteModal = false;
	}

	const isDeleteValid = $derived(
		confirmProjectName.trim() === project.projectTitle &&
		confirmClientEmail.trim().toLowerCase() === (project.contactEmail || '').toLowerCase()
	);

	// Reactive calculation of form change status
	const isFormChanged = $derived(
		$form.status !== data.form.data.status ||
		($form.adminNotes || '') !== (data.form.data.adminNotes || '') ||
		$form.quotedPrice !== data.form.data.quotedPrice ||
		($form.consultationDate || '') !== (data.form.data.consultationDate || '') ||
		($form.startDate || '') !== (data.form.data.startDate || '') ||
		($form.estimatedDelivery || '') !== (data.form.data.estimatedDelivery || '') ||
		($form.actualDelivery || '') !== (data.form.data.actualDelivery || '') ||
		($form.paymentStatus || 'unpaid') !== (data.form.data.paymentStatus || 'unpaid')
	);

	// Mapped Human Readable Labels
	const readableLabels: Record<string, string> = {
		web_service: "Website Service",
		mobile_service: "Mobile App Service",
		basic: "Basic MVP",
		intermediate: "Intermediate Custom",
		industrial: "Industrial / Enterprise",
		under_1_month: "Under 1 Month",
		"1_to_3_months": "1 – 3 Months",
		"3_to_6_months": "3 – 6 Months",
		flexible: "Flexible"
	};

	function formatStatus(status: string): string {
		const labels: Record<string, string> = {
			pending: 'Menunggu',
			consulted: 'Sudah Konsultasi',
			in_progress: 'Dalam Pengerjaan',
			review: 'Dalam Review',
			completed: 'Selesai',
			rejected: 'Ditolak',
			archived: 'Diarsipkan'
		};
		return labels[status] || status;
	}

	function statusColor(status: string): string {
		const colors: Record<string, string> = {
			pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
			consulted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
			in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
			review: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
			completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
			rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
			archived: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
		};
		return colors[status] || 'bg-zinc-100 text-zinc-800';
	}

	const isFullPaymentScheme = $derived(
		(project.downPaymentRequirement || '').toLowerCase().includes('full') ||
		(project.downPaymentRequirement || '').toLowerCase().includes('100%')
	);

	let meetDate = $state(
		data.project.consultationDate ? data.project.consultationDate.split('T')[0] : ''
	);
	let meetTime = $state(
		data.project.consultationDate && data.project.consultationDate.includes('T')
			? data.project.consultationDate.split('T')[1].substring(0, 5)
			: (data.project.consultationTime ? data.project.consultationTime.split(' ')[0] : '10:00')
	);
	let meetLink = $state(data.project.googleMeetLink || '');

	function handleMeetLinkBlur() {
		let val = meetLink.trim();
		if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
			const code = val.replace(/[^a-zA-Z0-9-]/g, '');
			if (code) {
				meetLink = `https://meet.google.com/${code}`;
			}
		}
	}

	let isRescheduling = $state(false);

	function formatMeetingDateTime(isoString: string | null | undefined): string {
		if (!isoString) return '—';
		try {
			const dateObj = new Date(isoString);
			return dateObj.toLocaleDateString('id-ID', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}) + ' pukul ' + dateObj.toLocaleTimeString('id-ID', {
				hour: '2-digit',
				minute: '2-digit'
			}) + ' WIB';
		} catch {
			return isoString;
		}
	}

	function getWarrantyExpiryDate() {
		const dateObj = new Date();
		dateObj.setMonth(dateObj.getMonth() + 3);
		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{project.projectTitle || 'Detail Proyek'} — Dashboard</title>
</svelte:head>

<form id="schedule-form" method="POST" action="?/scheduleMeeting" use:enhance={handleScheduleEnhance}></form>
<form id="proposal-form" method="POST" action="?/sendProposal" use:enhance={handleProposalEnhance}></form>
<form id="progress-form" method="POST" action="?/pushProgressUpdate" use:enhance={handleProgressEnhance}></form>
<form id="signoff-form" method="POST" action="?/requestSignOff" use:enhance={handleSignoffEnhance}></form>
<form id="handover-form" method="POST" action="?/sendHandover" use:enhance={handleHandoverEnhance}></form>
<form id="restore-form" method="POST" action="?/restoreLead" use:enhance={handleRestoreEnhance}></form>
<form id="delete-form" method="POST" action="?/deleteProject" use:enhance={handleDeleteEnhance}></form>
<form id="verify-payment-dp-form" method="POST" action="?/verifyPayment" use:enhance={handleVerifyPaymentEnhance}>
	<input type="hidden" name="paymentType" value="dp" />
	<input type="hidden" name="actionType" value="approve" />
	<input type="hidden" name="paymentStatus" value="dp_paid" />
</form>
<form id="reject-payment-dp-form" method="POST" action="?/verifyPayment" use:enhance={handleVerifyPaymentEnhance}>
	<input type="hidden" name="paymentType" value="dp" />
	<input type="hidden" name="actionType" value="reject" />
</form>
<form id="verify-payment-settled-form" method="POST" action="?/verifyPayment" use:enhance={handleVerifyPaymentEnhance}>
	<input type="hidden" name="paymentType" value="final" />
	<input type="hidden" name="actionType" value="approve" />
	<input type="hidden" name="paymentStatus" value="settled" />
</form>
<form id="reject-payment-settled-form" method="POST" action="?/verifyPayment" use:enhance={handleVerifyPaymentEnhance}>
	<input type="hidden" name="paymentType" value="final" />
	<input type="hidden" name="actionType" value="reject" />
</form>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Sleek Sticky Navigation Header -->
	<div class="sticky top-14 md:top-0 z-30 flex items-center justify-between py-4 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-colors">
		<a
			href="/dashboard"
			class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			Back to Dashboard
		</a>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => navigator.clipboard.writeText(`${$page.url.origin}/status/${$page.params.id}`)}
				class="border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs cursor-pointer"
			>
				<Share2 class="h-4 w-4" />
				Share Status
			</button>
			<button
				type="submit"
				form="update-lead-form"
				disabled={isSavingLead || !isFormChanged}
				class="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
			>
				{#if isSavingLead}
					<Spinner size={14} class="text-white dark:text-zinc-950" />
					Menyimpan...
				{:else}
					<CheckCircle2 class="h-4 w-4" />
					Simpan Perubahan
				{/if}
			</button>
		</div>
	</div>

	<!-- Success Banner -->
	{#if $page?.url?.searchParams?.get('success_email') === 'true'}
		<div class="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
			<CheckCircle2 class="h-5 w-5 shrink-0" />
			<span>Action executed successfully and automated client email dispatched.</span>
		</div>
	{/if}

	<!-- Main Form for updating lead settings -->
	<form method="POST" action="?/updateLead" use:superEnhance id="update-lead-form">
		<div class="flex flex-col gap-10 lg:flex-row">
			<!-- Left Column: Bento Box Cards Layout -->
			<div class="flex flex-col gap-8 lg:w-2/3">
				
				<!-- Bento Card 1: Client Information -->
				<div class="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 rounded-2xl space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
						<User class="w-4 h-4 text-zinc-400" />
						Informasi Klien
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Nama Kontak</span>
							<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{project.contactName || '—'}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Email Address</span>
							<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
								<Mail class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
								{project.contactEmail || '—'}
							</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">WhatsApp / HP</span>
							{#if project.contactPhone}
								<a
									href="https://wa.me/{project.contactPhone.replace(/[^0-9]/g, '').replace(/^0/, '62')}"
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
								>
									<Phone class="w-3.5 h-3.5 shrink-0" />
									{project.contactPhone}
								</a>
							{:else}
								<span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500">—</span>
							{/if}
						</div>
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Perusahaan</span>
							<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
								<Building2 class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
								{project.companyName || '—'}
							</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Sektor Industri</span>
							<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{project.industry || '—'}</span>
						</div>
						{#if project.websiteUrl}
							<div class="sm:col-span-2">
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Website URL</span>
								<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
									<Globe class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
									<a
										href={project.websiteUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
									>
										{project.websiteUrl}
									</a>
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Bento Card 2: Project Specifications -->
				<div class="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 rounded-2xl space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
							<Briefcase class="w-4 h-4 text-zinc-400" />
							Spesifikasi Proyek
						</h2>
						<div class="flex items-center gap-2 flex-wrap">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider {statusColor($form.status)}">
								{formatStatus($form.status)}
							</span>
							{#if project.alreadyConsulted}
								<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
									<CheckCircle2 size={12} />
									Sudah Konsultasi {project.consultationChannel ? `(${project.consultationChannel})` : ''}
								</span>
							{/if}
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Judul Proyek</span>
							<h1 class="text-lg font-bold text-zinc-900 dark:text-white leading-snug">{project.projectTitle || '—'}</h1>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div>
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Tipe Layanan</span>
								<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
									{readableLabels[project.serviceType] || project.serviceType || '—'}
								</span>
							</div>
							<div>
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Tier Proyek</span>
								<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
									{readableLabels[project.projectTier] || project.projectTier || '—'}
								</span>
							</div>
							<div>
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Target Timeline</span>
								<span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
									{readableLabels[project.targetTimeline] || project.targetTimeline || '—'}
								</span>
							</div>
						</div>

						{#if project.coreObjective}
							<div>
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Tujuan Utama</span>
								<p class="break-words whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
									{project.coreObjective}
								</p>
							</div>
						{/if}

						{#if project.serviceType === 'web_service' && (project.requestedDomain || project.domainSetupType)}
							<div class="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/[0.02] space-y-1.5">
								<div class="flex items-center justify-between">
									<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
										<Globe class="w-3.5 h-3.5" />
										Domain Website yang Diminta
									</span>
									{#if project.domainSetupType === 'new_domain'}
										<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
											Beli Baru
										</span>
									{:else if project.domainSetupType === 'existing_domain'}
										<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
											Milik Sendiri
										</span>
									{:else if project.domainSetupType === 'need_consultation'}
										<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
											Butuh Saran
										</span>
									{/if}
								</div>
								<div class="flex items-center justify-between flex-wrap gap-2 pt-0.5">
									<span class="text-sm font-bold font-mono text-zinc-900 dark:text-white">
										{project.requestedDomain || 'Belum ditentukan'}
									</span>
									{#if project.domainEstimatedPrice}
										<span class="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
											Est: {project.domainEstimatedPrice}
										</span>
									{/if}
								</div>
							</div>
						{/if}

						{#if project.meetingNotes}
							<div class="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/[0.02] space-y-1">
								<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
									Catatan Tambahan / Kesepakatan Konsultasi
								</span>
								<p class="break-words whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
									{project.meetingNotes}
								</p>
							</div>
						{/if}

						{#if project.keyFeatures && project.keyFeatures.length > 0}
							<div>
								<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Fitur Utama</span>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each project.keyFeatures as feature}
										<span class="rounded-md border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
											{feature}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- ==========================================
				    DYNAMIC ACTION CARDS (MORPHED BY STATUS)
				    ========================================== -->

				<!-- 1. STATUS: pending (Menunggu) -->
				{#if $form.status === 'pending'}
					{#if project.alreadyConsulted}
						<div class="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs space-y-1">
							<span class="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
								<CheckCircle2 size={13} />
								Sudah Konsultasi Sebelumnya
							</span>
							<p class="text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
								Klien memilih opsi telah berkonsultasi sebelum mengisi formulir{project.consultationChannel ? ` (via ${project.consultationChannel})` : ''}. Anda dapat langsung menyiapkan proposal penawaran atau menjadwalkan Google Meet di bawah jika diperlukan.
							</p>
						</div>
					{/if}
					{#if project.meetingId && !isRescheduling}
						<!-- Scheduled Consultation Session Details -->
						<Card.Root class="border border-emerald-500/25 bg-emerald-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
							<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10 flex flex-row items-center justify-between">
								<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
									<CheckCircle2 class="h-4 w-4 shrink-0" />
									Scheduled Session
								</Card.Title>
								<button
									type="button"
									onclick={() => (isRescheduling = true)}
									class="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
								>
									Reschedule
								</button>
							</Card.Header>
							<Card.Content class="px-0 pt-4 space-y-4 text-left">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Date & Time</span>
										<span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mt-0.5">
											{formatMeetingDateTime(project.consultationDate)}
										</span>
									</div>
									<div>
										<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Meeting ID Reference</span>
										<code class="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded block mt-0.5 font-mono select-all w-fit">
											{project.meetingId}
										</code>
									</div>
									<div class="sm:col-span-2">
										<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Google Meet Link</span>
										<a
											href={project.googleMeetLink}
											target="_blank"
											rel="noopener noreferrer"
											class="text-xs font-semibold text-blue-650 dark:text-blue-400 hover:underline block mt-0.5 break-all font-mono"
										>
											{project.googleMeetLink}
										</a>
									</div>
								</div>
								<a
									href={project.googleMeetLink}
									target="_blank"
									rel="noopener noreferrer"
									class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-center text-xs"
								>
									<Globe class="h-4 w-4" />
									Join Google Meet
								</a>
							</Card.Content>
						</Card.Root>
					{:else}
						<!-- Meeting Scheduler Form -->
						<Card.Root class="border border-emerald-500/25 bg-emerald-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
							<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10 flex flex-row items-center justify-between">
								<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
									<Calendar class="h-4.5 w-4.5" />
									Schedule Consultation
								</Card.Title>
								{#if isRescheduling}
									<button
										type="button"
										onclick={() => (isRescheduling = false)}
										class="text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
									>
										Cancel
									</button>
								{/if}
							</Card.Header>
							<Card.Content class="px-0 pt-4 space-y-5 text-left">
								<!-- Date & Time selection -->
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div class="space-y-2">
										<label for="meetDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
											Tanggal Meeting
										</label>
										<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
											<input
												id="meetDate"
												type="date"
												name="meetDate"
												form="schedule-form"
												bind:value={meetDate}
												required
												class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
											/>
										</div>
									</div>
									
									<div class="space-y-2">
										<label for="meetTime" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
											Jam Meeting (GMT+7)
										</label>
										<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
											<input
												id="meetTime"
												type="time"
												name="meetTime"
												form="schedule-form"
												bind:value={meetTime}
												required
												class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
											/>
										</div>
									</div>
								</div>

								<!-- Link selection -->
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<label for="meetLink" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
											Google Meet Link / Code
										</label>
										<a
											href="https://meet.new"
											target="_blank"
											rel="noopener noreferrer"
											class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-450 hover:underline cursor-pointer"
										>
											Create Meet (meet.new)
										</a>
									</div>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="meetLink"
											type="text"
											name="meetLink"
											form="schedule-form"
											bind:value={meetLink}
											onblur={handleMeetLinkBlur}
											placeholder="xxx-yyyy-zzz atau https://meet.google.com/xxx-yyyy-zzz"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>
								
								<Button
									type="submit"
									form="schedule-form"
									disabled={isScheduling}
									class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{#if isScheduling}
										<Spinner size={16} class="text-white" />
										Scheduling...
									{:else}
										<Mail class="h-4 w-4" />
										Schedule & Send Email
									{/if}
								</Button>
							</Card.Content>
						</Card.Root>
					{/if}

				<!-- 2. STATUS: consulted (Sudah Konsultasi) -->
				{:else if $form.status === 'consulted'}
					<Card.Root class="border border-blue-500/25 bg-blue-500/[0.01] dark:bg-blue-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-blue-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
								<Briefcase class="h-4.5 w-4.5" />
								Proposal & Quotation
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5 text-left">
							<div class="space-y-2">
								<label for="proposalUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
									Proposal / Scope URL
								</label>
								<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
									<input
										id="proposalUrl"
										type="url"
										name="proposalUrl"
										form="proposal-form"
										bind:value={$form.proposalUrl}
										placeholder="https://notion.so/..."
										required
										class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
									/>
								</div>
							</div>

							<div class="space-y-2">
								<label for="proposalBrdUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
									<span>Business Requirements Document (BRD) URL (Opsional)</span>
									{#if project.brdApprovedAt}
										<span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Telah Disetujui Klien</span>
									{/if}
								</label>
								<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
									<input
										id="proposalBrdUrl"
										type="url"
										name="brdUrl"
										form="proposal-form"
										bind:value={$form.brdUrl}
										placeholder="https://docs.google.com/... atau Notion BRD"
										class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
									/>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<label for="quotedPriceProposal" class="text-[10px] font-bold uppercase tracking-wider text-zinc-405 dark:text-zinc-500">
										Finalized Price (Rp)
									</label>
									<div class="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mr-2 select-none">Rp</span>
										<input
											id="quotedPriceProposal"
											type="number"
											min="0"
											name="quotedPrice"
											form="proposal-form"
											bind:value={$form.quotedPrice}
											placeholder="0"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
											DP Requirement
										</span>
									</div>
									<div class="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3.5 py-2.5 min-h-[46px]">
										<div class="flex items-center gap-2">
											<span class="text-sm font-semibold text-zinc-900 dark:text-white">
												Rp {Math.round(($form.quotedPrice || 0) * 0.3).toLocaleString('id-ID')}
											</span>
										</div>
										<span class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
											30% dari {($form.quotedPrice && $form.quotedPrice > 0) ? 'Rp ' + Number($form.quotedPrice).toLocaleString('id-ID') : 'Rp 0'}
										</span>
									</div>
									<input
										type="hidden"
										name="downPaymentRequirement"
										form="proposal-form"
										value="30% DP (Rp {Math.round(($form.quotedPrice || 0) * 0.3).toLocaleString('id-ID')})"
									/>
								</div>
							</div>

							<Button
								type="submit"
								form="proposal-form"
								disabled={isSendingProposal}
								class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isSendingProposal}
									<Spinner size={16} class="text-white" />
									Sending...
								{:else}
									<Briefcase class="h-4 w-4" />
									Send Proposal & DP Invoice
								{/if}
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 3. STATUS: in_progress (Dalam Pengerjaan) -->
				{:else if $form.status === 'in_progress'}
					<Card.Root class="border border-purple-500/25 bg-purple-500/[0.01] dark:bg-purple-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-purple-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
								<Rocket class="h-4.5 w-4.5" />
								Development Workspace
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5 text-left">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<label for="progressBrdUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
										<span>Milestone 2.1: BRD URL</span>
										{#if project.brdApprovedAt}
											<span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Signed Off</span>
										{/if}
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="progressBrdUrl"
											type="url"
											name="brdUrl"
											form="progress-form"
											bind:value={$form.brdUrl}
											placeholder="https://docs.google.com/..."
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label for="figmaUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Milestone 2.2: Figma Design URL
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="figmaUrl"
											type="url"
											name="figmaUrl"
											form="progress-form"
											bind:value={$form.figmaUrl}
											placeholder="https://figma.com/design/..."
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>
							</div>

							<div class="space-y-2">
								<label for="repoLink" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
									Milestone 2.3: Repository Git URL
								</label>
								<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
									<input
										id="repoLink"
										type="url"
										name="repoLink"
										form="progress-form"
										bind:value={$form.repoLink}
										placeholder="https://github.com/..."
										required
										class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
									/>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<label for="stagingUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Staging Server URL
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="stagingUrl"
											type="url"
											name="stagingUrl"
											form="progress-form"
											bind:value={$form.stagingUrl}
											placeholder="https://staging.mewmewwo.com"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label for="managementBoardUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Task Management Board
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="managementBoardUrl"
											type="url"
											name="managementBoardUrl"
											form="progress-form"
											bind:value={$form.managementBoardUrl}
											placeholder="https://linear.app/..."
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>
							</div>

							<Button
								type="submit"
								form="progress-form"
								disabled={isPushingProgress}
								class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isPushingProgress}
									<Spinner size={16} class="text-white" />
									Updating...
								{:else}
									<Rocket class="h-4 w-4" />
									Push Progress Update
								{/if}
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 4. STATUS: review (Dalam Review) -->
				{:else if $form.status === 'review'}
					<Card.Root class="border border-orange-500/25 bg-orange-500/[0.01] dark:bg-orange-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-orange-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
								<Beaker class="h-4.5 w-4.5" />
								QA & Client Review
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5 text-left">
							{#if $form.stagingUrl}
								<div>
									<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">Staging Environment</span>
									<a
										href={$form.stagingUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-orange-500/20 bg-orange-500/5 text-xs text-orange-605 dark:text-orange-400 font-semibold hover:bg-orange-500/10 transition-colors"
									>
										Open Staging Site
										<ExternalLink size={12} />
									</a>
								</div>
							{/if}

							{#if project.uatApprovedAt}
								<div class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
									<CheckCircle2 size={16} class="shrink-0" />
									<span>Klien telah menyetujui hasil testing (UAT Sign-off) pada: <strong>{formatMeetingDateTime(project.uatApprovedAt)}</strong></span>
								</div>
							{/if}

							<div class="space-y-2">
								<label for="feedbackTrackerUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
									Feedback Tracker / Loom URL
								</label>
								<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
									<input
										id="feedbackTrackerUrl"
										type="url"
										name="feedbackTrackerUrl"
										form="signoff-form"
										bind:value={$form.feedbackTrackerUrl}
										placeholder="https://loom.com/..."
										required
										class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
									/>
								</div>
							</div>

							<!-- Staging Demo Credentials Vault for Client -->
							<div class="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-3">
								<span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
									<Lock size={12} />
									Kredensial Testing Staging (Akan Muncul di Tracker Klien)
								</span>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div class="space-y-1">
										<label for="stagingRole" class="text-[9px] font-bold uppercase text-zinc-500">Role Akun</label>
										<input
											id="stagingRole"
											type="text"
											name="stagingCredentialsRole"
											form="signoff-form"
											bind:value={$form.stagingCredentialsRole}
											placeholder="Admin / QA Tester"
											class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
										/>
									</div>
									<div class="space-y-1">
										<label for="stagingEmail" class="text-[9px] font-bold uppercase text-zinc-500">Email Demo</label>
										<input
											id="stagingEmail"
											type="text"
											name="stagingCredentialsEmail"
											form="signoff-form"
											bind:value={$form.stagingCredentialsEmail}
											placeholder="demo@client.com"
											class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
										/>
									</div>
									<div class="space-y-1">
										<label for="stagingPassword" class="text-[9px] font-bold uppercase text-zinc-500">Password Demo</label>
										<input
											id="stagingPassword"
											type="text"
											name="stagingCredentialsPassword"
											form="signoff-form"
											bind:value={$form.stagingCredentialsPassword}
											placeholder="DemoPass123!"
											class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
										/>
									</div>
								</div>
							</div>

							<!-- Revision Round Counter -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-1">
									<label for="revRound" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Putaran Revisi Saat Ini
									</label>
									<input
										id="revRound"
										type="number"
										min="1"
										max="10"
										name="revisionRound"
										form="signoff-form"
										bind:value={$form.revisionRound}
										placeholder="1"
										class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none"
									/>
								</div>
								<div class="space-y-1">
									<label for="maxRevRound" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Batas Maksimal Revisi
									</label>
									<input
										id="maxRevRound"
										type="number"
										min="1"
										max="10"
										name="revisionMaxRounds"
										form="signoff-form"
										bind:value={$form.revisionMaxRounds}
										placeholder="3"
										class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none"
									/>
								</div>
							</div>

							<div class="space-y-2">
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Milestones Completed</span>
								<div class="space-y-1.5 text-xs">
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
										<input
											type="checkbox"
											name="milestoneFrontendComplete"
											form="signoff-form"
											value="true"
											bind:checked={$form.milestoneFrontendComplete}
											class="rounded border-zinc-300 dark:border-zinc-750 text-orange-600 focus:ring-orange-500 bg-transparent"
										/>
										Frontend Complete
									</label>
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
										<input
											type="checkbox"
											name="milestoneDbSynced"
											form="signoff-form"
											value="true"
											bind:checked={$form.milestoneDbSynced}
											class="rounded border-zinc-300 dark:border-zinc-755 text-orange-600 focus:ring-orange-500 bg-transparent"
										/>
										Database Synced
									</label>
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
										<input
											type="checkbox"
											name="milestonePaymentVerified"
											form="signoff-form"
											value="true"
											bind:checked={$form.milestonePaymentVerified}
											class="rounded border-zinc-300 dark:border-zinc-755 text-orange-600 focus:ring-orange-500 bg-transparent"
										/>
										Payment Gateway Verified
									</label>
								</div>
							</div>

							<Button
								type="submit"
								form="signoff-form"
								disabled={isRequestingSignoff}
								class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isRequestingSignoff}
									<Spinner size={16} class="text-white" />
									Requesting...
								{:else}
									<Beaker class="h-4 w-4" />
									Request Form Sign-Off
								{/if}
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 5. STATUS: completed (Selesai) -->
				{:else if $form.status === 'completed'}
					<Card.Root class="border border-emerald-500/25 bg-emerald-500/[0.01] dark:bg-emerald-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
								<Gift class="h-4.5 w-4.5" />
								Project Handover
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5 text-left">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="space-y-2">
									<label for="productionUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Production Live URL
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="productionUrl"
											type="url"
											name="productionUrl"
											form="handover-form"
											bind:value={$form.productionUrl}
											placeholder="https://mewmewwo.com"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label for="codebaseTransferUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
										Codebase ZIP / Repo Link
									</label>
									<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5">
										<input
											id="codebaseTransferUrl"
											type="url"
											name="codebaseTransferUrl"
											form="handover-form"
											bind:value={$form.codebaseTransferUrl}
											placeholder="https://github.com/transfers/..."
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
										/>
									</div>
								</div>
							</div>

							<div>
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Warranty Support Period</span>
								<span class="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">
									Free Support Ends: {project.warrantyEndDate || getWarrantyExpiryDate()}
								</span>
							</div>

							<Button
								type="submit"
								form="handover-form"
								disabled={isSendingHandover}
								class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isSendingHandover}
									<Spinner size={16} class="text-white" />
									Sending...
								{:else}
									<Gift class="h-4 w-4" />
									Send Handover Package
								{/if}
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 6. STATUS: rejected (Ditolak) & archived (Diarsipkan) -->
				{:else if $form.status === 'rejected' || $form.status === 'archived'}
					<Card.Root class="border border-zinc-500/25 bg-zinc-500/[0.01] dark:bg-zinc-500/[0.02] p-6 sm:p-8 shadow-xs rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-zinc-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
								<FolderArchive class="h-4.5 w-4.5" />
								Archived Lead
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5 text-left">
							<div class="space-y-2">
								<label for="archiveReason" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
									Reason for Rejection / Archive
								</label>
								<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3">
									<textarea
										id="archiveReason"
										name="archiveReason"
										bind:value={$form.archiveReason}
										placeholder="Budget mismatch, timeline issues..."
										class="w-full min-h-[80px] bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
									></textarea>
								</div>
							</div>

							<div>
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Archive State Log</span>
								<span class="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">
									Lead closed on: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}
								</span>
							</div>

							<Button
								type="submit"
								form="restore-form"
								disabled={isRestoring}
								class="w-full bg-zinc-800 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isRestoring}
									<Spinner size={16} class="text-white dark:text-zinc-950" />
									Restoring...
								{:else}
									<FolderArchive class="h-4 w-4" />
									Restore to Active Leads
								{/if}
							</Button>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- Bento Card 3: Administrasi & Keuangan -->
				<div class="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 rounded-2xl space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
							<Coins class="w-4.5 h-4.5 text-zinc-400" />
							Administrasi & Keuangan
						</h2>
						{#if !isFinanceActive}
							<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
								<Lock size={11} />
								Terkunci (Belum Ada Penawaran)
							</span>
						{:else}
							<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
								<CheckCircle2 size={11} />
								Penawaran Aktif
							</span>
						{/if}
					</div>

					{#if !isFinanceActive}
						<div class="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
							<AlertTriangle size={16} class="shrink-0 mt-0.5" />
							<p class="leading-relaxed">
								Harga penawaran belum pernah diisi. Kolom administrasi & status pembayaran saat ini dinonaktifkan dan akan terbuka otomatis setelah Anda menentukan harga dan mengirimkan penawaran melalui panel <strong>Proposal & Quotation</strong> di atas.
							</p>
						</div>
					{/if}

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<!-- Harga Penawaran -->
						<div class="space-y-2">
							<label for="quotedPrice" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
								<span>Harga Penawaran</span>
								{#if !isFinanceActive}
									<span class="text-[9px] text-zinc-400 normal-case font-normal">(Tidak dapat diedit)</span>
								{/if}
							</label>
							<div class="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 {!isFinanceActive ? 'bg-zinc-100/70 dark:bg-zinc-900/60 cursor-not-allowed opacity-60' : 'bg-zinc-50/20 dark:bg-zinc-950'} px-3.5 py-2.5 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-500">
								<span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mr-2 select-none">Rp</span>
								<input
									id="quotedPrice"
									type="number"
									min="0"
									disabled={!isFinanceActive}
									bind:value={$form.quotedPrice}
									name="quotedPrice"
									placeholder="0"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500 disabled:cursor-not-allowed"
								/>
							</div>
						</div>

						<!-- Status Pembayaran -->
						<div class="space-y-2">
							<label for="paymentStatus" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
								<span>Status Pembayaran</span>
								{#if !isFinanceActive}
									<span class="text-[9px] text-zinc-400 normal-case font-normal">(Tidak dapat diedit)</span>
								{/if}
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 {!isFinanceActive ? 'bg-zinc-100/70 dark:bg-zinc-900/60 cursor-not-allowed opacity-60' : 'bg-zinc-50/20 dark:bg-zinc-950'} px-3.5 py-2">
								<select
									id="paymentStatus"
									disabled={!isFinanceActive}
									bind:value={$form.paymentStatus}
									name="paymentStatus"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer py-1 disabled:cursor-not-allowed"
								>
									<option value="unpaid" class="bg-white dark:bg-zinc-900">Belum Bayar</option>
									<option value="dp_paid" class="bg-white dark:bg-zinc-900">DP Dibayar</option>
									<option value="partial" class="bg-white dark:bg-zinc-900">Sebagian</option>
									<option value="settled" class="bg-white dark:bg-zinc-900">Lunas</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Bukti Pembayaran Klien Section: DP & Pelunasan -->
					<div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-6">
						<div class="flex items-center justify-between">
							<span class="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
								<FileCheck class="w-4 h-4 text-zinc-400" />
								Verifikasi Pembayaran Klien
							</span>
						</div>

						<!-- 1. BUKTI TRANSFER DP (OR FULL) -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
									{isFullPaymentScheme ? 'Tahap 1: Pembayaran Penuh (100% di Awal)' : `Tahap 1: Pembayaran DP (${project.downPaymentRequirement || '30% DP'})`}
								</span>
								{#if project.paymentStatus === 'settled'}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
										{isFullPaymentScheme ? 'Lunas 100% (Terverifikasi)' : 'Lunas 100%'}
									</span>
								{:else if project.paymentStatus === 'dp_paid'}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
										DP Terverifikasi
									</span>
								{:else if project.paymentProofUrl}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
										Menunggu Verifikasi {isFullPaymentScheme ? 'Pembayaran Penuh' : 'DP'}
									</span>
								{:else}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
										Belum Ada Bukti {isFullPaymentScheme ? 'Pembayaran' : 'DP'}
									</span>
								{/if}
							</div>

							{#if project.paymentProofUrl}
								<div class="p-4 bg-zinc-50/50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
									<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<!-- Proof Thumbnail with Zoom -->
										<div class="relative group">
											{#if project.paymentProofUrl.startsWith('data:application/pdf') || project.paymentProofUrl.endsWith('.pdf')}
												<div class="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-500 shrink-0">
													<FileText size={28} />
													<span class="text-[9px] font-bold uppercase mt-1">PDF</span>
												</div>
											{:else}
												<button
													type="button"
													onclick={() => openLightbox(project.paymentProofUrl!)}
													class="w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative cursor-pointer bg-zinc-100 dark:bg-zinc-800 block"
													title="Klik untuk memperbesar bukti transfer"
												>
													<img
														src={project.paymentProofUrl}
														alt="Bukti Transfer DP Klien"
														class="w-full h-full object-cover group-hover:scale-105 transition-transform"
													/>
													<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
														<Maximize2 size={16} />
													</div>
												</button>
											{/if}
										</div>

										<!-- Metadata & Sender info -->
										<div class="space-y-1.5 flex-1 min-w-0 text-xs">
											<div class="flex items-center gap-2">
												<span class="font-bold text-zinc-900 dark:text-white">
													{project.paymentProofBank || 'Metode Pembayaran'}
												</span>
												{#if project.paymentProofSenderName}
													<span class="text-zinc-400">·</span>
													<span class="text-zinc-600 dark:text-zinc-300 font-medium">{project.paymentProofSenderName}</span>
												{/if}
											</div>

											<p class="text-[11px] text-zinc-500 dark:text-zinc-400">
												Diunggah pada: <span class="text-zinc-700 dark:text-zinc-300 font-medium">{formatMeetingDateTime(project.paymentProofUploadedAt)}</span>
											</p>

											{#if project.paymentProofNotes}
												<p class="text-[11px] text-zinc-600 dark:text-zinc-300 italic bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
													"{project.paymentProofNotes}"
												</p>
											{/if}

											{#if project.paymentProofUrl.startsWith('http')}
												<a
													href={project.paymentProofUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
												>
													<ExternalLink size={12} />
													Buka file di tab baru
												</a>
											{/if}
										</div>
									</div>

									<!-- Verification Buttons -->
									<div class="pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center gap-2.5">
										<button
											type="submit"
											form="verify-payment-dp-form"
											disabled={isVerifyingPayment || project.paymentStatus === 'dp_paid' || project.paymentStatus === 'settled'}
											class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<Check size={13} />
											{isFullPaymentScheme ? 'Setujui Pembayaran Penuh (100%)' : 'Setujui Pembayaran DP'}
										</button>

										<button
											type="submit"
											form="reject-payment-dp-form"
											disabled={isVerifyingPayment || project.paymentStatus === 'dp_paid' || project.paymentStatus === 'settled'}
											class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<X size={13} />
											Tolak Bukti {isFullPaymentScheme ? 'Pembayaran' : 'DP'}
										</button>
									</div>
								</div>
							{:else}
								<div class="p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
									<CreditCard size={14} class="shrink-0" />
									<span>Klien belum mengunggah bukti {isFullPaymentScheme ? 'pembayaran penuh 100%' : (project.downPaymentRequirement || 'transfer DP 30%')}.</span>
								</div>
							{/if}
						</div>

						<!-- 2. BUKTI TRANSFER PELUNASAN (SISA KONTRAK) -->
						<div class="space-y-3 pt-2">
							<div class="flex items-center justify-between">
								<span class="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
									Tahap 2: Pelunasan Akhir (Sisa Kontrak)
								</span>
								{#if isFullPaymentScheme}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
										Bebas Tagihan (Skema Full)
									</span>
								{:else if project.paymentStatus === 'settled'}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
										Lunas 100%
									</span>
								{:else if project.finalPaymentProofUrl}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
										Menunggu Verifikasi Pelunasan
									</span>
								{:else}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
										Belum Ada Bukti Pelunasan
									</span>
								{/if}
							</div>

							{#if isFullPaymentScheme}
								<div class="p-3.5 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
									<CheckCircle2 size={14} class="shrink-0 text-emerald-600 dark:text-emerald-400" />
									<span>Klien menggunakan skema <strong>Bayar Penuh 100% di Awal</strong>. Tidak ada tagihan pelunasan di tahap 2.</span>
								</div>
							{:else if project.finalPaymentProofUrl}
								<div class="p-4 bg-zinc-50/50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
									<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<!-- Proof Thumbnail with Zoom -->
										<div class="relative group">
											{#if project.finalPaymentProofUrl.startsWith('data:application/pdf') || project.finalPaymentProofUrl.endsWith('.pdf')}
												<div class="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-500 shrink-0">
													<FileText size={28} />
													<span class="text-[9px] font-bold uppercase mt-1">PDF</span>
												</div>
											{:else}
												<button
													type="button"
													onclick={() => openLightbox(project.finalPaymentProofUrl!)}
													class="w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative cursor-pointer bg-zinc-100 dark:bg-zinc-800 block"
													title="Klik untuk memperbesar bukti transfer"
												>
													<img
														src={project.finalPaymentProofUrl}
														alt="Bukti Transfer Pelunasan Klien"
														class="w-full h-full object-cover group-hover:scale-105 transition-transform"
													/>
													<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
														<Maximize2 size={16} />
													</div>
												</button>
											{/if}
										</div>

										<!-- Metadata & Sender info -->
										<div class="space-y-1.5 flex-1 min-w-0 text-xs">
											<div class="flex items-center gap-2">
												<span class="font-bold text-zinc-900 dark:text-white">
													{project.finalPaymentProofBank || 'Metode Pembayaran'}
												</span>
												{#if project.finalPaymentProofSenderName}
													<span class="text-zinc-400">·</span>
													<span class="text-zinc-600 dark:text-zinc-300 font-medium">{project.finalPaymentProofSenderName}</span>
												{/if}
											</div>

											<p class="text-[11px] text-zinc-500 dark:text-zinc-400">
												Diunggah pada: <span class="text-zinc-700 dark:text-zinc-300 font-medium">{formatMeetingDateTime(project.finalPaymentProofUploadedAt)}</span>
											</p>

											{#if project.finalPaymentProofNotes}
												<p class="text-[11px] text-zinc-600 dark:text-zinc-300 italic bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
													"{project.finalPaymentProofNotes}"
												</p>
											{/if}

											{#if project.finalPaymentProofUrl.startsWith('http')}
												<a
													href={project.finalPaymentProofUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
												>
													<ExternalLink size={12} />
													Buka file di tab baru
												</a>
											{/if}
										</div>
									</div>

									<!-- Verification Buttons -->
									<div class="pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center gap-2.5">
										<button
											type="submit"
											form="verify-payment-settled-form"
											disabled={isVerifyingPayment || project.paymentStatus === 'settled'}
											class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<CheckCircle2 size={13} />
											Setujui Pelunasan (Tandai Lunas 100%)
										</button>

										<button
											type="submit"
											form="reject-payment-settled-form"
											disabled={isVerifyingPayment || project.paymentStatus === 'settled'}
											class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<X size={13} />
											Tolak Bukti Pelunasan
										</button>
									</div>
								</div>
							{:else}
								<div class="p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
									<CreditCard size={14} class="shrink-0" />
									<span>Klien belum mengunggah bukti pelunasan sisa kontrak.</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Bento Card 4: Linimasa Proyek -->
				<div class="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 rounded-2xl space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
						<Calendar class="w-4 h-4 text-zinc-400" />
						Linimasa Proyek
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<!-- Tanggal Konsultasi -->
						<div class="space-y-2">
							<label for="consultationDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
								Tanggal Konsultasi
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
								<input
									id="consultationDate"
									type="date"
									bind:value={$form.consultationDate}
									name="consultationDate"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
							</div>
						</div>

						<!-- Tanggal Mulai Kerja -->
						<div class="space-y-2">
							<label for="startDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
								Tanggal Mulai Kerja
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
								<input
									id="startDate"
									type="date"
									bind:value={$form.startDate}
									name="startDate"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
							</div>
						</div>

						<!-- Estimasi Tanggal Selesai -->
						<div class="space-y-2">
							<label for="estimatedDelivery" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
								Estimasi Tanggal Selesai
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
								<input
									id="estimatedDelivery"
									type="date"
									bind:value={$form.estimatedDelivery}
									name="estimatedDelivery"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
							</div>
						</div>

						<!-- Tanggal Selesai Aktual -->
						<div class="space-y-2">
							<label for="actualDelivery" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
								Tanggal Selesai Aktual
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
								<input
									id="actualDelivery"
									type="date"
									bind:value={$form.actualDelivery}
									name="actualDelivery"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Bento Card 5: Catatan Internal -->
				<div class="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 rounded-2xl space-y-4">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
						<Shield class="h-4 w-4 text-zinc-400" />
						Catatan Internal
					</h2>
					<textarea
						bind:value={$form.adminNotes}
						name="adminNotes"
						placeholder="Tambahkan catatan internal untuk proyek ini..."
						class="w-full min-h-[120px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 p-3.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 transition-colors placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-white"
					></textarea>
				</div>
			</div>

			<!-- Right Column: Actions side panel -->
			<div class="flex flex-col gap-6 lg:w-1/3 lg:sticky lg:top-24 h-fit">
				<!-- Standard Project Action Updates Card -->
				<Card.Root class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm rounded-2xl">
					<Card.Header class="px-0 pt-0 pb-4 border-b border-zinc-100 dark:border-zinc-900">
						<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-455">
							<Sparkles class="h-4.5 w-4.5" />
							Project Actions
						</Card.Title>
					</Card.Header>
					<Card.Content class="px-0 pt-4 space-y-4 text-left">
						<!-- Status selection -->
						<div class="space-y-2">
							<label
								for="status"
								class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500"
							>
								Ubah Status Proyek
							</label>
							<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2">
								<select
									id="status"
									bind:value={$form.status}
									name="status"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer py-1"
								>
									<option value="pending" class="bg-white dark:bg-zinc-900">Menunggu</option>
									<option value="consulted" class="bg-white dark:bg-zinc-900">Sudah Konsultasi</option>
									<option value="in_progress" class="bg-white dark:bg-zinc-900">Dalam Pengerjaan</option>
									<option value="review" class="bg-white dark:bg-zinc-900">Dalam Review</option>
									<option value="completed" class="bg-white dark:bg-zinc-900">Selesai</option>
									<option value="rejected" class="bg-white dark:bg-zinc-900">Ditolak</option>
									<option value="archived" class="bg-white dark:bg-zinc-900">Diarsipkan</option>
								</select>
							</div>
						</div>

						<!-- Delete project button -->
						<div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
							<button
								type="button"
								onclick={openDeleteModal}
								class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-xs"
							>
								Delete Project
							</button>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</form>
</div>

{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
		<!-- Backdrop overlay -->
		<button 
			class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default w-full h-full border-0 focus:outline-none"
			onclick={closeDeleteModal}
			aria-label="Batal menghapus"
		></button>

		<!-- Modal Box -->
		<div class="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200 text-left space-y-5 z-10">
			<div class="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
				<AlertTriangle size={20} />
			</div>
			
			<div class="space-y-1.5 text-center">
				<h3 class="text-sm font-bold text-zinc-900 dark:text-white">Hapus Proyek?</h3>
				<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
					Tindakan ini tidak dapat dibatalkan. Semua data terkait proyek ini akan dihapus secara permanen dari server database.
				</p>
			</div>

			<div class="space-y-4">
				<div class="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/5 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
					Ketik nama proyek <strong class="select-all font-mono font-bold">"{project.projectTitle}"</strong> dan email klien <strong class="select-all font-mono font-bold">"{project.contactEmail}"</strong> untuk mengonfirmasi penghapusan.
				</div>

				<!-- Input Nama Proyek -->
				<div class="space-y-2">
					<label for="deleteProjName" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
						Nama Proyek
					</label>
					<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
						<input
							id="deleteProjName"
							type="text"
							bind:value={confirmProjectName}
							placeholder="Nama proyek"
							class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
						/>
					</div>
				</div>

				<!-- Input Email Klien -->
				<div class="space-y-2">
					<label for="deleteClientEmail" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
						Email Klien
					</label>
					<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950 px-3.5 py-2.5">
						<input
							id="deleteClientEmail"
							type="email"
							bind:value={confirmClientEmail}
							placeholder="Email klien"
							class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-3 justify-end pt-2">
				<button
					type="button"
					onclick={closeDeleteModal}
					class="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
				>
					Batal
				</button>
				<button
					type="submit"
					form="delete-form"
					disabled={isDeleting || !isDeleteValid}
					class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
				>
					{#if isDeleting}
						<Spinner size={12} class="text-white" />
						Menghapus...
					{:else}
						Hapus Permanen
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ==========================================
    MODAL: LIGHTBOX ZOOM BUKTI PEMBAYARAN
    ========================================== -->
{#if showProofLightbox && lightboxImage}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" transition:fade={{ duration: 150 }}>
		<button
			type="button"
			onclick={() => (showProofLightbox = false)}
			class="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 cursor-pointer"
			aria-label="Tutup"
		>
			<X size={20} />
		</button>

		<div class="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
			<img
				src={lightboxImage}
				alt="Bukti Transfer Klien"
				class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
			/>
		</div>
	</div>
{/if}
