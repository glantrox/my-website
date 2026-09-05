<script lang="ts">
	import { 
		Clock, 
		CheckCircle2, 
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
		ChevronDown,
		Coins,
		CreditCard,
		Copy,
		Check,
		Upload,
		Image as ImageIcon,
		Maximize2,
		Trash2,
		X,
		FileCheck,
		Layers,
		Code2,
		ShieldCheck,
		Download,
		Sparkles,
		Figma,

        Phone

	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/entities/toast';
	import Spinner from '$lib/components/ui/spinner.svelte';
	import { fade } from 'svelte/transition';

	// Retrieve data from Svelte 5 props
	let { data } = $props();
	const project = $derived(data.project);

	// Derived state properties
	const percentage = $derived(getCompletionPercentage(project.status));
	const health = $derived(getHealthIndicator(project.status));

	// Milestone payment calculations
	function parseDpPercentage(req: string | undefined): number {
		if (!req) return 0.3; // Default 30%
		const lower = req.toLowerCase();
		if (lower.includes('full') || lower.includes('100%') || lower.includes('lunas')) return 1.0;
		const match = req.match(/(\d+)%/);
		if (match) return parseInt(match[1], 10) / 100;
		return 0.3;
	}

	const dpRatio = $derived(parseDpPercentage(project.downPaymentRequirement));
	const isFullPaymentScheme = $derived(dpRatio >= 0.99);
	const dpPercentDisplay = $derived(Math.round(dpRatio * 100));
	const dpAmount = $derived(Math.round((project.quotedPrice || 0) * dpRatio));
	const finalPaymentRatio = $derived(Math.max(0, 1 - dpRatio));
	const finalPaymentPercentDisplay = $derived(Math.round(finalPaymentRatio * 100));
	const finalPaymentAmount = $derived(Math.max(0, (project.quotedPrice || 0) - dpAmount));

	// Current active phase (1, 2, 3, or 4)
	const currentPhase = $derived.by(() => {
		if (project.status === 'completed') return 4;
		if (project.status === 'review') return 3;
		if (project.status === 'in_progress') return 2;
		// If initial payment is verified (dp_paid or settled)
		if (project.milestonePaymentVerified || project.paymentStatus === 'dp_paid' || project.paymentStatus === 'settled') {
			return 2;
		}
		return 1;
	});

	// State for payment scheme switcher
	let showSchemeModal = $state(false);
	let isSchemeDropdownOpen = $state(false);
	let selectedScheme = $state<'30% DP' | '50% DP' | 'Full 100%'>('30% DP');
	let isUpdatingScheme = $state(false);

	const currentSchemeKey = $derived<'30% DP' | '50% DP' | 'Full 100%'>(
		isFullPaymentScheme ? 'Full 100%' : (dpRatio === 0.5 ? '50% DP' : '30% DP')
	);

	function handleSwitchSchemeEnhance() {
		isUpdatingScheme = true;
		const toastId = toast.loading('Memperbarui skema pembayaran...');
		return async ({ result, update }: any) => {
			isUpdatingScheme = false;
			showSchemeModal = false;
			isSchemeDropdownOpen = false;
			await update();
			if (result.type === 'success') {
				toast.update(toastId, {
					type: 'success',
					message: 'Skema pembayaran berhasil diperbarui!',
					duration: 4000
				});
			} else {
				toast.update(toastId, {
					type: 'error',
					message: result.data?.error || 'Gagal mengubah skema pembayaran.',
					duration: 4000
				});
			}
		};
	}

	// State for credentials mask
	let revealCredentials = $state(false);

	// Bank Copy State
	let copiedBank = $state<string | null>(null);

	function copyToClipboard(text: string, bankKey: string) {
		navigator.clipboard.writeText(text);
		copiedBank = bankKey;
		toast.success(`Nomor ${bankKey.toLowerCase().includes('gopay') ? 'GOPAY' : 'rekening ' + bankKey} berhasil disalin!`);
		setTimeout(() => {
			if (copiedBank === bankKey) copiedBank = null;
		}, 2500);
	}

	// Proof Upload States
	let uploadPaymentType = $state<'dp' | 'final'>('dp');
	let isUploadingProof = $state(false);
	let isDeletingProof = $state(false);
	let isApprovingBrd = $state(false);
	let isApprovingUat = $state(false);
	let showUploadModal = $state(false);
	let showImageLightbox = $state(false);
	let lightboxImageUrl = $state<string | null>(null);
	let previewImage = $state<string | null>(null);
	let selectedFileName = $state<string>('');
	let selectedFileSize = $state<string>('');
	let senderBank = $state('GOPAY');
	let senderName = $state('');
	let uploadNotes = $state('');

	function openUploadModal(type: 'dp' | 'final') {
		uploadPaymentType = type;
		previewImage = null;
		selectedFileName = '';
		selectedFileSize = '';
		senderBank = 'GOPAY';
		senderName = '';
		uploadNotes = '';
		showUploadModal = true;
	}

	function openLightbox(url: string) {
		lightboxImageUrl = url;
		showImageLightbox = true;
	}

	function handleApproveBrdEnhance() {
		isApprovingBrd = true;
		const toastId = toast.loading('Menyetujui dokumen BRD...');
		return async ({ result, update }: any) => {
			isApprovingBrd = false;
			await update();
			if (result.type === 'success') {
				toast.update(toastId, {
					type: 'success',
					message: 'Dokumen BRD & spesifikasi proyek berhasil disetujui!',
					duration: 4000
				});
			} else {
				toast.update(toastId, {
					type: 'error',
					message: result.data?.error || 'Gagal menyetujui dokumen BRD.',
					duration: 4000
				});
			}
		};
	}

	function handleApproveUatEnhance() {
		isApprovingUat = true;
		const toastId = toast.loading('Menyetujui hasil UAT...');
		return async ({ result, update }: any) => {
			isApprovingUat = false;
			await update();
			if (result.type === 'success') {
				toast.update(toastId, {
					type: 'success',
					message: 'Hasil UAT berhasil disetujui! Proyek siap diluncurkan.',
					duration: 4000
				});
			} else {
				toast.update(toastId, {
					type: 'error',
					message: result.data?.error || 'Gagal menyetujui hasil testing.',
					duration: 4000
				});
			}
		};
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			selectedFileName = file.name;
			selectedFileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					previewImage = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				previewImage = null;
			}
		}
	}

	function handleUploadEnhance() {
		isUploadingProof = true;
		const toastId = toast.loading('Mengunggah bukti transfer...');
		return async ({ result, update }: any) => {
			isUploadingProof = false;
			await update();
			if (result.type === 'success') {
				toast.update(toastId, {
					type: 'success',
					message: 'Bukti transfer berhasil diunggah! Kami akan segera memverifikasinya.',
					duration: 4000
				});
				showUploadModal = false;
				previewImage = null;
				selectedFileName = '';
			} else {
				toast.update(toastId, {
					type: 'error',
					message: result.data?.error || 'Gagal mengunggah bukti transfer. Pastikan file valid.',
					duration: 4000
				});
			}
		};
	}

	function handleDeleteProofEnhance() {
		isDeletingProof = true;
		const toastId = toast.loading('Menghapus bukti transfer...');
		return async ({ result, update }: any) => {
			isDeletingProof = false;
			await update();
			if (result.type === 'success') {
				toast.update(toastId, {
					type: 'success',
					message: 'Bukti transfer berhasil dihapus.',
					duration: 3000
				});
			} else {
				toast.update(toastId, {
					type: 'error',
					message: 'Gagal menghapus bukti transfer.',
					duration: 4000
				});
			}
		};
	}

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

	function formatDateTime(dateStr: string | null | undefined): string {
		if (!dateStr) return '—';
		try {
			const d = new Date(dateStr);
			return d.toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			}) + ', ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
		} catch {
			return String(dateStr);
		}
	}
</script>

<svelte:head>
	<title>Project Status — {project.projectTitle || 'Portal Klien'}</title>
</svelte:head>

<form id="approve-brd-form" method="POST" action="?/approveBrd" use:enhance={handleApproveBrdEnhance}></form>
<form id="approve-uat-form" method="POST" action="?/approveUat" use:enhance={handleApproveUatEnhance}></form>

<div class="max-w-5xl mx-auto px-6 py-10 md:py-16 space-y-10 md:space-y-12 selection:bg-zinc-100 dark:selection:bg-zinc-800">
	
	<!-- ==========================================
	    BREADCRUMB & HEADER
	    ========================================== -->
	<header class="space-y-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
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
				{#if project.companyName}
					<span class="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
						<Building2 size={14} class="text-zinc-400" />
						{project.companyName}
					</span>
				{/if}
			</div>
		</div>
	</header>

	<!-- ==========================================
	    TOTAL CONTRACT VALUE (If Quoted)
	    ========================================== -->
	{#if project.quotedPrice}
		<section class="p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="space-y-1">
				<span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
					Total Nilai Kontrak Proyek
				</span>
				<div class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
					Rp {Number(project.quotedPrice).toLocaleString('id-ID')}
				</div>
			</div>
			<div class="flex items-center gap-2">
				<a
					href="/status/{project.id}/invoice"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-150 group"
				>
					<Download size={14} class="transition-transform group-hover:-translate-y-0.5 text-zinc-300 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-900" />
					<span>Download Invoice</span>
				</a>
			</div>
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
				
				<!-- ==========================================
				    FASE 1: KONSULTASI & PRE-DEVELOPMENT
				    ========================================== -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{currentPhase === 1 
							? 'bg-amber-500 ring-4 ring-amber-500/20' 
							: currentPhase > 1 
								? 'bg-zinc-800 dark:bg-zinc-200' 
								: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-4 transition-all duration-300 {currentPhase !== 1 ? 'filter blur-[2.5px] opacity-40 select-none pointer-events-none' : ''}">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 1: Konsultasi & Pre-Development</h4>
							
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Sesi konsultasi, penyusunan spesifikasi teknis, penentuan prioritas fitur, persetujuan penawaran harga, dan pembayaran Down Payment (DP).
						</p>

						<!-- DP Payment Card in Phase 1 -->
						{#if project.quotedPrice}
							<div class="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4 text-xs">
								<!-- Milestone DP Header -->
								<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60 gap-2">
									<div>
										
										<div class="text-2xl font-bold  text-zinc-900 dark:text-white tracking-tight mt-0.5">
											Rp {dpAmount.toLocaleString('id-ID')}
										</div>
										<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-light mt-0.5">
											{isFullPaymentScheme 
												? `Pembayaran penuh 100% di muka (Rp ${Number(project.quotedPrice).toLocaleString('id-ID')})`
												: `Uang muka ${dpPercentDisplay}% dari total nilai kontrak (Rp ${Number(project.quotedPrice).toLocaleString('id-ID')})`}
										</p>
									</div>

									<div>
										{#if project.paymentStatus === 'settled'}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
												<CheckCircle2 size={14} />
												{isFullPaymentScheme ? 'Pembayaran Penuh Disetujui' : 'Pembayaran DP Disetujui'}
											</span>
										{:else if project.paymentStatus === 'dp_paid'}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
												<CheckCircle2 size={14} />
												Pembayaran DP Disetujui
											</span>
										{:else if project.paymentProofUrl}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
												<Clock size={14} />
												Menunggu Verifikasi Admin
											</span>
										{:else}
											<!-- Dropdown Ubah Skema Pembayaran -->
											<div class="relative inline-block text-left">
												<button
													type="button"
													onclick={() => isSchemeDropdownOpen = !isSchemeDropdownOpen}
													class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-500 dark:hover:border-blue-500 text-zinc-800 dark:text-zinc-200 shadow-2xs transition-all cursor-pointer group"
													title="Klik untuk mengubah skema pembayaran"
												>
													<CreditCard size={13} class="text-blue-500 shrink-0" />
													<span>Skema: <strong class="font-bold text-blue-600 dark:text-blue-400">{currentSchemeKey}</strong></span>
													<ChevronDown size={13} class="text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-200 {isSchemeDropdownOpen ? 'rotate-180' : ''}" />
												</button>

												{#if isSchemeDropdownOpen}
													<!-- Click-outside backdrop -->
													<div 
														class="fixed inset-0 z-20" 
														onclick={() => isSchemeDropdownOpen = false}
													></div>

													<!-- Dropdown Panel -->
													<div 
														class="absolute right-0 mt-1.5 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-2 z-30 space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
													>
														<div class="px-2.5 py-1 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
															<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
																Ubah Skema Pembayaran
															</span>
															<button
																type="button"
																onclick={() => { isSchemeDropdownOpen = false; selectedScheme = currentSchemeKey; showSchemeModal = true; }}
																class="text-[9px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
															>
																Rincian
															</button>
														</div>

														<!-- Option 1: 30% DP -->
														<form method="POST" action="?/switchPaymentScheme" use:enhance={handleSwitchSchemeEnhance}>
															<input type="hidden" name="scheme" value="30% DP" />
															<button
																type="submit"
																disabled={isUpdatingScheme}
																class="w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 group cursor-pointer
																{currentSchemeKey === '30% DP' ? 'bg-blue-50/70 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-500/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-transparent'}"
															>
																<div class="space-y-0.5 min-w-0">
																	<div class="flex items-center gap-1.5">
																		<span class="text-xs">DP 30% (Standar)</span>
																		{#if currentSchemeKey === '30% DP'}
																			<Check size={13} class="text-blue-600 dark:text-blue-400 shrink-0" />
																		{/if}
																	</div>
																	<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
																		Bayar Rp {Math.round((project.quotedPrice || 0) * 0.3).toLocaleString('id-ID')} di awal · Sisa 70%
																	</p>
																</div>
															</button>
														</form>

														<!-- Option 2: 50% DP -->
														<form method="POST" action="?/switchPaymentScheme" use:enhance={handleSwitchSchemeEnhance}>
															<input type="hidden" name="scheme" value="50% DP" />
															<button
																type="submit"
																disabled={isUpdatingScheme}
																class="w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 group cursor-pointer
																{currentSchemeKey === '50% DP' ? 'bg-blue-50/70 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-500/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-transparent'}"
															>
																<div class="space-y-0.5 min-w-0">
																	<div class="flex items-center gap-1.5">
																		<span class="text-xs">DP 50% (Bagi Rata)</span>
																		{#if currentSchemeKey === '50% DP'}
																			<Check size={13} class="text-blue-600 dark:text-blue-400 shrink-0" />
																		{/if}
																	</div>
																	<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
																		Bayar Rp {Math.round((project.quotedPrice || 0) * 0.5).toLocaleString('id-ID')} di awal · Sisa 50%
																	</p>
																</div>
															</button>
														</form>

														<!-- Option 3: Full 100% -->
														<form method="POST" action="?/switchPaymentScheme" use:enhance={handleSwitchSchemeEnhance}>
															<input type="hidden" name="scheme" value="Full 100%" />
															<button
																type="submit"
																disabled={isUpdatingScheme}
																class="w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 group cursor-pointer
																{currentSchemeKey === 'Full 100%' ? 'bg-blue-50/70 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-500/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-transparent'}"
															>
																<div class="space-y-0.5 min-w-0">
																	<div class="flex items-center gap-1.5">
																		<span class="text-xs">Bayar Penuh 100%</span>
																		{#if currentSchemeKey === 'Full 100%'}
																			<Check size={13} class="text-blue-600 dark:text-blue-400 shrink-0" />
																		{/if}
																	</div>
																	<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
																		Bayar Rp {Number(project.quotedPrice || 0).toLocaleString('id-ID')} lunas di muka
																	</p>
																</div>
															</button>
														</form>
													</div>
												{/if}
											</div>
										{/if}
									</div>
								</div>

								{#if project.paymentStatus !== 'settled' && project.paymentStatus !== 'dp_paid'}
									<!-- Bank Accounts List -->
									<div class="space-y-2">
										<div class="flex items-center justify-between text-[10px] text-zinc-500">
											<span class="font-bold uppercase tracking-wider flex items-center gap-1.5">
												<CreditCard size={12} class="text-zinc-400" />
												Rekening {isFullPaymentScheme ? 'Pembayaran Penuh' : 'Pembayaran DP'}
											</span>
											<span>a/n Hamas Azizan</span>
										</div>

										<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<!-- GOPAY -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-sky-600 dark:text-sky-400 block">GOPAY</span>
													<span class=" text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">0895630354422</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('0895630354422', 'GOPAY')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin GOPAY"
												>
													{#if copiedBank === 'GOPAY'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>

											<!-- BANK JAGO -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">BANK JAGO</span>
													<span class=" text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">1089 5642 3736</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('108956423736', 'Bank Jago')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin Bank Jago"
												>
													{#if copiedBank === 'Bank Jago'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>
										</div>
									</div>
								{/if}

								<!-- Upload Proof Feature / Status for DP / Full Payment -->
								{#if project.paymentProofUrl}
									<div class="p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3">
										<div class="flex items-center gap-3 min-w-0">
											<button
												type="button"
												onclick={() => openLightbox(project.paymentProofUrl!)}
												class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative group cursor-pointer bg-zinc-100 dark:bg-zinc-800"
												title="Perbesar bukti"
											>
												<img
													src={project.paymentProofUrl}
													alt="Bukti Pembayaran"
													class="w-full h-full object-cover group-hover:scale-105 transition-transform"
												/>
												<div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
													<Maximize2 size={13} />
												</div>
											</button>
											<div class="min-w-0 space-y-0.5">
												<div class="flex items-center gap-1.5">
													<span class="font-bold text-zinc-800 dark:text-zinc-200 truncate text-xs">
														Bukti Transfer {isFullPaymentScheme ? 'Penuh' : 'DP'} ({project.paymentProofBank || 'Bank Transfer'})
													</span>
												</div>
												<p class="text-[10px] text-zinc-400 truncate">
													Pengirim: {project.paymentProofSenderName || project.contactName} · {formatDateTime(project.paymentProofUploadedAt)}
												</p>
											</div>
										</div>

										{#if project.paymentStatus !== 'settled' && project.paymentStatus !== 'dp_paid'}
											<button
												type="button"
												onclick={() => openUploadModal('dp')}
												class="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
											>
												Unggah Ulang
											</button>
										{/if}
									</div>
								{:else}
									<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
										<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
											Lakukan transfer {isFullPaymentScheme ? 'pembayaran penuh' : 'DP'} sesuai nominal, lalu unggah bukti transfer:
										</p>
										<button
											type="button"
											onclick={() => openUploadModal('dp')}
											class="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
										>
											<Upload size={13} />
											Unggah Bukti {isFullPaymentScheme ? 'Pembayaran Penuh' : 'DP'}
										</button>
									</div>
								{/if}
							</div>
						{/if}

						<!-- BRD Creation & Sign-off Card in Phase 1 -->
						<div class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
									<FileText size={13} class="text-blue-500" />
									Business Requirements Document (BRD)
								</span>
								{#if project.brdApprovedAt}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
										Disetujui Klien
									</span>
								{:else if project.brdUrl}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
										Menunggu Persetujuan
									</span>
								{:else}
									<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
										Dalam Pembuatan
									</span>
								{/if}
							</div>

							{#if project.brdUrl}
								<div class="space-y-3">
									<p class="text-xs text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
										Dokumen BRD telah disusun oleh PM & tim engineer. Silakan tinjau spesifikasi sistem dan berikan persetujuan resmi:
									</p>

									<div class="flex flex-wrap items-center gap-3">
										<a
											href={project.brdUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
										>
											<ExternalLink size={12} />
											Buka Dokumen BRD
										</a>

										{#if !project.brdApprovedAt}
											<button
												type="submit"
												form="approve-brd-form"
												disabled={isApprovingBrd}
												class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{#if isApprovingBrd}
													<Spinner size={12} class="text-white" />
													Menyetujui...
												{:else}
													<CheckCircle2 size={13} />
													Setujui BRD & Spesifikasi
												{/if}
											</button>
										{:else}
											<span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
												<Check size={13} />
												Disetujui pada: {formatDateTime(project.brdApprovedAt)}
											</span>
										{/if}
									</div>
								</div>
							{:else if project.paymentStatus === 'dp_paid' || project.paymentStatus === 'settled'}
								<p class="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
									Pembayaran DP telah disetujui. Tim kami sedang menyelesaikan penyusunan dokumen BRD dan akan segera menautkannya di sini untuk Anda tanda tangani.
								</p>
							{:else}
								<p class="text-xs text-zinc-400 dark:text-zinc-500 font-light italic leading-relaxed">
									Dokumen BRD akan mulai disusun oleh developer setelah pembayaran DP 30% diverifikasi.
								</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- ==========================================
				    FASE 2: PROSES PENGEMBANGAN (SUB-MILESTONES 2.1 - 2.3)
				    ========================================== -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{currentPhase === 2
							? 'bg-blue-500 ring-4 ring-blue-500/20'
							: currentPhase > 2
								? 'bg-zinc-800 dark:bg-zinc-200'
								: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-4 transition-all duration-300 {currentPhase !== 2 ? 'filter blur-[2.5px] opacity-40 select-none pointer-events-none' : ''}">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 2: Proses Pengembangan</h4>
							
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Tahap implementasi teknis yang terbagi dalam 3 tahapan kunci: finalisasi dokumen spesifikasi, pembuatan desain interaktif, dan penulisan kode program.
						</p>

						<!-- Sub-Milestones Bento Box -->
						<div class="grid grid-cols-1 gap-3 pt-1">
							<!-- 2.1 BRD Finalized -->
							<div class="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 space-y-2.5">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
										<FileCheck size={15} class="text-blue-500" />
										Milestone 2.1: Business Requirements Document (BRD)
									</span>
									{#if project.brdApprovedAt}
										<span class="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
											Approved
										</span>
									{:else if project.brdUrl}
										<span class="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
											In Review
										</span>
									{:else}
										<span class="text-[9px] font-bold uppercase text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
											Pending
										</span>
									{/if}
								</div>
								<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
									Dokumen spesifikasi arsitektur teknis, daftar kebutuhan modul, skema database, dan target implementasi.
								</p>
								{#if project.brdUrl}
									<a
										href={project.brdUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-0.5"
									>
										<ExternalLink size={12} />
										Buka BRD Dokumen
									</a>
								{/if}
							</div>

							<!-- 2.2 UI/UX Making -->
							<div class="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 space-y-2.5">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
										<Figma size={15} class="text-purple-500" />
										Milestone 2.2: UI/UX Making & Prototype
									</span>
									{#if project.figmaUrl}
										<span class="text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
											Design Ready
										</span>
									{:else}
										<span class="text-[9px] font-bold uppercase text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
											{['in_progress', 'review', 'completed'].includes(project.status) ? 'Dalam Pengerjaan' : 'Mendatang'}
										</span>
									{/if}
								</div>
								<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
									Perancangan antarmuka pengguna interaktif (Figma prototype), pemilihan palet warna, tipografi, dan design system.
								</p>
								{#if project.figmaUrl}
									<a
										href={project.figmaUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-400 font-semibold text-xs transition-colors"
									>
										<Figma size={13} />
										Buka Figma Prototype & Design System
										<ExternalLink size={11} />
									</a>
								{:else}
									<span class="text-[11px] text-zinc-400 italic">Tautan Figma belum diterbitkan oleh desainer.</span>
								{/if}
							</div>

							<!-- 2.3 Code Writing -->
							<div class="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 space-y-3">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
										<Code2 size={15} class="text-emerald-500" />
										Milestone 2.3: Code Writing & Infrastructure
									</span>
									<span class="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
										Active Sprint
									</span>
								</div>
								<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
									Pemrograman frontend, integrasi backend API, koneksi basis data, dan konfigurasi environment staging untuk peninjauan langsung.
								</p>

								<!-- Code writing attachments -->
								<div class="flex flex-wrap items-center gap-2 pt-1">
									{#if project.repoLink}
										<a
											href={project.repoLink}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-200 font-semibold hover:border-zinc-400 transition-colors"
										>
											<Github size={13} />
											Source Code (Git)
											<ExternalLink size={11} />
										</a>
									{/if}

									{#if project.stagingUrl}
										<a
											href={project.stagingUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-colors"
										>
											<Rocket size={13} />
											Server Staging
											<ExternalLink size={11} />
										</a>
									{/if}

									{#if project.managementBoardUrl}
										<a
											href={project.managementBoardUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-200 font-semibold hover:border-zinc-400 transition-colors"
										>
											<Layers size={13} />
											Task Board (Linear/Jira)
											<ExternalLink size={11} />
										</a>
									{/if}

									{#if !project.repoLink && !project.stagingUrl && !project.managementBoardUrl}
										<span class="text-[11px] text-zinc-400 italic">Repositori dan server staging sedang disiapkan engineer.</span>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- ==========================================
				    FASE 3: PENGUJIAN & TINJAUAN KLIEN (UAT)
				    ========================================== -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{currentPhase === 3
							? 'bg-amber-500 ring-4 ring-amber-500/20'
							: currentPhase > 3
								? 'bg-zinc-800 dark:bg-zinc-200'
								: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-4 transition-all duration-300 {currentPhase !== 3 ? 'filter blur-[2.5px] opacity-40 select-none pointer-events-none' : ''}">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 3: Pengujian & Tinjauan Klien (QA / UAT)</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{currentPhase === 3
									? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
									: currentPhase > 3
										? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
										: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{currentPhase === 3 ? 'Review Staging' : currentPhase > 3 ? 'Selesai' : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Tahap User Acceptance Testing (UAT) di server staging, pengujian akun demo, iterasi revisi feedback, dan persetujuan peluncuran resmi.
						</p>

						<!-- Staging Credentials Vault Card (Active only in Fase 3 Review & Fase 4 Completed) -->
						{#if ['review', 'completed'].includes(project.status)}
							<div class="p-5 rounded-2xl border border-orange-500/25 bg-orange-500/[0.02] dark:bg-orange-500/[0.03] space-y-4">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
										<Lock size={14} />
										Akses Server Staging & Kredensial Demo
									</span>
									<div class="flex items-center gap-2">
										<span class="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
											Putaran Revisi: Round {project.revisionRound || 1} / {project.revisionMaxRounds || 3}
										</span>
									</div>
								</div>

								{#if project.stagingUrl}
									<div class="flex items-center gap-3">
										<a
											href={project.stagingUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
										>
											<Rocket size={13} />
											Buka Web Staging
											<ExternalLink size={12} />
										</a>

										{#if project.feedbackTrackerUrl}
											<a
												href={project.feedbackTrackerUrl}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs hover:border-zinc-400 transition-colors"
											>
												<ExternalLink size={12} />
												Feedback / Loom Tracker
											</a>
										{/if}
									</div>
								{/if}

								<!-- Credentials Box (Shown when developer provides staging credentials) -->
								{#if project.stagingCredentialsEmail || project.stagingCredentialsPassword}
									<div class="p-3.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
										<div class="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
											<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Akun Pengujian (Demo)</span>
											<button
												type="button"
												onclick={() => (revealCredentials = !revealCredentials)}
												class="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
											>
												{#if revealCredentials}
													<EyeOff size={13} /> Sembunyikan Sandi
												{:else}
													<Eye size={13} /> Tampilkan Sandi
												{/if}
											</button>
										</div>

										<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
											<div>
												<span class="text-[9px] font-bold uppercase text-zinc-400 block">Role</span>
												<span class="font-medium text-zinc-800 dark:text-zinc-200">{project.stagingCredentialsRole || 'Client / QA Tester'}</span>
											</div>
											<div>
												<span class="text-[9px] font-bold uppercase text-zinc-400 block">Email Pengujian</span>
												<span class="font-mono text-zinc-800 dark:text-zinc-200 select-all font-semibold">
													{project.stagingCredentialsEmail || '—'}
												</span>
											</div>
											<div>
												<span class="text-[9px] font-bold uppercase text-zinc-400 block">Password</span>
												<div class="flex items-center gap-2">
													<span class="font-mono text-zinc-800 dark:text-zinc-200 select-all font-semibold">
														{revealCredentials ? (project.stagingCredentialsPassword || '—') : '••••••••••••••••'}
													</span>
													{#if project.stagingCredentialsPassword}
														<button
															type="button"
															onclick={() => copyToClipboard(project.stagingCredentialsPassword!, 'Password')}
															class="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
															title="Salin password"
														>
															<Copy size={12} />
														</button>
													{/if}
												</div>
											</div>
										</div>
									</div>
								{/if}

								<!-- UAT Sign-off Action Block -->
								<div class="pt-2 border-t border-orange-500/15">
									{#if project.uatApprovedAt}
										<div class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
											<CheckCircle2 size={16} class="text-emerald-600 dark:text-emerald-400 shrink-0" />
											<span class="text-xs font-semibold">
												Hasil testing (UAT) telah disetujui pada: {formatDateTime(project.uatApprovedAt)}. Proyek siap melangkah ke peluncuran & pelunasan akhir!
											</span>
										</div>
									{:else if project.status === 'review'}
										<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
											<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
												Jika seluruh fitur telah sesuai dengan dokumen BRD dan siap untuk live:
											</p>
											<button
												type="submit"
												form="approve-uat-form"
												disabled={isApprovingUat}
												class="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
											>
												{#if isApprovingUat}
													<Spinner size={13} class="text-white" />
													Menyetujui...
												{:else}
													<CheckCircle2 size={14} />
													Setujui Hasil Testing (UAT Sign-off)
												{/if}
											</button>
										</div>
									{/if}
								</div>
							</div>
						{:else}
							<!-- Placeholder info when project is still in earlier phases -->
							<div class="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2.5">
								<Lock size={14} class="shrink-0 text-zinc-400" />
								<span>Akses server staging dan kredensial login akun demo akan diterbitkan otomatis saat proyek memasuki <strong>Fase 3 (Pengujian & Tinjauan Klien)</strong>.</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- ==========================================
				    FASE 4: PELUNCURAN & PENYERAHAN
				    ========================================== -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{currentPhase === 4
							? 'bg-emerald-500 ring-4 ring-emerald-500/20'
							: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-4 transition-all duration-300 {currentPhase !== 4 ? 'filter blur-[2.5px] opacity-40 select-none pointer-events-none' : ''}">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 4: Peluncuran & Penyerahan</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{currentPhase === 4
									? (project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20')
									: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{currentPhase === 4 ? (project.status === 'completed' ? 'Selesai' : 'Tahap Pembayaran Final') : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Migrasi data ke server produksi, penyerahan repositori kode sumber, penyampaian dokumentasi teknis, dan aktivasi garansi penuh.
						</p>

						<!-- Final Payment Settlement Card -->
						{#if ['review', 'completed'].includes(project.status) && project.quotedPrice}
							<div class="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4 text-xs">
								<!-- Contract Summary & Full Payment Status -->
								<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60 gap-2">
									<div>
										<span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
											{isFullPaymentScheme ? 'Status Pelunasan Kontrak' : `Tagihan Pelunasan Akhir (${finalPaymentPercentDisplay}%)`}
										</span>
										<div class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-0.5">
											{isFullPaymentScheme ? 'Rp 0 (Lunas)' : `Rp ${finalPaymentAmount.toLocaleString('id-ID')}`}
										</div>
										<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-light mt-0.5">
											{isFullPaymentScheme 
												? 'Skema bayar penuh 100% di awal — Bebas tagihan di Fase 4'
												: `Sisa pelunasan ${finalPaymentPercentDisplay}% dari total nilai kontrak (Rp ${Number(project.quotedPrice).toLocaleString('id-ID')})`}
										</p>
									</div>

									<div>
										{#if project.paymentStatus === 'settled'}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
												<CheckCircle2 size={14} />
												Lunas 100% (Approved)
											</span>
										{:else if isFullPaymentScheme}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
												<CheckCircle2 size={14} />
												Skema Full (Dibayar di Fase 1)
											</span>
										{:else if project.finalPaymentProofUrl}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
												<Clock size={14} />
												Menunggu Verifikasi Admin
											</span>
										{:else}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
												<CreditCard size={14} />
												Menunggu Pelunasan
											</span>
										{/if}
									</div>
								</div>

								{#if isFullPaymentScheme && project.paymentStatus !== 'settled'}
									<div class="p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 flex items-center gap-3">
										<div class="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
											<Coins size={18} />
										</div>
										<div class="space-y-0.5">
											<h5 class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
												Skema Pembayaran Penuh 100% di Awal
											</h5>
											<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
												Anda telah memilih skema bayar penuh. Begitu pembayaran awal diverifikasi admin, seluruh deliverable dan paket serah terima akan otomatis terbuka tanpa pembayaran kedua.
											</p>
										</div>
									</div>
								{/if}

								{#if project.paymentStatus !== 'settled' && !isFullPaymentScheme}
									<!-- Bank Accounts List for Final Settlement -->
									<div class="space-y-2">
										<div class="flex items-center justify-between text-[10px] text-zinc-500">
											<span class="font-bold uppercase tracking-wider flex items-center gap-1.5">
												<CreditCard size={12} class="text-zinc-400" />
												Rekening Pelunasan Akhir
											</span>
											<span>a/n Hamas Azizan</span>
										</div>

										<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<!-- GOPAY -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-sky-600 dark:text-sky-400 block">GOPAY</span>
													<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">0895630354422</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('0895630354422', 'GOPAY')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin GOPAY"
												>
													{#if copiedBank === 'GOPAY'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>

											<!-- BANK JAGO -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">BANK JAGO</span>
													<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">1089 5642 3736</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('108956423736', 'Bank Jago')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin Bank Jago"
												>
													{#if copiedBank === 'Bank Jago'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>
										</div>
									</div>

									<!-- Upload Proof for Final Settlement -->
									{#if project.finalPaymentProofUrl}
										<div class="p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3">
											<div class="flex items-center gap-3 min-w-0">
												<button
													type="button"
													onclick={() => openLightbox(project.finalPaymentProofUrl!)}
													class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative group cursor-pointer bg-zinc-100 dark:bg-zinc-800"
													title="Perbesar bukti pelunasan"
												>
													<img
														src={project.finalPaymentProofUrl}
														alt="Bukti Pelunasan"
														class="w-full h-full object-cover group-hover:scale-105 transition-transform"
													/>
													<div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
														<Maximize2 size={13} />
													</div>
												</button>
												<div class="min-w-0 space-y-0.5">
													<div class="flex items-center gap-1.5">
														<span class="font-bold text-zinc-800 dark:text-zinc-200 truncate text-xs">
															Bukti Pelunasan ({project.finalPaymentProofBank || 'Bank Transfer'})
														</span>
													</div>
													<p class="text-[10px] text-zinc-400 truncate">
														Pengirim: {project.finalPaymentProofSenderName || project.contactName} · {formatDateTime(project.finalPaymentProofUploadedAt)}
													</p>
												</div>
											</div>

											<button
												type="button"
												onclick={() => openUploadModal('final')}
												class="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
											>
												Unggah Ulang
											</button>
										</div>
									{:else}
										<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
											<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
												Silakan transfer sisa kontrak lalu unggah bukti pelunasan:
											</p>
											<button
												type="button"
												onclick={() => openUploadModal('final')}
												class="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
											>
												<Upload size={13} />
												Unggah Bukti Pelunasan
											</button>
										</div>
									{/if}
								{/if}

								<!-- Gated Release Handover Deliverables -->
								<div class="pt-3 border-t border-zinc-200/60 dark:border-zinc-800 space-y-3">
									<div class="flex items-center justify-between">
										<span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
											<Sparkles size={14} class="text-amber-500" />
											Paket Handover & Repositori Produksi
										</span>
										{#if project.paymentStatus === 'settled'}
											<span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
												Unlocked
											</span>
										{:else}
											<span class="text-[9px] font-bold text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1">
												<Lock size={10} /> Locked
											</span>
										{/if}
									</div>

									{#if project.paymentStatus !== 'settled'}
										<!-- Locked Gate Banner -->
										<div class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xs flex items-center gap-3">
											<div class="p-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 shrink-0">
												<Lock size={20} />
											</div>
											<div class="space-y-1">
												<h5 class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
													Akses Deliverable Produksi Terkunci
												</h5>
												<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
													Tautan repositori akhir, kredensial production live, dan paket handover akan terbuka secara otomatis segera setelah pelunasan diverifikasi oleh admin.
												</p>
											</div>
										</div>
									{:else}
										<!-- Unlocked Handover Links -->
										<div class="space-y-3">
											<div class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
												<ShieldCheck size={16} class="text-emerald-600 dark:text-emerald-400 shrink-0" />
												<span>Seluruh kewajiban pembayaran telah tuntas. Repositori dan aplikasi live telah diserahkan sepenuhnya kepada Anda.</span>
											</div>

											<div class="flex flex-wrap gap-2.5">
												{#if project.productionUrl}
													<a
														href={project.productionUrl}
														target="_blank"
														rel="noopener noreferrer"
														class="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
													>
														<Rocket size={13} />
														Kunjungi Website Live
														<ExternalLink size={12} />
													</a>
												{/if}

												{#if project.codebaseTransferUrl || project.repoLink}
													<a
														href={project.codebaseTransferUrl || project.repoLink}
														target="_blank"
														rel="noopener noreferrer"
														class="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs hover:border-zinc-400 transition-colors"
													>
														<Download size={13} />
														Unduh Codebase / Repo Transfer
														<ExternalLink size={12} />
													</a>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Active Warranty Support Widget -->
									<div class="pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
										<span class="flex items-center gap-1.5 font-medium">
											<ShieldCheck size={14} class="text-blue-500" />
											Garansi & Pemeliharaan Bebas Bug
										</span>
										<span class="font-semibold text-zinc-800 dark:text-zinc-200">
											Aktif hingga: {formatDate(project.warrantyEndDate || '3 bulan')}
										</span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Right Column: Clean & Simplified Deliverables / Sidebar -->
		<div class="space-y-6">
			<!-- Assets & Link Deliverable -->
			<div class="space-y-3 text-left">
				<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
					Aset & Link Deliverable
				</h3>

				{#if project.stagingUrl || project.proposalUrl || project.repoLink || project.figmaUrl || project.brdUrl}
					<!-- Clean Unified Deliverables List (No Card Inside Card) -->
					<div class="border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 divide-y divide-zinc-100 dark:divide-zinc-800/70 overflow-hidden shadow-2xs">
						{#if project.brdUrl}
							<a
								href={project.brdUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 transition-colors text-xs font-medium group"
							>
								<span class="flex items-center gap-2.5">
									<FileText class="w-4 h-4 text-blue-500 shrink-0" />
									Dokumen BRD
								</span>
								<ExternalLink class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
							</a>
						{/if}

						{#if project.figmaUrl}
							<a
								href={project.figmaUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 transition-colors text-xs font-medium group"
							>
								<span class="flex items-center gap-2.5">
									<Figma class="w-4 h-4 text-purple-500 shrink-0" />
									Figma Prototype & Design
								</span>
								<ExternalLink class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
							</a>
						{/if}

						{#if project.stagingUrl}
							<a
								href={project.stagingUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 transition-colors text-xs font-medium group"
							>
								<span class="flex items-center gap-2.5">
									<Rocket class="w-4 h-4 text-orange-500 shrink-0" />
									Server Staging
								</span>
								<ExternalLink class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
							</a>
						{/if}

						{#if project.proposalUrl}
							<a
								href={project.proposalUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 transition-colors text-xs font-medium group"
							>
								<span class="flex items-center gap-2.5">
									<FileText class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
									Dokumen Proposal
								</span>
								<ExternalLink class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
							</a>
						{/if}

						{#if project.repoLink}
							<a
								href={project.repoLink}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 transition-colors text-xs font-medium group"
							>
								<span class="flex items-center gap-2.5">
									<Github class="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
									Source Code (Git)
								</span>
								<ExternalLink class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
							</a>
						{/if}
					</div>
				{:else}
					<div class="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500 font-light">
						Link deliverable belum diterbitkan.
					</div>
				{/if}

				<!-- Staging Secure Access (Only in Fase 3 / Review & Completed when credentials are set) -->
				{#if ['review', 'completed'].includes(project.status) && (project.stagingCredentialsEmail || project.stagingCredentialsPassword)}
					<div class="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 rounded-xl p-4 text-xs space-y-3 relative shadow-2xs">
						<div class="flex items-center justify-between">
							<span class="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
								<Lock size={12} class="text-zinc-400 dark:text-zinc-500" /> Staging Secure Access
							</span>
							<button
								type="button"
								onclick={() => revealCredentials = !revealCredentials}
								class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
								title={revealCredentials ? "Hide credentials" : "Show credentials"}
							>
								{#if revealCredentials}
									<EyeOff size={13} />
								{:else}
									<Eye size={13} />
								{/if}
							</button>
						</div>

						<div class="space-y-2 pt-1">
							{#if project.stagingCredentialsRole}
								<div>
									<span class="text-[9px] text-zinc-400 dark:text-zinc-500 block">Role</span>
									<span class="text-zinc-800 dark:text-zinc-200 font-medium">
										{project.stagingCredentialsRole}
									</span>
								</div>
							{/if}
							{#if project.stagingCredentialsEmail}
								<div>
									<span class="text-[9px] text-zinc-400 dark:text-zinc-500 block">Staging User</span>
									<span class="text-zinc-800 dark:text-zinc-200 select-all font-mono">
										{project.stagingCredentialsEmail}
									</span>
								</div>
							{/if}
							{#if project.stagingCredentialsPassword}
								<div>
									<span class="text-[9px] text-zinc-400 dark:text-zinc-500 block">Password</span>
									<div class="flex items-center gap-2">
										<span class="text-zinc-800 dark:text-zinc-200 select-all font-mono">
											{revealCredentials ? project.stagingCredentialsPassword : '••••••••••••••••'}
										</span>
										<button
											type="button"
											onclick={() => copyToClipboard(project.stagingCredentialsPassword!, 'Password')}
											class="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
											title="Salin password"
										>
											<Copy size={11} />
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Activity log notes -->
			<div class="space-y-3 text-left">
				<h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
					Catatan & Log Aktivitas
				</h3>

				<div class="space-y-3">
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
			<div class="space-y-3 text-left">
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
							href="mailto:hamasazeezan@gmail.com"
							class="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
						>
							<Mail class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
							hamasazeezan@gmail.com
						</a>
						<a
							href="https://wa.me/0895630354422"
							class="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
						>
							<Phone class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
							0895630354422
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
		</div>
	</section>

</div>

<!-- ==========================================
    MODAL: UNGGAH BUKTI TRANSFER
    ========================================== -->
{#if showUploadModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
		<!-- Backdrop -->
		<button
			class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default w-full h-full border-0 focus:outline-none"
			onclick={() => (showUploadModal = false)}
			aria-label="Tutup modal"
		></button>

		<!-- Modal Box -->
		<div class="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200 text-left space-y-5 z-10 max-h-[90vh] overflow-y-auto">
			
			<div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
				<div class="flex items-center gap-2.5">
					<div class="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
						<Upload size={18} />
					</div>
					<div>
						<h3 class="text-sm font-bold text-zinc-900 dark:text-white">
							{uploadPaymentType === 'final' ? 'Unggah Bukti Pelunasan (Sisa 70%)' : 'Unggah Bukti Pembayaran DP (30%)'}
						</h3>
						<p class="text-[11px] text-zinc-500 dark:text-zinc-400">
							{uploadPaymentType === 'final' 
								? `Kirim struk pelunasan kontrak sebesar Rp ${finalPaymentAmount.toLocaleString('id-ID')} untuk diverifikasi.`
								: `Kirim struk pembayaran DP sebesar Rp ${dpAmount.toLocaleString('id-ID')} untuk diverifikasi.`}
						</p>
					</div>
				</div>
				<button
					type="button"
					onclick={() => (showUploadModal = false)}
					class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
				>
					<X size={18} />
				</button>
			</div>

			<form
				method="POST"
				action="?/uploadProof"
				enctype="multipart/form-data"
				use:enhance={handleUploadEnhance}
				class="space-y-4 text-xs"
			>
				<input type="hidden" name="paymentType" value={uploadPaymentType} />

				<!-- File Picker Box -->
				<div class="space-y-1.5">
					<label for="proofFileInput" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
						File Bukti Transfer <span class="text-rose-500">*</span>
					</label>
					
					<label
						for="proofFileInput"
						class="flex flex-col items-center justify-center p-5 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/30 transition-colors"
					>
						{#if previewImage}
							<div class="space-y-2 text-center">
								<img
									src={previewImage}
									alt="Preview Bukti Transfer"
									class="max-h-40 mx-auto rounded-lg border border-zinc-200 dark:border-zinc-700 object-contain shadow-sm"
								/>
								<p class="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
									{selectedFileName} <span class="text-zinc-400 font-normal">({selectedFileSize})</span>
								</p>
								<span class="text-[10px] text-blue-600 dark:text-blue-400 underline">Klik untuk mengganti gambar</span>
							</div>
						{:else if selectedFileName}
							<div class="space-y-1 text-center">
								<FileText size={28} class="mx-auto text-zinc-400" />
								<p class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{selectedFileName}</p>
								<span class="text-[10px] text-zinc-400">({selectedFileSize})</span>
							</div>
						{:else}
							<div class="space-y-1 text-center">
								<ImageIcon size={28} class="mx-auto text-zinc-400" />
								<p class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
									Pilih foto / screenshot struk pembayaran
								</p>
								<p class="text-[10px] text-zinc-400">
									Format: JPG, PNG, WebP, atau PDF (Maks. 8MB)
								</p>
							</div>
						{/if}

						<input
							id="proofFileInput"
							type="file"
							name="proofFile"
							accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
							required
							onchange={handleFileChange}
							class="hidden"
						/>
					</label>
				</div>

				<!-- Bank Pengirim & Nama Pengirim Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- Bank Pengirim -->
					<div class="space-y-1.5">
						<label for="senderBank" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
							Bank / Dompet Digital Pengirim
						</label>
						<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2">
							<select
								id="senderBank"
								name="senderBank"
								bind:value={senderBank}
								class="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
							>
								<option value="GOPAY" class="bg-white dark:bg-zinc-900">GoPay / GoBiz</option>
								<option value="Bank Jago" class="bg-white dark:bg-zinc-900">Bank Jago</option>
								<option value="BCA" class="bg-white dark:bg-zinc-900">BCA</option>
								<option value="Mandiri" class="bg-white dark:bg-zinc-900">Mandiri</option>
								<option value="BRI" class="bg-white dark:bg-zinc-900">BRI</option>
								<option value="BNI" class="bg-white dark:bg-zinc-900">BNI</option>
								<option value="SeaBank" class="bg-white dark:bg-zinc-900">SeaBank</option>
								<option value="Dana" class="bg-white dark:bg-zinc-900">DANA</option>
								<option value="OVO" class="bg-white dark:bg-zinc-900">OVO</option>
								<option value="ShopeePay" class="bg-white dark:bg-zinc-900">ShopeePay</option>
								<option value="Lainnya" class="bg-white dark:bg-zinc-900">Lainnya / Bank Lain</option>
							</select>
						</div>
					</div>

					<!-- Atas Nama Pengirim -->
					<div class="space-y-1.5">
						<label for="senderName" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
							Nama Rekening Pengirim
						</label>
						<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2">
							<input
								id="senderName"
								type="text"
								name="senderName"
								bind:value={senderName}
								placeholder={project.contactName || 'Nama di struk'}
								class="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
							/>
						</div>
					</div>
				</div>

				<!-- Catatan / Keterangan Transfer -->
				<div class="space-y-1.5">
					<label for="notes" class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
						Catatan Tambahan (Opsional)
					</label>
					<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2.5">
						<textarea
							id="notes"
							name="notes"
							rows="2"
							bind:value={uploadNotes}
							placeholder="Misal: Bukti pembayaran transfer melalui m-Banking..."
							class="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
						></textarea>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
					<button
						type="button"
						onclick={() => (showUploadModal = false)}
						class="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isUploadingProof}
						class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
					>
						{#if isUploadingProof}
							<Spinner size={13} class="text-white dark:text-zinc-950" />
							Mengunggah...
						{:else}
							<Upload size={13} />
							Kirim Bukti Pembayaran
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ==========================================
    MODAL: LIGHTBOX ZOOM BUKTI PEMBAYARAN
    ========================================== -->
{#if showImageLightbox && lightboxImageUrl}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" transition:fade={{ duration: 150 }}>
		<button
			type="button"
			onclick={() => { showImageLightbox = false; lightboxImageUrl = null; }}
			class="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 cursor-pointer"
			aria-label="Tutup"
		>
			<X size={20} />
		</button>

		<div class="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
			<img
				src={lightboxImageUrl}
				alt="Bukti Transfer Detail"
				class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
			/>
		</div>
	</div>
{/if}

<!-- ==========================================
    MODAL: PILIH SKEMA PEMBAYARAN
    ========================================== -->
{#if showSchemeModal}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={() => { if (!isUpdatingScheme) showSchemeModal = false; }}
		role="dialog"
		aria-modal="true"
	>
		<div 
			class="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-start justify-between">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
							<Coins size={16} />
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">
							Pilih Skema Pembayaran
						</h3>
					</div>
					<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
						Pilih metode pembagian termin pembayaran yang paling sesuai dengan preferensi Anda sebelum pengerjaan proyek dimulai.
					</p>
				</div>
				<button
					type="button"
					onclick={() => showSchemeModal = false}
					disabled={isUpdatingScheme}
					class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					aria-label="Tutup"
				>
					<X size={16} />
				</button>
			</div>

			<!-- Scheme Options Form -->
			<form 
				method="POST" 
				action="?/switchPaymentScheme" 
				use:enhance={handleSwitchSchemeEnhance} 
				class="space-y-4"
			>
				<div class="space-y-2.5">
					<!-- Option 1: 30% DP -->
					<label 
						class="flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none
						{selectedScheme === '30% DP' 
							? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-500/5 ring-1 ring-blue-500/30' 
							: 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'}"
					>
						<input 
							type="radio" 
							name="scheme" 
							value="30% DP" 
							bind:group={selectedScheme}
							class="mt-1 text-blue-600 focus:ring-blue-500" 
						/>
						<div class="flex-1 space-y-1">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold text-zinc-900 dark:text-white">
									DP 30% — Standar / Fleksibel
								</span>
								<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
									Rekomendasi
								</span>
							</div>
							<p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-light">
								Bayar DP <strong>Rp {Math.round((project.quotedPrice || 0) * 0.3).toLocaleString('id-ID')}</strong> (30%) di awal untuk mulai pengerjaan. Sisa <strong>Rp {Math.round((project.quotedPrice || 0) * 0.7).toLocaleString('id-ID')}</strong> (70%) dibayar saat serah terima di Fase 4.
							</p>
						</div>
					</label>

					<!-- Option 2: 50% DP -->
					<label 
						class="flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none
						{selectedScheme === '50% DP' 
							? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-500/5 ring-1 ring-blue-500/30' 
							: 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'}"
					>
						<input 
							type="radio" 
							name="scheme" 
							value="50% DP" 
							bind:group={selectedScheme}
							class="mt-1 text-blue-600 focus:ring-blue-500" 
						/>
						<div class="flex-1 space-y-1">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold text-zinc-900 dark:text-white">
									DP 50% — Bagi Rata (50/50)
								</span>
								<span class="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
									Bagi Dua
								</span>
							</div>
							<p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-light">
								Bayar DP <strong>Rp {Math.round((project.quotedPrice || 0) * 0.5).toLocaleString('id-ID')}</strong> (50%) di awal. Sisa <strong>Rp {Math.round((project.quotedPrice || 0) * 0.5).toLocaleString('id-ID')}</strong> (50%) dibayar saat serah terima di Fase 4.
							</p>
						</div>
					</label>

					<!-- Option 3: Full 100% -->
					<label 
						class="flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none
						{selectedScheme === 'Full 100%' 
							? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-500/5 ring-1 ring-blue-500/30' 
							: 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'}"
					>
						<input 
							type="radio" 
							name="scheme" 
							value="Full 100%" 
							bind:group={selectedScheme}
							class="mt-1 text-blue-600 focus:ring-blue-500" 
						/>
						<div class="flex-1 space-y-1">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold text-zinc-900 dark:text-white">
									Bayar Penuh 100% — Langsung Tuntas
								</span>
								<span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
									Bebas Ribet
								</span>
							</div>
							<p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-light">
								Bayar lunas <strong>Rp {Number(project.quotedPrice || 0).toLocaleString('id-ID')}</strong> di muka. Tidak ada tagihan kedua di akhir, akses source code & rilis produksi langsung dibuka tanpa menunggu verifikasi ulang.
							</p>
						</div>
					</label>
				</div>

				<!-- Action Buttons -->
				<div class="pt-2 flex items-center justify-end gap-2.5">
					<button
						type="button"
						onclick={() => showSchemeModal = false}
						disabled={isUpdatingScheme}
						class="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isUpdatingScheme}
						class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{#if isUpdatingScheme}
							<Spinner size={14} class="text-white" />
							<span>Menyimpan...</span>
						{:else}
							<Check size={14} />
							<span>Terapkan Skema</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
