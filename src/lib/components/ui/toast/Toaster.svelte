<script lang="ts">
	import { toast } from "$lib/entities/toast";
	import Spinner from "../spinner.svelte";
	import { fade, fly } from "svelte/transition";
	import { flip } from "svelte/animate";
</script>

<div
	class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-[340px] px-4 sm:px-0 pointer-events-none"
	role="region"
	aria-live="polite"
	aria-label="Notifications"
>
	{#each toast.toasts as t (t.id)}
		<div
			animate:flip={{ duration: 200 }}
			in:fly={{ y: 15, duration: 250 }}
			out:fade={{ duration: 150 }}
			class="flex items-start gap-3 p-4 rounded-xl border bg-white dark:bg-zinc-950 shadow-xl pointer-events-auto border-zinc-250 dark:border-zinc-800 transition-all duration-200"
		>
			<!-- Icon based on type -->
			<div class="flex-shrink-0 mt-0.5">
				{#if t.type === 'success'}
					<svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{:else if t.type === 'error'}
					<svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{:else if t.type === 'loading'}
					<Spinner size={16} class="text-zinc-500" />
				{:else}
					<svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{/if}
			</div>

			<!-- Message content -->
			<div class="flex-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed select-none">
				{t.message}
			</div>

			<!-- Dismiss button -->
			{#if t.type !== 'loading'}
				<button
					onclick={() => toast.dismiss(t.id)}
					class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex-shrink-0 focus:outline-none"
					aria-label="Dismiss notification"
				>
					<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	{/each}
</div>
