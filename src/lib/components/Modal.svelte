<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		children?: import('svelte').Snippet;
		class?: string;
	}

	// Define props with Svelte 5 runes
	let { 
		isOpen = false, 
		onClose = () => {}, 
		children,
		class: className = 'max-w-lg w-full'
	}: Props = $props();

	// Crossfade transition for modal content
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),
		easing: quintOut
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Modern Svelte 5 effect for reactive side-effects (body scroll and keydown listener)
	$effect(() => {
		if (isOpen) {
			const originalBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeydown);

			// Clean up function runs when effect is destroyed or isOpen changes to false
			return () => {
				document.body.style.overflow = originalBodyOverflow || '';
				window.removeEventListener('keydown', handleKeydown);
			};
		}
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<!-- Backdrop -->
		<button
			class="fixed inset-0 bg-gray-200 dark:bg-zinc-950 bg-opacity-50 w-full h-full border-0 cursor-default focus:outline-none"
			onclick={onClose}
			aria-label="Close modal"
		></button>

		<!-- Modal Content -->
		<div
			in:receive={{ key: "modal" }}
			out:send={{ key: "modal" }}
			class="relative bg-white dark:bg-zinc-900 shadow-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out z-10 {className}"
		>
			<!-- Close Button -->
			<button
				onclick={onClose}
				class="absolute top-3 right-3 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="p-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

