<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.post.title} | Hamas Azizan Blog</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-12 md:px-16 md:py-24">
    <article class="space-y-6">
        <header class="space-y-3">
            <time class="text-sm text-zinc-400 dark:text-zinc-500">
                {new Date(data.post.date).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </time>
            <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                {data.post.title}
            </h1>
        </header>

        <div class="mt-8 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-6">
            <p>{data.post.summary}</p>
            <p class="font-serif italic text-zinc-500 dark:text-zinc-500">
                (This is a placeholder for the full article content. In a production system, this would be loaded from a markdown/CMS document or database repository.)
            </p>
        </div>

        <div class="pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-12">
            <a href="/blog" class="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                &larr; Back to all blog posts
            </a>
        </div>
    </article>
</div>
