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
		Info
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
	const isClientBlocker = $derived(getClientBlockerStatus(project));

	// Milestone payment calculations
	function parseDpPercentage(req: string | undefined): number {
		if (!req) return 0.3; // Default 30%
		const match = req.match(/(\d+)%/);
		if (match) return parseInt(match[1], 10) / 100;
		if (req.toLowerCase().includes('full') || req.toLowerCase().includes('100%')) return 1.0;
		return 0.3;
	}

	const dpRatio = $derived(parseDpPercentage(project.downPaymentRequirement));
	const dpPercentDisplay = $derived(Math.round(dpRatio * 100));
	const dpAmount = $derived(Math.round((project.quotedPrice || 0) * dpRatio));
	const finalPaymentRatio = $derived(Math.max(0, 1 - dpRatio));
	const finalPaymentPercentDisplay = $derived(Math.round(finalPaymentRatio * 100));
	const finalPaymentAmount = $derived(Math.max(0, (project.quotedPrice || 0) - dpAmount));

	// State for credentials mask
	let revealCredentials = $state(false);

	// Bank Copy State
	let copiedBank = $state<string | null>(null);

	function copyToClipboard(text: string, bankKey: string) {
		navigator.clipboard.writeText(text);
		copiedBank = bankKey;
		toast.success(`Nomor rekening ${bankKey} berhasil disalin!`);
		setTimeout(() => {
			if (copiedBank === bankKey) copiedBank = null;
		}, 2500);
	}

	// Proof Upload States
	let isUploadingProof = $state(false);
	let isDeletingProof = $state(false);
	let showUploadModal = $state(false);
	let showImageLightbox = $state(false);
	let previewImage = $state<string | null>(null);
	let selectedFileName = $state<string>('');
	let selectedFileSize = $state<string>('');
	let senderBank = $state('BCA');
	let senderName = $state('');
	let uploadNotes = $state('');

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

	function getClientBlockerStatus(proj: any) {
		if (proj.status === 'pending' && !proj.meetingId) {
			return {
				title: 'Penjadwalan Pertemuan Konsultasi',
				desc: 'Kami sedang menunggu Anda untuk menjadwalkan sesi konsultasi awal guna membahas ruang lingkup dan spesifikasi proyek.'
			};
		}
		if (proj.paymentProofUrl && proj.paymentStatus === 'unpaid') {
			return {
				title: 'Bukti Pembayaran Sedang Diverifikasi',
				desc: 'Bukti transfer pembayaran Anda telah kami terima dan sedang dalam proses verifikasi. Status pengerjaan proyek akan diperbarui sesegera mungkin.'
			};
		}
		if (proj.status === 'consulted' && proj.paymentStatus === 'unpaid') {
			return {
				title: 'Persetujuan Proposal & Pembayaran DP',
				desc: 'Proposal penawaran dan rincian Down Payment telah dikirimkan. Silakan transfer ke rekening yang tertera di bawah dan upload bukti bayar untuk memulai pengerjaan.'
			};
		}
		if (proj.status === 'review' && (!proj.milestoneFrontendComplete || !proj.milestoneDbSynced)) {
			return {
				title: 'Review Staging & Umpan Balik',
				desc: 'Aplikasi saat ini aktif di server staging. Mohon periksa fungsionalitas dan berikan feedback Anda.'
			};
		}
		if (['review', 'completed'].includes(proj.status) && proj.paymentStatus !== 'settled') {
			return {
				title: 'Pelunasan Pembayaran Akhir (Fase 4)',
				desc: 'Proyek telah memasuki tahap akhir / serah terima. Silakan lakukan pelunasan sisa kontrak pada Fase 4 untuk menerima repositori produksi dan aktivasi garansi penuh.'
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
			<div class="flex flex-wrap items-center gap-2">
				<span class="px-3 py-1 rounded-lg text-[11px] font-bold uppercase border
					{project.paymentStatus === 'settled' 
						? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
						: project.paymentStatus === 'dp_paid'
							? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
							: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}">
					{project.paymentStatus === 'settled' ? '✓ Lunas 100%' : project.paymentStatus === 'dp_paid' ? '✓ DP Terbayar' : 'Menunggu DP'}
				</span>
				{#if project.downPaymentRequirement}
					<span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg">
						Skema: {project.downPaymentRequirement}
					</span>
				{/if}
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
				
				<!-- Phase 1 -->
				<div class="relative">
					<div class="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center
						{['consulted', 'in_progress', 'review', 'completed'].includes(project.status) 
							? 'bg-zinc-800 dark:bg-zinc-200' 
							: 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-3">
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

						<!-- Embedded Payment & Contract Settlement in Phase 1 -->
						{#if project.quotedPrice}
							<div class="mt-3 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4 text-xs">
								<!-- Milestone DP Row -->
								<div class="pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
									<span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
										Tagihan DP Fase 1 ({dpPercentDisplay}%)
									</span>
									<div class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-0.5">
										Rp {dpAmount.toLocaleString('id-ID')}
									</div>
									<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-light mt-0.5">
										Uang muka {dpPercentDisplay}% dari total nilai kontrak (Rp {Number(project.quotedPrice).toLocaleString('id-ID')})
									</p>
								</div>

								<!-- Bank Accounts List -->
								<div class="space-y-2">
									<div class="flex items-center justify-between text-[10px] text-zinc-500">
										<span class="font-bold uppercase tracking-wider flex items-center gap-1.5">
											<CreditCard size={12} class="text-zinc-400" />
											Rekening Pembayaran Bank
										</span>
										<span>a/n Hamas Azizan</span>
									</div>

									<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
										<!-- BCA -->
										<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
											<div>
												<span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 block">BCA</span>
												<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">8020584988</span>
											</div>
											<button
												type="button"
												onclick={() => copyToClipboard('8020584988', 'BCA')}
												class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
												title="Salin BCA"
											>
												{#if copiedBank === 'BCA'}
													<Check size={13} class="text-emerald-500" />
												{:else}
													<Copy size={13} />
												{/if}
											</button>
										</div>

										<!-- Mandiri -->
										<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
											<div>
												<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">Mandiri</span>
												<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">1370019283741</span>
											</div>
											<button
												type="button"
												onclick={() => copyToClipboard('1370019283741', 'Mandiri')}
												class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
												title="Salin Mandiri"
											>
												{#if copiedBank === 'Mandiri'}
													<Check size={13} class="text-emerald-500" />
												{:else}
													<Copy size={13} />
												{/if}
											</button>
										</div>

										<!-- Jago -->
										<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
											<div>
												<span class="text-[9px] font-bold text-purple-600 dark:text-purple-400 block">Jago</span>
												<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">10892839210</span>
											</div>
											<button
												type="button"
												onclick={() => copyToClipboard('10892839210', 'Jago')}
												class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
												title="Salin Jago"
											>
												{#if copiedBank === 'Jago'}
													<Check size={13} class="text-emerald-500" />
												{:else}
													<Copy size={13} />
												{/if}
											</button>
										</div>
									</div>
								</div>

								<!-- Upload Proof Feature / Status -->
								{#if project.paymentProofUrl}
									<div class="p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3">
										<div class="flex items-center gap-3 min-w-0">
											<button
												type="button"
												onclick={() => (showImageLightbox = true)}
												class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative group cursor-pointer bg-zinc-100 dark:bg-zinc-800"
												title="Perbesar bukti"
											>
												<img
													src={project.paymentProofUrl}
													alt="Bukti Transfer"
													class="w-full h-full object-cover group-hover:scale-105 transition-transform"
												/>
												<div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
													<Maximize2 size={13} />
												</div>
											</button>
											<div class="min-w-0 space-y-0.5">
												<div class="flex items-center gap-1.5">
													<span class="font-bold text-zinc-800 dark:text-zinc-200 truncate text-xs">
														Bukti Transfer ({project.paymentProofBank || 'Bank Transfer'})
													</span>
													<span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase
														{project.paymentStatus === 'settled' || project.paymentStatus === 'dp_paid'
															? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
															: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}">
														{project.paymentStatus === 'settled' || project.paymentStatus === 'dp_paid' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
													</span>
												</div>
												<p class="text-[10px] text-zinc-400 truncate">
													Pengirim: {project.paymentProofSenderName || project.contactName} · {formatDateTime(project.paymentProofUploadedAt)}
												</p>
											</div>
										</div>

										<button
											type="button"
											onclick={() => {
												previewImage = null;
												selectedFileName = '';
												showUploadModal = true;
											}}
											class="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
										>
											Unggah Ulang
										</button>
									</div>
								{:else}
									<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
										<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
											Lakukan transfer DP sesuai nominal yang disepakati, lalu unggah bukti transfer:
										</p>
										<button
											type="button"
											onclick={() => {
												previewImage = null;
												selectedFileName = '';
												showUploadModal = true;
											}}
											class="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
										>
											<Upload size={13} />
											Unggah Bukti Transfer
										</button>
									</div>
								{/if}
							</div>
						{/if}
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
						{project.status === 'completed' 
							? 'bg-zinc-800 dark:bg-zinc-200' 
							: project.status === 'review' ? 'bg-amber-500' : 'bg-zinc-100 dark:bg-zinc-800'}">
					</div>
					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<h4 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Fase 4: Peluncuran & Penyerahan</h4>
							<span class="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
								{project.status === 'completed'
									? 'bg-emerald-500/10 text-emerald-500'
									: project.status === 'review'
										? 'bg-amber-500/10 text-amber-500'
										: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}">
								{project.status === 'completed' ? 'Selesai' : project.status === 'review' ? 'Tahap Pembayaran Final' : 'Mendatang'}
							</span>
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
							Migrasi data ke server produksi, penyerahan repositori kode sumber, penyampaian dokumentasi teknis, dan aktivasi garansi.
						</p>

						<!-- Phase 4: Full Payment Settlement Card (Active when in Review / Completed) -->
						{#if ['review', 'completed'].includes(project.status) && project.quotedPrice}
							<div class="mt-3 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4 text-xs">
								<!-- Contract Summary & Full Payment Status -->
								<div class="pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
									<span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
										Tagihan Pelunasan Akhir ({finalPaymentPercentDisplay}%)
									</span>
									<div class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-0.5">
										Rp {finalPaymentAmount.toLocaleString('id-ID')}
									</div>
									<p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-light mt-0.5">
										Sisa pelunasan {finalPaymentPercentDisplay}% dari total nilai kontrak (Rp {Number(project.quotedPrice).toLocaleString('id-ID')})
									</p>
								</div>

								{#if project.paymentStatus !== 'settled'}
									<!-- Explanation -->
									<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
										Proyek telah memasuki tahap serah terima. Silakan lakukan transfer pelunasan sisa kontrak sebesar <strong>Rp {finalPaymentAmount.toLocaleString('id-ID')}</strong> ({finalPaymentPercentDisplay}%) ke rekening di bawah ini sebelum serah terima repositori:
									</p>

									<!-- Bank Accounts List -->
									<div class="space-y-2">
										<div class="flex items-center justify-between text-[10px] text-zinc-500">
											<span class="font-bold uppercase tracking-wider flex items-center gap-1.5">
												<CreditCard size={12} class="text-zinc-400" />
												Rekening Pelunasan Bank
											</span>
											<span>a/n Hamas Azizan</span>
										</div>

										<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
											<!-- BCA -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 block">BCA</span>
													<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">8020584988</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('8020584988', 'BCA')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin BCA"
												>
													{#if copiedBank === 'BCA'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>

											<!-- Mandiri -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">Mandiri</span>
													<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">1370019283741</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('1370019283741', 'Mandiri')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin Mandiri"
												>
													{#if copiedBank === 'Mandiri'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>

											<!-- Jago -->
											<div class="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
												<div>
													<span class="text-[9px] font-bold text-purple-600 dark:text-purple-400 block">Jago</span>
													<span class="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-all">10892839210</span>
												</div>
												<button
													type="button"
													onclick={() => copyToClipboard('10892839210', 'Jago')}
													class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
													title="Salin Jago"
												>
													{#if copiedBank === 'Jago'}
														<Check size={13} class="text-emerald-500" />
													{:else}
														<Copy size={13} />
													{/if}
												</button>
											</div>
										</div>
									</div>

									<!-- Upload Proof Feature / Status -->
									{#if project.paymentProofUrl}
										<div class="p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3">
											<div class="flex items-center gap-3 min-w-0">
												<button
													type="button"
													onclick={() => (showImageLightbox = true)}
													class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 relative group cursor-pointer bg-zinc-100 dark:bg-zinc-800"
													title="Perbesar bukti"
												>
													<img
														src={project.paymentProofUrl}
														alt="Bukti Transfer"
														class="w-full h-full object-cover group-hover:scale-105 transition-transform"
													/>
													<div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
														<Maximize2 size={13} />
													</div>
												</button>
												<div class="min-w-0 space-y-0.5">
													<div class="flex items-center gap-1.5">
														<span class="font-bold text-zinc-800 dark:text-zinc-200 truncate text-xs">
															Bukti Pelunasan ({project.paymentProofBank || 'Bank Transfer'})
														</span>
														<span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase
															{project.paymentStatus === 'settled'
																? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
																: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}">
															{project.paymentStatus === 'settled' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
														</span>
													</div>
													<p class="text-[10px] text-zinc-400 truncate">
														Pengirim: {project.paymentProofSenderName || project.contactName} · {formatDateTime(project.paymentProofUploadedAt)}
													</p>
												</div>
											</div>

											<button
												type="button"
												onclick={() => {
													previewImage = null;
													selectedFileName = '';
													showUploadModal = true;
												}}
												class="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
											>
												Unggah Ulang
											</button>
										</div>
									{:else}
										<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
											<p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">
												Unggah struk pelunasan pembayaran Anda:
											</p>
											<button
												type="button"
												onclick={() => {
													previewImage = null;
													selectedFileName = '';
													showUploadModal = true;
												}}
												class="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
											>
												<Upload size={13} />
												Unggah Bukti Pelunasan
											</button>
										</div>
									{/if}
								{:else}
									<!-- Fully Settled Confirmation -->
									<div class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2.5">
										<CheckCircle2 size={16} class="text-emerald-600 dark:text-emerald-400 shrink-0" />
										<div>
											<p class="text-xs font-bold">Pembayaran 100% Lunas & Terverifikasi</p>
											<p class="text-[10px] text-emerald-700 dark:text-emerald-400 font-light">
												Seluruh kewajiban pembayaran telah selesai. Repositori kode dan dukungan garansi aktif.
											</p>
										</div>
									</div>
								{/if}
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
						<h3 class="text-sm font-bold text-zinc-900 dark:text-white">Unggah Bukti Pembayaran</h3>
						<p class="text-[11px] text-zinc-500 dark:text-zinc-400">Kirim struk / bukti transfer bank untuk diverifikasi.</p>
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
							Bank Pengirim
						</label>
						<div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2">
							<select
								id="senderBank"
								name="senderBank"
								bind:value={senderBank}
								class="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
							>
								<option value="BCA" class="bg-white dark:bg-zinc-900">BCA</option>
								<option value="Mandiri" class="bg-white dark:bg-zinc-900">Mandiri</option>
								<option value="BRI" class="bg-white dark:bg-zinc-900">BRI</option>
								<option value="BNI" class="bg-white dark:bg-zinc-900">BNI</option>
								<option value="Bank Jago" class="bg-white dark:bg-zinc-900">Bank Jago</option>
								<option value="SeaBank" class="bg-white dark:bg-zinc-900">SeaBank</option>
								<option value="GoPay" class="bg-white dark:bg-zinc-900">GoPay / GoBiz</option>
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
							placeholder="Misal: Pembayaran DP 50% untuk Proyek Website..."
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
{#if showImageLightbox && project.paymentProofUrl}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" transition:fade={{ duration: 150 }}>
		<button
			type="button"
			onclick={() => (showImageLightbox = false)}
			class="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 cursor-pointer"
			aria-label="Tutup"
		>
			<X size={20} />
		</button>

		<div class="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
			<img
				src={project.paymentProofUrl}
				alt="Bukti Transfer Detail"
				class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
			/>
		</div>
	</div>
{/if}
