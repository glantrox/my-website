<script>
	import { projects } from '$lib/data.js';
	import { X, ExternalLink, Github, Calendar, User, LayoutGrid, Code2 } from 'lucide-svelte';
	import { afterUpdate, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	let showModal = false;
	let selectedProject = null;
	let originalBodyOverflow;

	function openModal(project) {
		selectedProject = project;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedProject = null;
	}

	// Handle Escape key press
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	// Disable/enable body scrolling and attach/detach keydown listener when modal opens/closes
	afterUpdate(() => {
		if (showModal) {
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

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<section>
		<h2 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-12">
			Selected Projects
		</h2>

		<!-- Masonry Layout Container -->
		<div class="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
			{#each projects as project (project.id)}
				<button
					type="button"
					class="group cursor-pointer text-left mb-8 break-inside-avoid"
					on:click={() => openModal(project)}
				>
					<!-- Image Container with subtle gray background -->
					<div
						class="bg-zinc-50 rounded-xl overflow-hidden mb-5 border border-zinc-100 relative"
					>
						<!-- Placeholder colored block to simulate loading/image presence if img fails -->
						<div class="absolute inset-0 bg-zinc-100 animate-pulse -z-10"></div>
						<img
							src={project.image}
							alt={project.title}
							class="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
							loading="lazy"
						/>
					</div>

					<!-- Project Details -->
					<div class="flex justify-between items-start text-sm px-1">
						<div>
							<h3 class="text-zinc-900 font-medium">{project.title}</h3>
							<p class="text-zinc-500 mt-0.5">{project.subtitle}</p>
						</div>
						<div class="text-zinc-400 text-right">
							<span>{project.year}</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</section>
</div>

{#if showModal && selectedProject}
	<!-- Full Modal Overlay and Content -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 150 }}>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			on:click={closeModal}
			aria-hidden="true"
		></div>

		<!-- Modal Content -->
		<div
			class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
			role="dialog"
			aria-modal="true"
		>
			<!-- Close Button -->
			<button
				on:click={closeModal}
				class="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
				aria-label="Close modal"
			>
				<X size={20} />
			</button>

			<!-- Header Image -->
			<div class="w-full h-48 sm:h-64 relative shrink-0">
				<img src={selectedProject.image} alt={selectedProject.title} class="w-full h-full object-cover" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
				<div class="absolute bottom-4 left-6 right-6">
					<h2 class="text-2xl sm:text-3xl font-bold text-white mb-1">
						{selectedProject.title}
					</h2>
					<p class="text-slate-200 text-sm sm:text-base font-medium">
						{selectedProject.tagline}
					</p>
				</div>
			</div>

			<!-- Body Container -->
			<div class="p-6 sm:p-8 flex flex-col gap-8">
				<!-- Main Description -->
				<section>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
						<LayoutGrid size={20} class="text-blue-500" />
						About the Project
					</h3>
					<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
						{selectedProject.description}
					</p>
				</section>

				<!-- Details Grid -->
				<div
					class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800"
				>
					<div class="space-y-4">
						<div>
							<span
								class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
							>
								<Calendar size={16} /> Timeline
							</span>
							<p class="text-slate-900 dark:text-white font-medium">{selectedProject.date}</p>
						</div>
						<div>
							<span
								class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
							>
								<User size={16} /> My Role
							</span>
							<p class="text-slate-900 dark:text-white font-medium">{selectedProject.role}</p>
						</div>
					</div>

					<div class="space-y-4">
						<div>
							<span
								class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
							>
								<Code2 size={16} /> Status
							</span>
							<span
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {selectedProject.status && selectedProject.status.includes('Completed')
									? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
									: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}"
							>
								{selectedProject.status}
							</span>
						</div>
					</div>
				</div>

				<!-- Tech Stack -->
				<section>
					<h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
						Technologies Used
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each selectedProject.techStack as tech, index}
							<span
								key={index}
								class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-default"
							>
								{tech}
							</span>
						{/each}
					</div>
				</section>

				<!-- Action Links -->
				{#if selectedProject.links}
					<div
						class="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 mt-auto"
					>
						{#if selectedProject.links.live}
							<a
								href={selectedProject.links.live}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20"
							>
								<ExternalLink size={18} />
								View Live Site
							</a>
						{/if}
						{#if selectedProject.links.github}
							<a
								href={selectedProject.links.github}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl transition-colors shadow-sm"
							>
								<Github size={18} />
								Source Code
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
