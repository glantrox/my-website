<script>
	import { professionalExperience, toolkit } from '$lib/data.js';
</script>
<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<!-- Hero Section -->
	<section class="mb-32">
		<p class="text-[10px] text-zinc-400 uppercase tracking-widest mb-12">
			Portfolio & Selected Works
		</p>

		<div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
			<!-- Massive Typography -->
			<div class="flex-1">
				<h1 class="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] text-zinc-300">
					Hamas<br />
					<span class="text-zinc-800">Azizan</span>
				</h1>
				<p class="mt-4 text-zinc-400 font-serif italic text-xl">/ Undergraduate BINUS <br> Computer Science Student /</p>
			</div>

			<!-- Info Text Block -->
			<div class="flex-1 lg:max-w-md pt-4 lg:pt-12">
				<h3 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-6">Info</h3>
				<div class="space-y-6 text-sm text-zinc-600 leading-relaxed">
					<p>
						I'm a designer focused on creating intuitive, human-centered interfaces for web and
						mobile platforms.
					</p>
					<p>
						For a long time, I've been designing digital spaces that people can navigate
						seamlessly. My approach is rooted in simplicity and clarity, striving to build tools
						that feel natural and empowering to use.
					</p>
					<p>
						Currently working on a small startup project, and open to freelance opportunities. If you're interested in collaborating, feel free to reach out!
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Spacer -->
	<hr class="border-zinc-100 my-24" />

	<!-- Professional Experience Section -->
	<section class="mb-32">
		<h3 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-12">
			Professional Experience
		</h3>
		<div class="space-y-8">
			{#each professionalExperience as job (job.company)}
				<div class="flex flex-col sm:flex-row justify-between sm:items-center">
					<div class="mb-2 sm:mb-0">
						<h4 class="font-medium text-zinc-800">{job.company}</h4>
						<p class="text-sm text-zinc-500">{job.title}</p>
					</div>
					<p class="text-sm text-zinc-400">{job.duration}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Spacer -->
	<hr class="border-zinc-100 my-24" />

	<!-- My Toolkit Section -->
	<section>
		<h3 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-12">
			My Toolkit
		</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
			{#each toolkit as category (category.category)}
				<div>
					<h4 class="font-medium text-zinc-800 mb-3">{category.category}</h4>
					<ul class="space-y-2 text-sm text-zinc-500">
						{#each category.tools as tool}
							<li>{tool}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<!-- Spacer -->
	<hr class="border-zinc-100 my-24" />

	<!-- Footer -->
	<footer
		class="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400"
	>
		<p>© {new Date().getFullYear()} Hamas Azizan. All rights reserved.</p>
		<div class="flex gap-6 mt-4 md:mt-0">
			<a href="https://twitter.com/hamasazizan" class="hover:text-zinc-800 transition-colors">Twitter</a>
			<a href="https://linkedin.com/in/hamasazizan" class="hover:text-zinc-800 transition-colors">LinkedIn</a>
			<a href="https://read.cv/hamasazizan" class="hover:text-zinc-800 transition-colors">Read.cv</a>
		</div>
	</footer>
</div>
