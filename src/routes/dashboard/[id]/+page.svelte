<script>
	import { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import {
		ArrowLeft,
		User,
		Building2,
		Globe,
		Mail,
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
		Github
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	/** @type {{ project: any, form: any }} */
	export let data;

	$: project = data.project;

	const { form, enhance: superEnhance } = superForm(data.form);

	$: isFormChanged = 
		$form.status !== data.form.data.status ||
		($form.adminNotes || '') !== (data.form.data.adminNotes || '') ||
		$form.quotedPrice !== data.form.data.quotedPrice ||
		($form.consultationDate || '') !== (data.form.data.consultationDate || '') ||
		($form.startDate || '') !== (data.form.data.startDate || '') ||
		($form.estimatedDelivery || '') !== (data.form.data.estimatedDelivery || '') ||
		($form.actualDelivery || '') !== (data.form.data.actualDelivery || '') ||
		($form.paymentStatus || 'unpaid') !== (data.form.data.paymentStatus || 'unpaid') ||
		($form.priority || 'normal') !== (data.form.data.priority || 'normal');

	// Mapped Human Readable Labels to eliminate raw database strings
	/** @type {Record<string, string>} */
	const readableLabels = {
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

	/**
	 * @param {string} status
	 * @returns {string}
	 */
	function formatStatus(status) {
		/** @type {Record<string, string>} */
		const labels = {
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

	/**
	 * @param {string} status
	 * @returns {string}
	 */
	function statusColor(status) {
		/** @type {Record<string, string>} */
		const colors = {
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

	function generateMeetLink() {
		const chars = 'abcdefghijklmnopqrstuvwxyz';
		const p1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
		const p2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
		const p3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
		return `https://meet.google.com/${p1}-${p2}-${p3}`;
	}

	let meetLink = generateMeetLink();

	function regenerateMeetLink() {
		meetLink = generateMeetLink();
	}

	let isRescheduling = false;

	/**
	 * @param {string} isoString
	 * @returns {string}
	 */
	function formatMeetingDateTime(isoString) {
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

<!-- Separate invisible forms for SvelteKit named actions to avoid form nesting -->
<form id="schedule-form" method="POST" action="?/scheduleMeeting" use:enhance></form>
<form id="proposal-form" method="POST" action="?/sendProposal" use:enhance></form>
<form id="progress-form" method="POST" action="?/pushProgressUpdate" use:enhance></form>
<form id="signoff-form" method="POST" action="?/requestSignOff" use:enhance></form>
<form id="handover-form" method="POST" action="?/sendHandover" use:enhance></form>
<form id="restore-form" method="POST" action="?/restoreLead" use:enhance></form>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Sleek Navigation Header -->
	<div class="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200 dark:border-zinc-800">
		<a
			href="/dashboard"
			class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			Back to Dashboard
		</a>
		<button
			type="submit"
			form="update-lead-form"
			disabled={!isFormChanged}
			class="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<CheckCircle2 class="h-4 w-4" />
			Simpan Perubahan
		</button>
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
			<!-- Left Column: Editorial details layout sitting on flat canvas -->
			<div class="flex flex-col gap-10 lg:w-2/3">
				
				<!-- Section: Client Information -->
				<div class="space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
						Informasi Klien
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
						<div>
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Nama Kontak</span>
							<span class="text-base font-medium text-zinc-900 dark:text-zinc-200">{project.contactName || '—'}</span>
						</div>
						<div>
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Email Address</span>
							<span class="text-base font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
								<Mail class="w-3.5 h-3.5 text-zinc-455 shrink-0" />
								{project.contactEmail || '—'}
							</span>
						</div>
						<div>
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Perusahaan</span>
							<span class="text-base font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
								<Building2 class="w-3.5 h-3.5 text-zinc-455 shrink-0" />
								{project.companyName || '—'}
							</span>
						</div>
						<div>
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Sektor Industri</span>
							<span class="text-base font-medium text-zinc-900 dark:text-zinc-200">{project.industry || '—'}</span>
						</div>
						{#if project.websiteUrl}
							<div class="sm:col-span-2">
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Website URL</span>
								<span class="text-base font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
									<Globe class="w-3.5 h-3.5 text-zinc-455 shrink-0" />
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

				<hr class="border-zinc-200 dark:border-zinc-800" />

				<!-- Section: Project Specifications -->
				<div class="space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
						Spesifikasi Proyek
					</h2>
					<div class="space-y-6">
						<div>
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Judul Proyek</span>
							<h1 class="text-xl font-bold text-zinc-900 dark:text-white leading-snug">{project.projectTitle || '—'}</h1>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div>
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Tipe Layanan</span>
								<span class="text-base font-medium text-zinc-900 dark:text-zinc-200">
									{readableLabels[project.serviceType] || project.serviceType || '—'}
								</span>
							</div>
							<div>
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Tier Proyek</span>
								<span class="text-base font-medium text-zinc-900 dark:text-zinc-200">
									{readableLabels[project.projectTier] || project.projectTier || '—'}
								</span>
							</div>
							<div>
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Target Timeline</span>
								<span class="text-base font-medium text-zinc-900 dark:text-zinc-200">
									{readableLabels[project.targetTimeline] || project.targetTimeline || '—'}
								</span>
							</div>
						</div>

						{#if project.coreObjective}
							<div>
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Tujuan Utama</span>
								<p class="break-words whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-305 leading-relaxed">
									{project.coreObjective}
								</p>
							</div>
						{/if}

						{#if project.keyFeatures && project.keyFeatures.length > 0}
							<div>
								<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">Fitur Utama</span>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each project.keyFeatures as feature}
										<span class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-zinc-650 dark:text-zinc-300">
											{feature}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<hr class="border-zinc-200 dark:border-zinc-800" />

				<!-- Section: Administrasi & Keuangan -->
				<div class="space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
						Administrasi & Keuangan
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<!-- Harga Penawaran -->
						<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-650">
							<label for="quotedPrice" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Harga Penawaran
							</label>
							<div class="flex items-baseline mt-1">
								<span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mr-1.5 select-none">Rp</span>
								<input
									id="quotedPrice"
									type="number"
									min="0"
									bind:value={$form.quotedPrice}
									name="quotedPrice"
									placeholder="0"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-700"
								/>
							</div>
						</div>

						<!-- Status Pembayaran -->
						<div class="border-b border-zinc-200 dark:border-zinc-800 pb-2">
							<label for="paymentStatus" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Status Pembayaran
							</label>
							<select
								id="paymentStatus"
								bind:value={$form.paymentStatus}
								name="paymentStatus"
								class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 cursor-pointer"
							>
								<option value="unpaid" class="bg-white dark:bg-zinc-900">Belum Bayar</option>
								<option value="dp_paid" class="bg-white dark:bg-zinc-900">DP Dibayar</option>
								<option value="partial" class="bg-white dark:bg-zinc-900">Sebagian</option>
								<option value="settled" class="bg-white dark:bg-zinc-900">Lunas</option>
							</select>
						</div>

						<!-- Prioritas -->
						<div class="border-b border-zinc-200 dark:border-zinc-800 pb-2">
							<label for="priority" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Prioritas Proyek
							</label>
							<select
								id="priority"
								bind:value={$form.priority}
								name="priority"
								class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 cursor-pointer"
							>
								<option value="low" class="bg-white dark:bg-zinc-900">Low</option>
								<option value="normal" class="bg-white dark:bg-zinc-900">Normal</option>
								<option value="high" class="bg-white dark:bg-zinc-900">High</option>
								<option value="urgent" class="bg-white dark:bg-zinc-900">Urgent</option>
							</select>
						</div>
					</div>
				</div>

				<hr class="border-zinc-200 dark:border-zinc-800" />

				<!-- Section: Linimasa Proyek -->
				<div class="space-y-6">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
						Linimasa Proyek
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
						<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-650">
							<label for="consultationDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Tanggal Konsultasi
							</label>
							<div class="flex items-center justify-between mt-1">
								<input
									id="consultationDate"
									type="date"
									bind:value={$form.consultationDate}
									name="consultationDate"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
								<Calendar class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
							</div>
						</div>

						<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-650">
							<label for="startDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Tanggal Mulai Kerja
							</label>
							<div class="flex items-center justify-between mt-1">
								<input
									id="startDate"
									type="date"
									bind:value={$form.startDate}
									name="startDate"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
								<Calendar class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
							</div>
						</div>

						<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-650">
							<label for="estimatedDelivery" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Estimasi Tanggal Selesai
							</label>
							<div class="flex items-center justify-between mt-1">
								<input
									id="estimatedDelivery"
									type="date"
									bind:value={$form.estimatedDelivery}
									name="estimatedDelivery"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
								<Calendar class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
							</div>
						</div>

						<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-400 dark:focus-within:border-zinc-650">
							<label for="actualDelivery" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
								Tanggal Selesai Aktual
							</label>
							<div class="flex items-center justify-between mt-1">
								<input
									id="actualDelivery"
									type="date"
									bind:value={$form.actualDelivery}
									name="actualDelivery"
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
								/>
								<Calendar class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
							</div>
						</div>
					</div>
				</div>

				<hr class="border-zinc-200 dark:border-zinc-800" />

				<!-- Section: Internal Notes (within the main update form) -->
				<div class="space-y-4">
					<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
						<Shield class="h-4 w-4 text-zinc-450" />
						Catatan Internal
					</h2>
					<textarea
						bind:value={$form.adminNotes}
						name="adminNotes"
						placeholder="Tambahkan catatan internal untuk proyek ini..."
						class="w-full min-h-[120px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent p-3 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600"
					></textarea>
				</div>
			</div>

			<!-- Right Column: Actions side panel -->
			<div class="flex flex-col gap-6 lg:w-1/3">
				
				<!-- ==========================================
				    DYNAMIC ACTION CARDS (MORPHED BY STATUS)
				    ========================================== -->

				<!-- 1. STATUS: pending (Menunggu) -->
				{#if $form.status === 'pending'}
					{#if project.meetingId && !isRescheduling}
						<!-- Scheduled Consultation Session Details -->
						<Card.Root class="border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.02] p-6 shadow-sm rounded-2xl">
							<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10 flex flex-row items-center justify-between">
								<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
									<CheckCircle2 class="h-4 w-4 shrink-0" />
									Scheduled Session
								</Card.Title>
								<button
									type="button"
									on:click={() => (isRescheduling = true)}
									class="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Reschedule
								</button>
							</Card.Header>
							<Card.Content class="px-0 pt-4 space-y-4">
								<div class="space-y-3">
									<div>
										<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Date & Time</span>
										<span class="text-sm font-semibold text-zinc-900 dark:text-white block mt-0.5">
											{formatMeetingDateTime(project.consultationDate)}
										</span>
									</div>
									<div>
										<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Google Meet Link</span>
										<a
											href={project.googleMeetLink}
											target="_blank"
											rel="noopener noreferrer"
											class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline block mt-0.5 break-all"
										>
											{project.googleMeetLink}
										</a>
									</div>
									<div>
										<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Meeting ID Reference</span>
										<code class="text-xs text-zinc-605 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded block mt-0.5 font-mono select-all">
											{project.meetingId}
										</code>
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
						<Card.Root class="border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.02] p-6 shadow-sm rounded-2xl">
							<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10 flex flex-row items-center justify-between">
								<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
									<Calendar class="h-4.5 w-4.5" />
									Schedule Consultation
								</Card.Title>
								{#if isRescheduling}
									<button
										type="button"
										on:click={() => (isRescheduling = false)}
										class="text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
									>
										Cancel
									</button>
								{/if}
							</Card.Header>
							<Card.Content class="px-0 pt-4 space-y-5">
								<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-emerald-500">
									<label for="meetDate" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
										Tanggal Meeting
									</label>
									<div class="flex items-center justify-between mt-1">
										<input
											id="meetDate"
											type="date"
											name="meetDate"
											form="schedule-form"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
										/>
										<Calendar class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
									</div>
								</div>
								<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-emerald-500">
									<label for="meetTime" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
										Jam Meeting (GMT+7)
									</label>
									<div class="flex items-center justify-between mt-1">
										<input
											id="meetTime"
											type="time"
											name="meetTime"
											form="schedule-form"
											required
											class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
										/>
										<Clock class="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
									</div>
								</div>
								<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-emerald-500">
									<div class="flex items-center justify-between">
										<label for="meetLink" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
											Google Meet Link
										</label>
										<button
											type="button"
											on:click={regenerateMeetLink}
											class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline"
										>
											Regenerate
										</button>
									</div>
									<input
										id="meetLink"
										type="url"
										name="meetLink"
										form="schedule-form"
										bind:value={meetLink}
										required
										class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
									/>
								</div>
								<Button
									type="submit"
									form="schedule-form"
									class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
								>
									<Mail class="h-4 w-4" />
									Schedule & Send Email
								</Button>
							</Card.Content>
						</Card.Root>
					{/if}

				<!-- 2. STATUS: consulted (Sudah Konsultasi) -->
				{:else if $form.status === 'consulted'}
					<Card.Root class="border-blue-500/30 dark:border-blue-500/20 bg-blue-500/[0.01] p-6 shadow-sm rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-blue-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
								<Briefcase class="h-4.5 w-4.5" />
								Proposal & Quotation
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5">
							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-blue-500">
								<label for="proposalUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Proposal / Scope URL
								</label>
								<input
									id="proposalUrl"
									type="url"
									name="proposalUrl"
									form="proposal-form"
									bind:value={$form.proposalUrl}
									placeholder="https://notion.so/..."
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-blue-500">
								<label for="quotedPriceProposal" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Finalized Price (Rp)
								</label>
								<div class="flex items-baseline mt-1">
									<span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mr-1.5 select-none">Rp</span>
									<input
										id="quotedPriceProposal"
										type="number"
										min="0"
										name="quotedPrice"
										form="proposal-form"
										bind:value={$form.quotedPrice}
										placeholder="0"
										required
										class="w-full bg-transparent text-xl font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-700"
									/>
								</div>
							</div>

							<div class="border-b border-zinc-200 dark:border-zinc-800 pb-2">
								<label for="downPaymentRequirement" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									DP Requirement
								</label>
								<select
									id="downPaymentRequirement"
									name="downPaymentRequirement"
									form="proposal-form"
									bind:value={$form.downPaymentRequirement}
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 cursor-pointer"
								>
									<option value="30% DP" class="bg-white dark:bg-zinc-900">30% DP (Start Milestone)</option>
									<option value="40% DP" class="bg-white dark:bg-zinc-900">40% DP</option>
									<option value="50% DP" class="bg-white dark:bg-zinc-900">50% DP (Equal Splits)</option>
									<option value="Full upfront" class="bg-white dark:bg-zinc-900">100% Full Upfront</option>
								</select>
							</div>

							<Button
								type="submit"
								form="proposal-form"
								class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
							>
								<Briefcase class="h-4 w-4" />
								Send Proposal & DP Invoice
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 3. STATUS: in_progress (Dalam Pengerjaan) -->
				{:else if $form.status === 'in_progress'}
					<Card.Root class="border-purple-500/30 dark:border-purple-500/20 bg-purple-500/[0.01] p-6 shadow-sm rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-purple-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
								<Rocket class="h-4.5 w-4.5" />
								Development Workspace
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5">
							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-purple-500">
								<label for="repoLink" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Repository URL
								</label>
								<input
									id="repoLink"
									type="url"
									name="repoLink"
									form="progress-form"
									bind:value={$form.repoLink}
									placeholder="https://github.com/..."
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-purple-500">
								<label for="stagingUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Staging Server URL
								</label>
								<input
									id="stagingUrl"
									type="url"
									name="stagingUrl"
									form="progress-form"
									bind:value={$form.stagingUrl}
									placeholder="https://staging.mewmewwo.com"
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-purple-500">
								<label for="managementBoardUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Task Management Board
								</label>
								<input
									id="managementBoardUrl"
									type="url"
									name="managementBoardUrl"
									form="progress-form"
									bind:value={$form.managementBoardUrl}
									placeholder="https://linear.app/..."
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<Button
								type="submit"
								form="progress-form"
								class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
							>
								<Rocket class="h-4 w-4" />
								Push Progress Update
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 4. STATUS: review (Dalam Review) -->
				{:else if $form.status === 'review'}
					<Card.Root class="border-orange-500/30 dark:border-orange-500/20 bg-orange-500/[0.01] p-6 shadow-sm rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-orange-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
								<Beaker class="h-4.5 w-4.5" />
								QA & Client Review
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5">
							
							{#if $form.stagingUrl}
								<div>
									<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Staging Environment</span>
									<a
										href={$form.stagingUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 text-xs text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-500/10 transition-colors"
									>
										Open Staging Site
										<ExternalLink size={12} />
									</a>
								</div>
							{/if}

							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-orange-500">
								<label for="feedbackTrackerUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Feedback Tracker URL
								</label>
								<input
									id="feedbackTrackerUrl"
									type="url"
									name="feedbackTrackerUrl"
									form="signoff-form"
									bind:value={$form.feedbackTrackerUrl}
									placeholder="https://loom.com/..."
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div class="space-y-2">
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Milestones Completed</span>
								<div class="space-y-1.5 text-xs">
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
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
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
										<input
											type="checkbox"
											name="milestoneDbSynced"
											form="signoff-form"
											value="true"
											bind:checked={$form.milestoneDbSynced}
											class="rounded border-zinc-300 dark:border-zinc-750 text-orange-600 focus:ring-orange-500 bg-transparent"
										/>
										Database Synced
									</label>
									<label class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
										<input
											type="checkbox"
											name="milestonePaymentVerified"
											form="signoff-form"
											value="true"
											bind:checked={$form.milestonePaymentVerified}
											class="rounded border-zinc-300 dark:border-zinc-750 text-orange-600 focus:ring-orange-500 bg-transparent"
										/>
										Payment Gateway Verified
									</label>
								</div>
							</div>

							<Button
								type="submit"
								form="signoff-form"
								class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
							>
								<Beaker class="h-4 w-4" />
								Request Form Sign-Off
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 5. STATUS: completed (Selesai) -->
				{:else if $form.status === 'completed'}
					<Card.Root class="border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.01] p-6 shadow-sm rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-emerald-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
								<Gift class="h-4.5 w-4.5" />
								Project Handover
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5">
							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-emerald-500">
								<label for="productionUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Production Live URL
								</label>
								<input
									id="productionUrl"
									type="url"
									name="productionUrl"
									form="handover-form"
									bind:value={$form.productionUrl}
									placeholder="https://mewmewwo.com"
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-emerald-500">
								<label for="codebaseTransferUrl" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Codebase ZIP / Repo Link
								</label>
								<input
									id="codebaseTransferUrl"
									type="url"
									name="codebaseTransferUrl"
									form="handover-form"
									bind:value={$form.codebaseTransferUrl}
									placeholder="https://github.com/transfers/..."
									required
									class="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 placeholder-zinc-700"
								/>
							</div>

							<div>
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Warranty Support Period</span>
								<span class="text-xs text-zinc-550 dark:text-zinc-400 block mt-1 font-semibold">
									Free Support Ends: {project.warrantyEndDate || getWarrantyExpiryDate()}
								</span>
							</div>

							<Button
								type="submit"
								form="handover-form"
								class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
							>
								<Gift class="h-4 w-4" />
								Send Handover Package
							</Button>
						</Card.Content>
					</Card.Root>

				<!-- 6. STATUS: rejected (Ditolak) & archived (Diarsipkan) -->
				{:else if $form.status === 'rejected' || $form.status === 'archived'}
					<Card.Root class="border-zinc-500/30 dark:border-zinc-500/20 bg-zinc-500/[0.01] p-6 shadow-sm rounded-2xl">
						<Card.Header class="px-0 pt-0 pb-4 border-b border-zinc-500/10">
							<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
								<FolderArchive class="h-4.5 w-4.5" />
								Archived Archive
							</Card.Title>
						</Card.Header>
						<Card.Content class="px-0 pt-4 space-y-5">
							<div class="group relative border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors focus-within:border-zinc-500">
								<label for="archiveReason" class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
									Reason for Rejection / Archive
								</label>
								<textarea
									id="archiveReason"
									name="archiveReason"
									bind:value={$form.archiveReason}
									placeholder="Budget mismatch, timeline issues..."
									class="w-full min-h-[80px] bg-transparent text-sm font-medium text-zinc-900 dark:text-white focus:outline-none mt-2 placeholder-zinc-700"
								></textarea>
							</div>

							<div>
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Archive State Log</span>
								<span class="text-xs text-zinc-550 dark:text-zinc-400 block mt-1 font-semibold">
									Lead closed on: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}
								</span>
							</div>

							<Button
								type="submit"
								form="restore-form"
								class="w-full bg-zinc-800 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
							>
								<FolderArchive class="h-4 w-4" />
								Restore to Active Leads
							</Button>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- Standard Project Action Updates Card -->
				<Card.Root class="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm rounded-2xl">
					<Card.Header class="px-0 pt-0 pb-4 border-b border-zinc-100 dark:border-zinc-900">
						<Card.Title class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-455">
							<Sparkles class="h-4.5 w-4.5" />
							Project Actions
						</Card.Title>
					</Card.Header>
					<Card.Content class="px-0 pt-4 space-y-4">
						<!-- Status selection -->
						<div class="border-b border-zinc-200 dark:border-zinc-800 pb-2">
							<label
								for="status"
								class="text-[10px] font-bold uppercase tracking-wider text-zinc-500"
							>
								Ubah Status Proyek
							</label>
							<select
								id="status"
								bind:value={$form.status}
								name="status"
								class="w-full bg-transparent text-base font-medium text-zinc-900 dark:text-white focus:outline-none mt-1 cursor-pointer"
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
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</form>
</div>
