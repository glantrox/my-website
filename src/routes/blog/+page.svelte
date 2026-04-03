<script>
	import { blogPosts } from '$lib/data.js';
</script>

<div class="max-w-4xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<header class="mb-16">
		<h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">From the Blog</h1>
		<p class="mt-2 text-lg text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">
			A collection of thoughts on design, technology, and everything in between.
		</p>
	</header>

	<div class="space-y-12">
		{#each blogPosts as post (post.id)}
			<article class="group relative flex flex-col items-start">
				<h2 class="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
					<a href={'/blog/' + post.id} class="hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 dark:text-zinc-500 transition-colors">{post.title}</a>
				</h2>
				<time
					class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5"
					datetime={post.date}
				>
					<span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
						<span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></span>
					</span>
					{new Date(post.date).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}
				</time>
				<p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 leading-relaxed">
					{post.summary}
				</p>
				<!-- <a
					href={'/blog/' + post.id}
					class="relative z-10 mt-4 flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 dark:text-zinc-500 transition-colors"
					aria-label={`Read more: "${post.title}"`}
				>
					Read more
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
					>
						<path
							fill-rule="evenodd"
							d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
							clip-rule="evenodd"
						></path>
					</svg>
				</a> -->
			</article>
		{/each}
	</div>
</div>
