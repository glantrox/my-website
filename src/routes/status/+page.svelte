<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Search, ArrowRight, Trash2 } from 'lucide-svelte';

	let trackingInput = $state('');
	let errorMessage = $state('');
	let isSubmitting = $state(false);
	/** @type {Array<{ id: string, title: string, clientName?: string, date?: string }>} */
	let savedProjects = $state([]);

	onMount(() => {
		try {
			const saved = localStorage.getItem('saved_tracked_projects');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					savedProjects = parsed;
				}
			}
		} catch (e) {
			console.error('Failed to load saved projects:', e);
		}
	});

	/** @param {Event} [e] */
	function handleSubmit(e) {
		if (e) e.preventDefault();
		const cleanId = trackingInput.trim();
		if (!cleanId) {
			errorMessage = 'Please enter a valid Project ID';
			return;
		}

		errorMessage = '';
		isSubmitting = true;
		goto(`/status/${encodeURIComponent(cleanId)}`);
	}

	/** @param {string} id */
	function removeSavedProject(id) {
		savedProjects = savedProjects.filter(p => p.id !== id);
		try {
			localStorage.setItem('saved_tracked_projects', JSON.stringify(savedProjects));
		} catch (e) {
			console.error('Failed to update saved projects:', e);
		}
	}

	/** @param {string} [dateStr] */
	function formatSavedDate(dateStr) {
		if (!dateStr) return '';
		try {
			return new Date(dateStr).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return '';
		}
	}
</script>

<svelte:head>
	<title>Track Project | Hamas Azizan</title>
</svelte:head>

<div class="min-h-[calc(100vh-5rem)] md:min-h-screen flex flex-col justify-center items-center px-6 py-12 selection:bg-zinc-100 dark:selection:bg-zinc-800">
	<div class="w-full max-w-xl space-y-8 text-center -mt-10 sm:-mt-16">
		<!-- Minimal Header -->
		<header class="space-y-3 text-center">
			<h1 class="text-4xl md:text-5xl font-medium font-serif italic tracking-tight text-zinc-800 dark:text-zinc-100">
				Track Project
			</h1>
			<p class="text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-md mx-auto">
				Enter your Project ID to view milestone timeline, staging links, and invoice status.
			</p>
		</header>

		<!-- Clean Minimal Search Input Form -->
		<form onsubmit={handleSubmit} class="space-y-3 w-full">
			<div class="relative flex items-center">
				<Search class="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
				<input
					type="text"
					bind:value={trackingInput}
					placeholder="Enter Project ID (e.g. 6wLqZb81...)"
					class="w-full pl-11 pr-28 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-sm font-sans text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors shadow-2xs"
				/>
				<button
					type="submit"
					disabled={isSubmitting}
					class="absolute right-1.5 inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs py-2 px-3.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
				>
					<span>Track</span>
					<ArrowRight size={13} />
				</button>
			</div>

			{#if errorMessage}
				<p class="text-xs text-rose-500 font-medium text-center">
					{errorMessage}
				</p>
			{/if}
		</form>

		<!-- Minimal Saved / Recent Projects List (if available) -->
		{#if savedProjects.length > 0}
			<section class="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-left">
				<span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block text-center">
					Recently Tracked on this Device
				</span>

				<div class="divide-y divide-zinc-100 dark:divide-zinc-800/60 border border-zinc-100 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-50/20 dark:bg-zinc-900/10">
					{#each savedProjects as project (project.id)}
						<div class="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors text-xs group">
							<a href="/status/{project.id}" class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
								<span class="font-medium text-zinc-800 dark:text-zinc-200 truncate">
									{project.title || 'Project Specification'}
								</span>
								<span class="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
									{project.id}
								</span>
							</a>

							<div class="flex items-center gap-3 shrink-0">
								{#if project.date}
									<span class="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
										{formatSavedDate(project.date)}
									</span>
								{/if}
								<button
									type="button"
									onclick={() => removeSavedProject(project.id)}
									class="text-zinc-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer p-0.5"
									title="Remove from list"
								>
									<Trash2 size={12} />
								</button>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>
