<script>
	import { afterUpdate, onDestroy } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	export let isOpen = false;
	export let onClose = () => {};

	// Store original overflow to restore it
	let originalBodyOverflow;

	// Crossfade transition for modal content
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),
		easing: quintOut
	});

	// Handle Escape key press
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Disable/enable body scrolling when modal opens/closes
	afterUpdate(() => {
		if (isOpen) {
			originalBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeydown);
		} else {
			document.body.style.overflow = originalBodyOverflow || '';
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		// Clean up event listener and restore body overflow if component is destroyed while modal is open
		window.removeEventListener('keydown', handleKeydown);
		document.body.style.overflow = originalBodyOverflow || '';
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-gray-200 bg-opacity-50"
			on:click={onClose}
			aria-hidden="true"
		></div>

		<!-- Modal Content -->
		<div
			use:receive
			class="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out"
		>
			<!-- Close Button -->
			<button
				on:click={onClose}
				class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
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

			<div use:send class="p-6">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	/* You might need global styles for fade transition if Svelte's built-in isn't enough */
</style>
