<script lang="ts">
	import { 
		Clock, 
		CheckCircle2, 
		AlertTriangle, 
		ExternalLink, 
		Github, 
		FileText, 
		User, 
		Mail, 
		Lock, 
		Eye, 
		EyeOff,
		Building2,
		Calendar,
		ArrowRight,
		Rocket,
		ChevronRight,
		Coins
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	// Retrieve data from Svelte 5 props
	let { data } = $props();
	const project = $derived(data.project);

	// Derived state properties
	const percentage = $derived(getCompletionPercentage(project.status));
	const health = $derived(getHealthIndicator(project.status));
	const isClientBlocker = $derived(getClientBlockerStatus(project));

	// State for credentials mask
	let revealCredentials = $state(false);

	function getCompletionPercentage(status: string): number {
		switch (status) {
			case 'pending': return 10;
			case 'consulted': return 30;
			case 'in_progress': return 65;
			case 'review': return 85;
			case 'completed': return 100;
			default: return 0;
		}
	}

	function getHealthIndicator(status: string) {
		switch (status) {
			case 'pending':
				return { label: 'Awaiting Booking', colorClass: 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/5' };
			case 'consulted':
				return { label: 'Proposal Review', colorClass: 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5' };
			case 'in_progress':
				return { label: 'Active Development', colorClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
			case 'review':
				return { label: 'QA & Client Review', colorClass: 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/5' };
			case 'completed':
				return { label: 'Completed', colorClass: 'text-zinc-900 dark:text-zinc-100 border-zinc-900/10 dark:border-zinc-700/30 bg-zinc-100 dark:bg-zinc-800' };
			case 'rejected':
				return { label: 'Closed', colorClass: 'text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-500/5' };
			default:
				return { label: 'Archived', colorClass: 'text-zinc-500 border-zinc-500/10 bg-zinc-500/5' };
		}
	}

	function getClientBlockerStatus(proj: any) {
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

	function formatDate(dateStr: string | null | undefined): string {
		if (!dateStr) return '—';
		try {
			return new Date(dateStr).toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		} catch {
			return String(dateStr);
		}
	}
</script>

<svelte:head>
	<title>Project Status — {project.projectTitle || 'Portal Klien'}</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16 selection:bg-zinc-100 dark:selection:bg-zinc-800">
	
	<!-- ==========================================
	    BREADCRUMB & HEADER
	    ========================================== -->
	<header class="space-y-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-8">
		<div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
			<span>Client Portal</span>
			<span class="text-zinc-300 dark:text-zinc-700">/</span>
			<span>Project Status</span>
		</div>

		<div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
			<div class="space-y-3">
				<h1 class="text-4xl md:text-5xl font-medium font-serif italic tracking-tight text-zinc-800 dark:text-zinc-100">
					{project.projectTitle || 'Project Specification'}
				</h1>
				<p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
					Client Partner: <span class="text-zinc-800 dark:text-zinc-200 font-medium">{project.contactName}</span> ({project.contactEmail})
				</p>
			</div>
			
			<div class="flex items-center gap-3">
				<span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border {health.colorClass}">
					{health.label}
				</span>
				<span class="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
					<Building2 size={13} />
					{project.companyName || '—'}
				</span>
			</div>
		</div>
	</header>

	<!-- ==========================================
	    ACTION REQUIRED BLOCK
	    ========================================== -->
	{#if isClientBlocker}
		<section class="p-6 rounded-2xl bg-amber-500/5 dark:bg-amber-500/[0.03] space-y-4 animate-in fade-in duration-300">
			<div class="flex items-start gap-3">
				<div class="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg shrink-0 mt-0.5">
					<AlertTriangle size={16} />
				</div>
				<div class="space-y-1">
					<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Action Required</span>
					<h3 class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
						{isClientBlocker.title}
					</h3>
					<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
						{isClientBlocker.desc}
					</p>
				</div>
			</div>

			{#if project.status === 'pending' && project.googleMeetLink}
				<div class="pl-11">
					<a
						href={project.googleMeetLink}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-semibold rounded-lg text-xs transition-colors shadow-sm"
					>
						<Calendar size={14} />
						Buka Google Meet ({formatDate(project.consultationDate)})
					</a>
				</div>
			{:else if project.status === 'consulted' && project.proposalUrl}
				<div class="pl-11 flex flex-wrap gap-4">
					<a
						href={project.proposalUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-semibold rounded-lg text-xs transition-colors shadow-sm"
					>
						<FileText size={14} />
						Tinjau Proposal Penawaran
					</a>
				</div>
			{/if}
		</section>
	{/if}

	<!-- ==========================================
	    PROGRESS & CORE METRICS
	    ========================================== -->
	<section class="grid grid-cols-1 md:grid-cols-3 gap-10">
		
		<!-- Left: Horizontal Progress Tracker -->
		<div class="md:col-span-2 space-y-4 flex flex-col justify-center">
			<div class="flex justify-between items-end text-xs mb-1">
				<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Development Progress</span>
				<span class="font-serif italic font-medium text-zinc-900 dark:text-zinc-100 text-lg">{percentage}%</span>
			</div>
			
			<div class="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
				<div 
					class="h-full bg-zinc-900 dark:bg-zinc-200 transition-all duration-1000 ease-out" 
					style="width: {percentage}%"
				></div>
			</div>
			
			<p class="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
				{project.status === 'completed' ? 'Proyek Selesai & Diserahkan' : 'Siklus Pengerjaan Sedang Berjalan'}
			</p>
		</div>

		<!-- Right: Core Dates Table -->
		<div class="border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-5 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-center space-y-4">
			<div class="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
				<span class="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Start Date</span>
				<span class="text-xs text-zinc-800 dark:text-zinc-200 font-medium">{formatDate(project.startDate) || 'TBD'}</span>
			</div>
			<div class="flex justify-between py-1">
				<span class="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Est. Launch</span>
				<span class="text-xs text-zinc-800 dark:text-zinc-200 font-medium">{formatDate(project.estimatedDelivery) || 'TBD'}</span>
			</div>
		</div>
	</section>

	<!-- ==========================================
	    MAIN BODY GRID (TIMELINE & DELIVERABLES)
	    ========================================== -->
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
		
		<!-- Interactive Timeline -->
		<div class="lg:col-span-2 space-y-8 text-left">
			<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
				Linimasa & Milestone Proyek
			</h3>

			<div class="relative border-l border-zinc-100 dark:border-zinc-800/80 ml-3 pl-8 space-y-8 py-2">
				
				<!-- Phase 1 -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{['consulted', 'in_progress', 'review', 'completed'].includes(project.status) 
							? 'bg-zinc-800 dark:bg-zinc-200' 
							: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 1: Konsultasi & Perencanaan</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{['consulted', 'in_progress', 'review', 'completed'].includes(project.status)
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
									: 'bg-amber-500/10 text-amber-500'}">
								{['consulted', 'in_progress', 'review', 'completed'].includes(project.status) ? 'Selesai' : 'Aktif'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Sesi konsultasi, penyusunan spesifikasi teknis, penentuan prioritas fitur, dan persetujuan penawaran harga.
						</p>
					</div>
				</div>

				<!-- Phase 2 -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{['in_progress', 'review', 'completed'].includes(project.status) 
							? 'bg-zinc-800 dark:bg-zinc-200' 
							: project.status === 'consulted' ? 'bg-amber-500' : 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 2: Proses Pengembangan</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{project.status === 'in_progress'
									? 'bg-blue-500/10 text-blue-500'
									: ['review', 'completed'].includes(project.status)
										? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
										: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{project.status === 'in_progress' ? 'Sedang Berjalan' : ['review', 'completed'].includes(project.status) ? 'Selesai' : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Proses penulisan kode backend dan database, implementasi antarmuka pengguna (UI), dan integrasi modul pihak ketiga.
						</p>
					</div>
				</div>

				<!-- Phase 3 -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{['completed'].includes(project.status) 
							? 'bg-zinc-800 dark:bg-zinc-200' 
							: project.status === 'review' ? 'bg-amber-500' : 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 3: Pengujian & Tinjauan Klien</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{project.status === 'review'
									? 'bg-amber-500/10 text-amber-500'
									: project.status === 'completed'
										? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
										: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{project.status === 'review' ? 'Review Staging' : project.status === 'completed' ? 'Selesai' : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-455 leading-relaxed max-w-lg font-light">
							Tahap User Acceptance Testing (UAT) di server staging, perbaikan bug berdasarkan umpan balik, dan audit keamanan.
						</p>
					</div>
				</div>

				<!-- Phase 4 -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{project.status === 'completed' ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-855 dark:text-zinc-200">Fase 4: Peluncuran & Penyerahan</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{project.status === 'completed'
									? 'bg-emerald-500/10 text-emerald-500'
									: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{project.status === 'completed' ? 'Selesai' : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-455 leading-relaxed max-w-lg font-light">
							Migrasi data ke server produksi, penyerahan repositori kode sumber, penyampaian dokumentasi teknis, dan aktivasi garansi.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Column: Finance, Assets & Deliverables -->
		<div class="space-y-6">
			<!-- Keuangan & Invoice (Top of Right Column) -->
			<div class="space-y-3 text-left">
				<div class="flex items-center justify-between">
					<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
						<Coins class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
						Keuangan & Invoice
					</h3>
					<span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase border
						{project.paymentStatus === 'settled' 
							? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
							: project.paymentStatus === 'dp_paid'
								? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
								: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'}">
						{project.paymentStatus === 'settled' ? 'Lunas' : project.paymentStatus === 'dp_paid' ? 'DP Dibayar' : 'Belum Lunas'}
					</span>
				</div>

				<div class="border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10 p-5 rounded-xl space-y-4 text-xs">
					<div>
						<span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Nilai Kontrak</span>
						<div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
							{project.quotedPrice ? `Rp ${Number(project.quotedPrice).toLocaleString('id-ID')}` : 'Menunggu Penawaran'}
						</div>
					</div>

					<div class="flex justify-between items-center py-2 border-t border-zinc-100 dark:border-zinc-800/50">
						<span class="text-zinc-500 dark:text-zinc-400 font-medium">Ketentuan DP</span>
						<span class="text-zinc-800 dark:text-zinc-200 font-semibold">{project.downPaymentRequirement || '30% DP'}</span>
					</div>

					<div class="flex justify-between items-center py-1 border-t border-zinc-100 dark:border-zinc-800/50">
						<span class="text-zinc-500 dark:text-zinc-400 font-medium">Status Bayar</span>
						<span class="text-zinc-800 dark:text-zinc-200 font-semibold">
							{project.paymentStatus === 'settled' ? 'Lunas (100%)' : project.paymentStatus === 'dp_paid' ? 'DP Terbayar' : 'Belum Lunas'}
						</span>
					</div>
				</div>
			</div>

			<!-- Assets & Link Deliverable -->
			<div class="space-y-3 text-left">
				<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
					Aset & Link Deliverable
				</h3>

				<div class="border border-zinc-100 dark:border-zinc-800/80 p-6 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10 space-y-6">
					
					<!-- Links List -->
					<div class="space-y-3">
						{#if project.stagingUrl}
							<a
								href={project.stagingUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg transition-all text-xs font-medium"
							>
								<span class="flex items-center gap-2">
									<Rocket class="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
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
								class="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg transition-all text-xs font-medium"
							>
								<span class="flex items-center gap-2">
									<FileText class="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
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
								class="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg transition-all text-xs font-medium"
							>
								<span class="flex items-center gap-2">
									<Github class="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
									Source Code (Git)
								</span>
								<ExternalLink class="w-3.5 h-3.5 opacity-60" />
							</a>
						{/if}

						{#if !project.stagingUrl && !project.proposalUrl && !project.repoLink}
							<div class="text-center py-6 text-zinc-400 dark:text-zinc-500 text-xs font-light italic">
								Link deliverable belum diterbitkan.
							</div>
						{/if}
					</div>

					<!-- Secure credentials vault -->
					{#if project.stagingUrl}
						<div class="pt-4 border-t border-zinc-105 dark:border-zinc-800/80 space-y-3">
							<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
								<Lock size={12} class="text-zinc-400 dark:text-zinc-500" /> Staging Secure Access
							</span>
							<div class="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 text-xs space-y-2 relative">
								<button
									onclick={() => revealCredentials = !revealCredentials}
									class="absolute top-3.5 right-3.5 text-zinc-400 hover:text-zinc-700 transition-colors"
									title={revealCredentials ? "Hide credentials" : "Show credentials"}
								>
									{#if revealCredentials}
										<EyeOff size={13} />
									{:else}
										<Eye size={13} />
									{/if}
								</button>

								<div>
									<span class="text-[9px] text-zinc-500 dark:text-zinc-500 block">Staging User</span>
									<span class="text-zinc-750 dark:text-zinc-200 select-all font-mono">admin@hamasazizan.com</span>
								</div>
								<div>
									<span class="text-[9px] text-zinc-500 dark:text-zinc-500 block">Password</span>
									<span class="text-zinc-750 dark:text-zinc-200 select-all font-mono">
										{revealCredentials ? "ha_agency_staging_2026!" : "••••••••••••••••"}
									</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<hr class="border-zinc-100 dark:border-zinc-800/80" />

	<!-- ==========================================
	    LOGS & TIM PARTNER
	    ========================================== -->
	<section class="grid grid-cols-1 md:grid-cols-2 gap-12">
		
		<!-- Activity log notes -->
		<div class="space-y-4 text-left">
			<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
				Catatan & Log Aktivitas
			</h3>

			<div class="space-y-4">
				{#if project.adminNotes}
					<div class="p-5 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-xl space-y-2">
						<span class="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Catatan PM ({formatDate(project.updatedAt)})</span>
						<p class="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed font-light break-words whitespace-pre-wrap">
							{project.adminNotes}
						</p>
					</div>
				{/if}

				<div class="p-5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 bg-zinc-50/10 dark:bg-transparent">
					<span class="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Status Terakhir</span>
					<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
						Proyek diperbarui ke status <span class="text-zinc-800 dark:text-zinc-200 font-semibold">{getHealthIndicator(project.status).label}</span> pada {formatDate(project.updatedAt)}.
					</p>
				</div>
			</div>
		</div>

		<!-- Contact PM -->
		<div class="space-y-4 text-left">
			<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
				Project Manager
			</h3>

			<div class="border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10 p-5 rounded-xl space-y-4">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0 select-none">
						<User size={16} />
					</div>
					<div>
						<h4 class="text-xs font-bold text-zinc-800 dark:text-zinc-200">Hamas Azizan</h4>
						<span class="text-[8px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mt-0.5">PM & Lead Engineer</span>
					</div>
				</div>

				<div class="pt-3 border-t border-zinc-100 dark:border-zinc-800/50 space-y-2.5 font-light text-xs">
					<a
						href="mailto:contact@hamasazizan.com"
						class="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
					>
						<Mail class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
						contact@hamasazizan.com
					</a>
					
					<div class="flex items-start gap-2 text-zinc-500 dark:text-zinc-400 leading-relaxed">
						<Clock class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
						<div>
							<span class="text-zinc-500 dark:text-zinc-500 block">Office Hours:</span>
							<span class="text-zinc-400 dark:text-zinc-500 block">Mon - Fri, 09:00 - 17:00 WIB</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

</div>
