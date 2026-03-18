<script>
	import { projects } from '$lib/data.js';
</script>

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<section>
		<h2 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-12">
			Selected Projects
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-24">
			{#each projects as project (project.id)}
				<article class="group cursor-pointer">
					<!-- Image Container with subtle gray background -->
					<div
						class="bg-zinc-50 rounded-xl overflow-hidden mb-5 aspect-[4/3] border border-zinc-100 relative"
					>
						<!-- Placeholder colored block to simulate loading/image presence if img fails -->
						<div class="absolute inset-0 bg-zinc-100 animate-pulse -z-10"></div>
						<img
							src={project.imageUrl}
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
				</article>
			{/each}
		</div>
	</section>
</div>
