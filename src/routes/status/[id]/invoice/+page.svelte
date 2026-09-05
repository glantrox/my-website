<script lang="ts">
	import { Printer, ArrowLeft, Heart, CheckCircle2 } from 'lucide-svelte';

	let { data } = $props();
	const project = $derived(data.project);

	function parseDpPercentage(req: string | undefined): number {
		if (!req) return 0.3;
		const lower = req.toLowerCase();
		if (lower.includes('full') || lower.includes('100%') || lower.includes('lunas')) return 1.0;
		const match = req.match(/(\d+)%/);
		if (match) return parseInt(match[1], 10) / 100;
		return 0.3;
	}

	const dpRatio = $derived(parseDpPercentage(project.downPaymentRequirement));
	const isFull = $derived(dpRatio >= 0.99);
	const totalPrice = $derived(project.quotedPrice || 0);
	const dpAmount = $derived(Math.round(totalPrice * dpRatio));
	const finalAmount = $derived(isFull ? 0 : totalPrice - dpAmount);

	const isDpPaid = $derived(project.paymentStatus === 'dp_paid' || project.paymentStatus === 'settled');
	const isSettled = $derived(project.paymentStatus === 'settled');

	// Current remaining amount due
	const currentDue = $derived(
		isSettled ? 0 : (isDpPaid ? finalAmount : totalPrice)
	);

	function formatDate(d: string | undefined): string {
		if (!d) return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
		const dateObj = new Date(d);
		if (isNaN(dateObj.getTime())) return d;
		return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	function handlePrint() {
		if (typeof window !== 'undefined') {
			window.print();
		}
	}
</script>

<svelte:head>
	<title>Invoice #{project.id.slice(-8).toUpperCase()} - {project.contactName || 'Client'}</title>
</svelte:head>

<div class="invoice-wrapper min-h-screen bg-zinc-100/80 dark:bg-zinc-950 py-8 px-4 sm:px-6 print:bg-white print:p-0">
	<!-- Navigation & Actions Bar (Hidden on print) -->
	<div class="max-w-[800px] mx-auto mb-6 flex items-center justify-between print:hidden">
		<a 
			href="/status/{project.id}" 
			class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
		>
			<ArrowLeft size={14} />
			Kembali ke Tracker Proyek
		</a>

		<button
			type="button"
			onclick={handlePrint}
			class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition-all duration-150"
		>
			<Printer size={14} />
			<span>Cetak / Simpan PDF</span>
		</button>
	</div>

	<!-- Anvil HTML PDF Invoice Sheet -->
	<div class="anvil-invoice bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-8 sm:p-12 max-w-[800px] mx-auto print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
		
		<!-- Page counter in PDF print -->
		<div class="page-container">
			Page <span class="page"></span> of <span class="pages"></span>
		</div>

		<!-- Logo / Brand Header -->
		<div class="logo-container flex items-center justify-between">
			<div class="flex items-center gap-3.5">
				<div class="w-12 h-12 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 transition-colors duration-200 shadow-xs print:bg-white print:border-zinc-300">
					<span class="font-serif font-medium text-lg tracking-tighter text-zinc-900 dark:text-white print:text-black">HA</span>
				</div>
				<div>
					<span class="text-sm font-bold tracking-tight uppercase text-zinc-900 dark:text-white print:text-black">HAMAS AZIZAN</span>
					<span class="block text-[10px] text-zinc-400 dark:text-zinc-500 print:text-zinc-500 font-medium lowercase">hazizan.vercel.app</span>
				</div>
			</div>
		</div>

		<!-- Anvil Invoice Info Table -->
		<table class="invoice-info-container">
			<tbody>
				<tr>
					<td rowspan="2" class="client-name">
						<div class="font-bold text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 print:text-black leading-tight">
							{project.contactName || 'Klien Terhormat'}
						</div>
						{#if project.companyName}
							<div class="text-xs font-normal text-zinc-500 dark:text-zinc-400 print:text-zinc-600 mt-1">
								{project.companyName}
							</div>
						{/if}
						{#if project.contactEmail}
							<div class="text-xs font-normal text-zinc-400 dark:text-zinc-500 print:text-zinc-600">
								{project.contactEmail}
							</div>
						{/if}
					</td>
					<td class="font-semibold text-zinc-900 dark:text-zinc-100 print:text-black">
						Hamas Azizan
					</td>
				</tr>
				<tr>
					<td class="text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
						Digital Product Development
					</td>
				</tr>
				<tr>
					<td class="pt-2 text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
						Invoice Date: <strong class="text-zinc-900 dark:text-zinc-100 print:text-black">{formatDate(project.createdAt || project.startDate)}</strong>
					</td>
					<td class="text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
						Jakarta, Indonesia
					</td>
				</tr>
				<tr>
					<td class="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
						Invoice No: <strong class="text-zinc-900 dark:text-zinc-100 print:text-black">INV-{project.id.slice(-8).toUpperCase()}</strong>
					</td>
					<td class="text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
						hamasazeezan@gmail.com
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Anvil Line Items Table -->
		<table class="line-items-container">
			<thead>
				<tr>
					<th class="heading-quantity">Qty</th>
					<th class="heading-description">Description</th>
					<th class="heading-price">Price</th>
					<th class="heading-subtotal">Subtotal</th>
				</tr>
			</thead>
			<tbody>
				<!-- Scope Item 1 -->
				<tr>
					<td>1</td>
					<td>
						<span class="font-medium text-zinc-900 dark:text-zinc-100 print:text-black">
							{project.projectTitle || project.serviceType || 'Pengembangan Sistem & Desain Web'}
						</span>
						<span class="block text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600 mt-0.5">
							Mencakup perumusan BRD, desain UI/UX Figma, pengembangan frontend & backend, integrasi database, dan deployment.
						</span>
					</td>
					<td class="right">Rp {Number(totalPrice).toLocaleString('id-ID')}</td>
					<td class="bold right">Rp {Number(totalPrice).toLocaleString('id-ID')}</td>
				</tr>

				<!-- Breakdown Schedule Sub-row -->
				<tr class="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600 border-t border-dashed border-zinc-100 dark:border-zinc-800">
					<td>-</td>
					<td>
						<span class="font-medium text-zinc-700 dark:text-zinc-300 print:text-black">
							Termin 1: Uang Muka (DP {Math.round(dpRatio * 100)}%)
						</span>
						<span class="block text-[11px] text-zinc-400">Inisiasi pengerjaan & persetujuan spesifikasi teknis</span>
					</td>
					<td class="right text-zinc-600 dark:text-zinc-400">Rp {Number(dpAmount).toLocaleString('id-ID')}</td>
					<td class="right {isDpPaid ? 'text-emerald-600 dark:text-emerald-400 print:text-emerald-700' : 'text-amber-600 dark:text-amber-400'}">
						{isDpPaid ? '✓ Terbayar' : 'Tagihan Aktif'}
					</td>
				</tr>

				{#if !isFull}
					<tr class="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
						<td>-</td>
						<td>
							<span class="font-medium text-zinc-700 dark:text-zinc-300 print:text-black">
								Termin 2: Pelunasan Akhir ({100 - Math.round(dpRatio * 100)}%)
							</span>
							<span class="block text-[11px] text-zinc-400">Setelah UAT disetujui, sebelum rilis live & transfer source code</span>
						</td>
						<td class="right text-zinc-600 dark:text-zinc-400">Rp {Number(finalAmount).toLocaleString('id-ID')}</td>
						<td class="right {isSettled ? 'text-emerald-600 dark:text-emerald-400 print:text-emerald-700' : 'text-zinc-400'}">
							{isSettled ? '✓ Terbayar' : 'Tahap Akhir'}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<!-- Anvil Payment Info & Total Due Table -->
		<table class="line-items-container has-bottom-border">
			<thead>
				<tr>
					<th>Payment Info</th>
					<th>Due By</th>
					<th>Total Due</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="payment-info">
						<div>
							Bank Jago: <strong>1089 5642 3736</strong>
						</div>
						<div>
							GoPay / QRIS: <strong>0895630354422</strong>
						</div>
						<div class="text-zinc-400 dark:text-zinc-500 print:text-zinc-500 text-[11px]">
							a/n Hamas Azizan
						</div>
					</td>
					<td class="large text-zinc-800 dark:text-zinc-200 print:text-black">
						{formatDate(project.estimatedDelivery) || 'Upon Delivery'}
					</td>
					<td class="large total">
						Rp {Number(currentDue).toLocaleString('id-ID')}
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Anvil Footer -->
		<div class="footer">
			<div class="footer-info">
				<span>hamasazeezan@gmail.com</span> |
				<span>0895630354422</span> |
				<span>hazizan.vercel.app</span>
			</div>
			<div class="footer-thanks flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 print:text-black">
				<Heart size={16} class="text-[#fb7578] fill-[#fb7578] inline-block" />
				<span class="font-medium">Thank you!</span>
			</div>
		</div>

	</div>
</div>

<style>
	/* =======================================================
	   Anvil HTML-PDF-Invoice-Template Core Styles & Adaptation
	   ======================================================= */
	table {
		width: 100%;
		border-collapse: collapse;
	}

	table tr td {
		padding: 0;
	}

	table tr td:last-child {
		text-align: right;
	}

	.bold {
		font-weight: bold;
	}

	.right {
		text-align: right;
	}

	.large {
		font-size: 1.5em;
	}

	.total {
		font-weight: bold;
		color: #fb7578;
	}

	.logo-container {
		margin: 10px 0 50px 0;
	}

	.invoice-info-container {
		font-size: 0.875em;
	}

	.invoice-info-container td {
		padding: 4px 0;
	}

	.client-name {
		font-size: 1.25em;
		vertical-align: top;
	}

	.line-items-container {
		margin: 50px 0;
		font-size: 0.875em;
	}

	.line-items-container th {
		text-align: left;
		color: #999;
		border-bottom: 2px solid #ddd;
		padding: 10px 0 15px 0;
		font-size: 0.75em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.line-items-container th:last-child {
		text-align: right;
	}

	.line-items-container td {
		padding: 14px 0;
	}

	.line-items-container tbody tr:first-child td {
		padding-top: 20px;
	}

	.line-items-container.has-bottom-border tbody tr:last-child td {
		padding-bottom: 20px;
		border-bottom: 2px solid #ddd;
	}

	.line-items-container.has-bottom-border {
		margin-bottom: 0;
	}

	.line-items-container th.heading-quantity {
		width: 50px;
	}

	.line-items-container th.heading-price {
		text-align: right;
		width: 140px;
	}

	.line-items-container th.heading-subtotal {
		width: 140px;
	}

	.payment-info {
		width: 45%;
		font-size: 0.8em;
		line-height: 1.6;
	}

	.footer {
		margin-top: 60px;
	}

	.footer-thanks {
		font-size: 1.125em;
	}

	.footer-info {
		float: right;
		margin-top: 5px;
		font-size: 0.75em;
		color: #ccc;
	}

	.footer-info span {
		padding: 0 5px;
		color: inherit;
	}

	.footer-info span:last-child {
		padding-right: 0;
	}

	.page-container {
		display: none;
	}

	/* Print Styles */
	@media print {
		:global(aside), :global(nav), :global(header) {
			display: none !important;
		}

		:global(main) {
			margin-left: 0 !important;
			padding: 0 !important;
		}

		.invoice-wrapper {
			padding: 0 !important;
			background: white !important;
		}

		.anvil-invoice {
			border: none !important;
			box-shadow: none !important;
			padding: 0 !important;
			background: white !important;
			color: black !important;
			max-width: 100% !important;
		}

		.footer {
			margin-top: 30px;
		}

		.page-container {
			display: block;
			font-size: 12px;
			text-align: right;
			color: #999;
			margin-bottom: 20px;
		}

		.page-container .page::after {
			content: counter(page);
		}

		.page-container .pages::after {
			content: counter(pages);
		}
	}
</style>
