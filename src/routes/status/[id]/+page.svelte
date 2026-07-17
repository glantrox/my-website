<script>
	import { 
		Clock, 
		CheckCircle2, 
		AlertTriangle, 
		ExternalLink, 
		Github, 
		FileText, 
		ShieldAlert, 
		User, 
		Mail, 
		Lock, 
		Eye, 
		EyeOff,
		Sparkles,
		Building2,
		Calendar,
		ArrowRight,
		Rocket
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	/** @type {{ project: any }} */
	export let data;
	$: project = data.project;

	// Computed status helpers
	$: percentage = getCompletionPercentage(project.status);
	$: health = getHealthIndicator(project.status);
	$: isClientBlocker = getClientBlockerStatus(project);

	// State for credentials mask
	let revealCredentials = false;

	/**
	 * @param {string} status
	 * @returns {number}
	 */
	function getCompletionPercentage(status) {
		switch (status) {
			case 'pending': return 10;
			case 'consulted': return 30;
			case 'in_progress': return 65;
			case 'review': return 85;
			case 'completed': return 100;
			default: return 0;
		}
	}

	/**
	 * @param {string} status
	 * @returns {{ label: string, colorClass: string, bgClass: string, borderClass: string }}
	 */
	function getHealthIndicator(status) {
		switch (status) {
			case 'pending':
				return { label: '🟡 Awaiting Booking', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20' };
			case 'consulted':
				return { label: '🔵 Proposal Review', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20' };
			case 'in_progress':
				return { label: '🟢 On Track', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20' };
			case 'review':
				return { label: '🔵 QA & Client Review', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20' };
			case 'completed':
				return { label: '🟣 Completed', colorClass: 'text-purple-500', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/20' };
			case 'rejected':
				return { label: '🔴 Closed', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/20' };
			default:
				return { label: '⚪ Archived', colorClass: 'text-zinc-500', bgClass: 'bg-zinc-500/10', borderClass: 'border-zinc-500/20' };
		}
	}

	/**
	 * @param {any} proj
	 * @returns {{ title: string, desc: string } | null}
	 */
	function getClientBlockerStatus(proj) {
		if (proj.status === 'pending' && !proj.meetingId) {
			return {
				title: 'Penjadwalan Pertemuan Konsultasi',
				desc: 'Kami sedang menunggu Anda untuk menjadwalkan sesi konsultasi awal guna membahas ruang lingkup dan spesifikasi proyek.'
			};
		}
		if (proj.status === 'consulted' && proj.paymentStatus === 'unpaid') {
			return {
				title: 'Persetujuan Proposal & Pembayaran DP',
				desc: 'Proposal penawaran dan rincian Down Payment telah dikirimkan. Kami memerlukan persetujuan serta pembayaran DP untuk mulai bekerja.'
			};
		}
		if (proj.status === 'review' && (!proj.milestoneFrontendComplete || !proj.milestoneDbSynced)) {
			return {
				title: 'Review Staging & Umpan Balik',
				desc: 'Aplikasi saat ini aktif di server staging. Mohon periksa fungsionalitas dan berikan feedback Anda.'
			};
		}
		return null;
	}

	/**
	 * @param {string} dateStr
	 * @returns {string}
	 */
	function formatDate(dateStr) {
		if (!dateStr) return '—';
		try {
			return new Date(dateStr).toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}
</script>

<svelte:head>
	<title>Project Status — {project.projectTitle || 'Portal Klien'}</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white selection:bg-zinc-800">
	<!-- Top Navigation Header -->
	<header class="max-w-6xl mx-auto px-6 py-6 border-b border-zinc-900 flex justify-between items-center">
		<div class="flex items-center gap-2">
			<Sparkles class="h-5 w-5 text-blue-500" />
			<span class="text-xs font-bold uppercase tracking-widest text-zinc-400">Client Portal</span>
		</div>
		<div class="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
			Magic Link Active
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12">
		
		<!-- ==========================================
		    1. HERO SECTION & INSTANT CONTEXT
		    ========================================== -->
		<section class="grid grid-cols-1 md:grid-cols-3 gap-8 bg-zinc-900/20 border border-zinc-900 p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
			<!-- Visual Watermark Pattern -->
			<div class="absolute inset-0 select-none overflow-hidden opacity-[0.02] pointer-events-none font-black text-9xl uppercase tracking-tighter leading-none pr-8 text-right">
				STATUS
			</div>

			<!-- Core Info -->
			<div class="md:col-span-2 space-y-6">
				<div class="space-y-2">
					<div class="flex flex-wrap items-center gap-3">
						<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border {health.bgClass} {health.colorClass} {health.borderClass}">
							{health.label}
						</span>
						<span class="text-xs text-zinc-500 font-medium flex items-center gap-1">
							<Building2 size={13} />
							{project.companyName || '—'}
						</span>
					</div>
					<h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
						{project.projectTitle || 'Project Specification'}
					</h1>
					<p class="text-zinc-450 text-sm max-w-xl font-medium">
						Klien: <span class="text-zinc-200">{project.contactName}</span> ({project.contactEmail})
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4 max-w-sm">
					<div>
						<span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Target Launch</span>
						<span class="text-sm font-semibold text-zinc-200">{formatDate(project.estimatedDelivery) || 'TBD'}</span>
					</div>
					<div>
						<span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Mulai Pengerjaan</span>
						<span class="text-sm font-semibold text-zinc-200">{formatDate(project.startDate) || 'TBD'}</span>
					</div>
				</div>
			</div>

			<!-- Progress circular meter -->
			<div class="flex flex-col items-center justify-center space-y-3 bg-zinc-900/40 border border-zinc-900 p-6 rounded-2xl">
				<div class="relative w-28 h-28 flex items-center justify-center">
					<!-- SVG Circular Ring -->
					<svg class="w-full h-full -rotate-90">
						<circle
							cx="56"
							cy="56"
							r="48"
							stroke="#18181b"
							stroke-width="8"
							fill="transparent"
						/>
						<circle
							cx="56"
							cy="56"
							r="48"
							stroke="#3b82f6"
							stroke-width="8"
							fill="transparent"
							stroke-dasharray="301.6"
							stroke-dashoffset={301.6 - (301.6 * percentage) / 100}
							stroke-linecap="round"
							class="transition-all duration-1000 ease-out"
						/>
					</svg>
					<div class="absolute flex flex-col items-center">
						<span class="text-2xl font-black text-white">{percentage}%</span>
						<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Progress</span>
					</div>
				</div>
				<span class="text-[10px] font-semibold text-zinc-400 text-center uppercase tracking-wide">
					{project.status === 'completed' ? 'Proyek Selesai' : 'Pengembangan Aktif'}
				</span>
			</div>
		</section>

		<!-- ==========================================
		    2. BALL IN YOUR COURT (ACTION REQUIRED)
		    ========================================== -->
		{#if isClientBlocker}
			<section class="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/20 space-y-4 animate-in fade-in duration-300">
				<div class="flex items-start gap-3">
					<div class="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-0.5">
						<AlertTriangle size={18} />
					</div>
					<div class="space-y-1">
						<span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Action Required</span>
						<h3 class="text-sm font-bold text-zinc-200">
							{isClientBlocker.title}
						</h3>
						<p class="text-xs text-zinc-450 leading-relaxed max-w-2xl">
							{isClientBlocker.desc}
						</p>
					</div>
				</div>

				{#if project.status === 'pending' && project.googleMeetLink}
					<div class="pl-12">
						<a
							href={project.googleMeetLink}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition-colors"
						>
							<Calendar size={14} />
							Buka Google Meet ({formatDate(project.consultationDate)})
						</a>
					</div>
				{:else if project.status === 'consulted' && project.proposalUrl}
					<div class="pl-12 flex flex-wrap gap-4">
						<a
							href={project.proposalUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition-colors"
						>
							<FileText size={14} />
							Tinjau Proposal Penawaran
						</a>
					</div>
				{/if}
			</section>
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
			<!-- ==========================================
			    3. THE INTERACTIVE TIMELINE
			    ========================================== -->
			<div class="lg:col-span-2 space-y-6">
				<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-450">
					Linimasa & Milestone Proyek
				</h2>

				<div class="relative border-l border-zinc-900 ml-3 pl-6 space-y-8 py-2">
					<!-- Phase 1 -->
					<div class="relative">
						<!-- Milestone Dot -->
						<div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-950 flex items-center justify-center
							{['consulted', 'in_progress', 'review', 'completed'].includes(project.status) 
								? 'bg-blue-500' 
								: 'bg-zinc-800 border-zinc-900'}">
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold text-white">Fase 1: Konsultasi & Perencanaan</h3>
								<span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
									{['consulted', 'in_progress', 'review', 'completed'].includes(project.status)
										? 'bg-emerald-500/10 text-emerald-400'
										: 'bg-zinc-900 text-zinc-500'}">
									{['consulted', 'in_progress', 'review', 'completed'].includes(project.status) ? 'Selesai' : 'Aktif'}
								</span>
							</div>
							<p class="text-xs text-zinc-450 leading-relaxed max-w-lg font-medium">
								Sesi konsultasi, penyusunan spesifikasi teknis, penentuan prioritas fitur, dan persetujuan penawaran harga.
							</p>
						</div>
					</div>

					<!-- Phase 2 -->
					<div class="relative">
						<!-- Milestone Dot -->
						<div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-950 flex items-center justify-center
							{['in_progress', 'review', 'completed'].includes(project.status) 
								? 'bg-blue-500' 
								: project.status === 'consulted' ? 'bg-amber-500' : 'bg-zinc-800'}">
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold text-white">Fase 2: Proses Pengembangan</h3>
								<span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
									{project.status === 'in_progress'
										? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
										: ['review', 'completed'].includes(project.status)
											? 'bg-emerald-500/10 text-emerald-400'
											: 'bg-zinc-900 text-zinc-500'}">
									{project.status === 'in_progress' ? 'Sedang Berjalan' : ['review', 'completed'].includes(project.status) ? 'Selesai' : 'Mendatang'}
								</span>
							</div>
							<p class="text-xs text-zinc-450 leading-relaxed max-w-lg font-medium">
								Proses penulisan kode backend dan database, implementasi antarmuka pengguna (UI), dan integrasi modul pihak ketiga.
							</p>
						</div>
					</div>

					<!-- Phase 3 -->
					<div class="relative">
						<!-- Milestone Dot -->
						<div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-950 flex items-center justify-center
							{['completed'].includes(project.status) 
								? 'bg-blue-500' 
								: project.status === 'review' ? 'bg-amber-500' : 'bg-zinc-800'}">
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold text-white">Fase 3: Pengujian & Tinjauan Klien</h3>
								<span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
									{project.status === 'review'
										? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
										: project.status === 'completed'
											? 'bg-emerald-500/10 text-emerald-400'
											: 'bg-zinc-900 text-zinc-500'}">
									{project.status === 'review' ? 'Review Staging' : project.status === 'completed' ? 'Selesai' : 'Mendatang'}
								</span>
							</div>
							<p class="text-xs text-zinc-450 leading-relaxed max-w-lg font-medium">
								Tahap User Acceptance Testing (UAT) di server staging, perbaikan bug berdasarkan umpan balik, dan audit keamanan.
							</p>
						</div>
					</div>

					<!-- Phase 4 -->
					<div class="relative">
						<!-- Milestone Dot -->
						<div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-950 flex items-center justify-center
							{project.status === 'completed' ? 'bg-purple-500' : 'bg-zinc-800'}">
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold text-white">Fase 4: Peluncuran & Penyerahan</h3>
								<span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
									{project.status === 'completed'
										? 'bg-purple-500/10 text-purple-400'
										: 'bg-zinc-900 text-zinc-500'}">
									{project.status === 'completed' ? 'Selesai' : 'Mendatang'}
								</span>
							</div>
							<p class="text-xs text-zinc-450 leading-relaxed max-w-lg font-medium">
								Migrasi data ke server produksi, penyerahan repositori kode sumber, penyampaian dokumentasi teknis, dan aktivasi garansi.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- ==========================================
			    4. DELIVERABLES & SECURE CREDENTIALS HUB
			    ========================================== -->
			<div class="space-y-6">
				<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-455">
					Aset & Link Deliverable
				</h2>

				<div class="bg-zinc-900/10 border border-zinc-900 p-6 rounded-2xl space-y-6">
					
					<!-- Links List -->
					<div class="space-y-3.5">
						{#if project.stagingUrl}
							<a
								href={project.stagingUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800 text-zinc-200 hover:text-white rounded-xl transition-all text-xs font-semibold"
							>
								<span class="flex items-center gap-2">
									<Rocket class="w-4 h-4 text-blue-500" />
									Server Staging
								</span>
								<ExternalLink class="w-3.5 h-3.5 opacity-60" />
							</a>
						{/if}

						{#if project.proposalUrl}
							<a
								href={project.proposalUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800 text-zinc-200 hover:text-white rounded-xl transition-all text-xs font-semibold"
							>
								<span class="flex items-center gap-2">
									<FileText class="w-4 h-4 text-blue-500" />
									Dokumen Proposal
								</span>
								<ExternalLink class="w-3.5 h-3.5 opacity-60" />
							</a>
						{/if}

						{#if project.repoLink}
							<a
								href={project.repoLink}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800 text-zinc-200 hover:text-white rounded-xl transition-all text-xs font-semibold"
							>
								<span class="flex items-center gap-2">
									<Github class="w-4 h-4 text-blue-500" />
									Source Code (Git)
								</span>
								<ExternalLink class="w-3.5 h-3.5 opacity-60" />
							</a>
						{/if}

						{#if !project.stagingUrl && !project.proposalUrl && !project.repoLink}
							<div class="text-center py-6 text-zinc-500 text-xs font-semibold">
								Link aset akan ditambahkan saat pengerjaan dimulai.
							</div>
						{/if}
					</div>

					<!-- Secure credentials vault if stagingUrl exists -->
					{#if project.stagingUrl}
						<div class="pt-4 border-t border-zinc-900 space-y-3">
							<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
								<Lock size={12} class="text-blue-500" /> Staging Secure Access
							</span>
							<div class="bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs font-semibold space-y-2 relative">
								<button
									onclick={() => revealCredentials = !revealCredentials}
									class="absolute top-3.5 right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
									title={revealCredentials ? "Hide credentials" : "Show credentials"}
								>
									{#if revealCredentials}
										<EyeOff size={14} />
									{:else}
										<Eye size={14} />
									{/if}
								</button>

								<div>
									<span class="text-[9px] text-zinc-500 block">Staging User</span>
									<span class="text-zinc-200 select-all">admin@hamasazizan.com</span>
								</div>
								<div>
									<span class="text-[9px] text-zinc-500 block">Password</span>
									<span class="text-zinc-200 select-all font-mono">
										{revealCredentials ? "ha_agency_staging_2026!" : "••••••••••••••••"}
									</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<hr class="border-zinc-900" />

		<div class="grid grid-cols-1 md:grid-cols-3 gap-10">
			<!-- ==========================================
			    5. BUSINESS & FINANCIAL LAYER
			    ========================================== -->
			<div class="space-y-6">
				<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-450">
					Detail Keuangan & Status Invoice
				</h2>

				<div class="border border-zinc-900 bg-zinc-900/10 p-6 rounded-2xl space-y-4 font-semibold text-xs">
					<div class="flex justify-between items-center py-2 border-b border-zinc-900">
						<span class="text-zinc-500">Nilai Kontrak Proyek</span>
						<span class="text-zinc-200">
							{project.quotedPrice ? `Rp ${project.quotedPrice.toLocaleString('id-ID')}` : '—'}
						</span>
					</div>

					<div class="flex justify-between items-center py-2 border-b border-zinc-900">
						<span class="text-zinc-500">Kebutuhan Down Payment (DP)</span>
						<span class="text-zinc-200">{project.downPaymentRequirement || '30% DP'}</span>
					</div>

					<div class="flex justify-between items-center py-2">
						<span class="text-zinc-500">Status Pembayaran</span>
						<span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border
							{project.paymentStatus === 'settled' 
								? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
								: project.paymentStatus === 'dp_paid'
									? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
									: 'bg-rose-500/10 text-rose-450 border-rose-500/20'}">
							{project.paymentStatus === 'settled' ? 'Lunas' : project.paymentStatus === 'dp_paid' ? 'DP Dibayar' : 'Belum Lunas'}
						</span>
					</div>
				</div>
			</div>

			<!-- ==========================================
			    6. RECENT UPDATE LOGS / CHANGELOG
			    ========================================== -->
			<div class="space-y-6">
				<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-455">
					Catatan & Log Aktivitas Terbaru
				</h2>

				<div class="space-y-4">
					{#if project.adminNotes}
						<div class="p-5 border border-zinc-900 bg-zinc-900/10 rounded-2xl space-y-2">
							<span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Catatan PM ({formatDate(project.updatedAt)})</span>
							<p class="text-xs text-zinc-300 leading-relaxed font-medium break-words whitespace-pre-wrap">
								{project.adminNotes}
							</p>
						</div>
					{/if}

					<div class="p-5 border border-dashed border-zinc-900 bg-transparent rounded-2xl space-y-2">
						<span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Status Terakhir</span>
						<p class="text-xs text-zinc-400 leading-relaxed font-medium">
							Proyek diubah ke status <span class="text-white font-bold">{getHealthIndicator(project.status).label.split(' ').slice(1).join(' ')}</span> pada {formatDate(project.updatedAt)}.
						</p>
					</div>
				</div>
			</div>

			<!-- ==========================================
			    7. POINT OF CONTACT PM CARD
			    ========================================== -->
			<div class="space-y-6">
				<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-450">
					Tim Pendamping Proyek
				</h2>

				<div class="border border-zinc-900 bg-zinc-900/10 p-6 rounded-2xl space-y-5">
					<div class="flex items-center gap-3.5">
						<div class="w-11 h-11 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 shrink-0 select-none">
							<User size={20} />
						</div>
						<div>
							<h3 class="text-xs font-bold text-white">Hamas Azizan</h3>
							<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-550 block mt-0.5">Project Manager / PM</span>
						</div>
					</div>

					<div class="pt-4 border-t border-zinc-900 space-y-2.5 font-medium text-xs">
						<a
							href="mailto:contact@hamasazizan.com"
							class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
						>
							<Mail class="w-3.5 h-3.5 text-blue-500 shrink-0" />
							contact@hamasazizan.com
						</a>
						
						<div class="flex items-start gap-2 text-zinc-450 leading-relaxed">
							<Clock class="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
							<div>
								<span class="block">Office Hours:</span>
								<span class="text-zinc-500 block">Mon - Fri, 09:00 - 17:00 WIB</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</main>
</div>
