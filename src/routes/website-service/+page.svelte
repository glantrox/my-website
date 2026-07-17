<script>
    import { 
        Globe, 
        Zap, 
        LayoutGrid, 
        Search, 
        Gauge, 
        Code2, 
        Database, 
        Github, 
        ArrowRight, 
        CheckCircle2, 
        Sparkles, 
        ExternalLink
    } from "lucide-svelte";

    // Tech Stack List
    const techStack = [
        { name: "Svelte / SvelteKit", description: "Cybernetic web application framework", color: "text-orange-500 border-orange-500/20 bg-orange-500/5" },
        { name: "React / Next.js", description: "Production-grade SSR framework", color: "text-blue-500 border-blue-500/20 bg-blue-500/5" },
        { name: "Tailwind CSS", description: "Utility-first layout styling engine", color: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5" },
        { name: "TypeScript", description: "Type-safe robust javascript scripting", color: "text-blue-600 border-blue-600/20 bg-blue-600/5" },
        { name: "PostgreSQL", description: "Acid-compliant relational database", color: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5" },
        { name: "Node.js", description: "Scalable network applications runtime", color: "text-green-500 border-green-500/20 bg-green-500/5" },
        { name: "Firebase", description: "Fast client-side databases & sync", color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" },
        { name: "Headless CMS", description: "Decoupled content modeling (Sanity, Strapi)", color: "text-rose-500 border-rose-500/20 bg-rose-500/5" }
    ];

    // Case Studies Data
    const webProjects = [
        {
            title: "TernakAja AgTech",
            tagline: "Beef Supply Chain IoT & Analytics Platform.",
            tech: ["React", "FastAPI", "PostgreSQL", "Tailwind", "ESP32"],
            link: "/ternakaja",
            github: "https://github.com/glantrox",
            challenge: "Cattle farmers needed automated ways to monitor metrics and yield analysis without heavy manual tracking overhead.",
            solution: "Engineered a bento-style responsive data dashboard aggregating ESP32 IoT sensor arrays, complete with dynamic regression line graphs.",
            outcome: "Streamlined cattle health workflows with real-time sensor processing and analytical telemetry visualization."
        },
        {
            title: "Clymate Website",
            tagline: "Weather & Forecast Web Application.",
            tech: ["HTML/CSS", "JavaScript", "OpenWeather API", "Tailwind"],
            link: "/projects",
            github: "https://github.com/glantrox/clymate-web",
            challenge: "Standard weather applications are cluttered with ads and suffer from sluggish search queries across global locations.",
            solution: "Developed a clean, performance-optimized, single-page weather application fetching telemetry via asynchronous fetch queues.",
            outcome: "Provided sub-second weather reporting, location caching, and clean modern aesthetics aligned on a fluid screen layout."
        }
    ];

    // Active project state for showing Challenge vs Solution
    let activeTabs = $state(["challenge", "challenge"]);

    /**
     * @param {number} idx
     * @param {string} tab
     */
    function setTab(idx, tab) {
        activeTabs[idx] = tab;
    }
</script>

<svelte:head>
    <title>Web Development & Design Services | Hamas Azizan</title>
    <meta name="description" content="Blazing fast, conversion-driven websites and B2B SaaS dashboards engineered with modern frameworks like SvelteKit, React, Next.js, and Tailwind CSS." />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24 selection:bg-blue-100 selection:text-blue-950 dark:selection:bg-blue-950/50 dark:selection:text-blue-300">
    
    <!-- Hero Section -->
    <section class="mb-24 md:mb-32 text-center max-w-3xl mx-auto">
        <p class="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
            Service / Web Engineering
        </p>

        <h1 class="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.9] text-zinc-800 dark:text-zinc-100 mb-6">
            Clean code.<br />
            <span class="text-zinc-300 dark:text-zinc-200/50">Fast loading.</span>
        </h1>

        <p class="text-zinc-500 dark:text-zinc-400 font-serif italic text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            / Building web systems with solid performance foundations /
        </p>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- Case Studies Section (Proof first) -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Selected Case Studies
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {#each webProjects as project, idx}
                <div class="flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 p-8 rounded-2xl relative overflow-hidden group">
                    <!-- Title Area -->
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h4 class="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{project.title}</h4>
                            <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{project.tagline}</p>
                        </div>
                        <div class="flex gap-2">
                            {#if project.github}
                                <a href={project.github} target="_blank" rel="noopener noreferrer" class="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-105 transition-all" aria-label="View Source Code">
                                    <Github size={16} />
                                </a>
                            {/if}
                            {#if project.link}
                                <a href={project.link} class="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-105 transition-all" aria-label="View Project Page">
                                    <ExternalLink size={16} />
                                </a>
                            {/if}
                        </div>
                    </div>

                    <!-- Tech Badges -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        {#each project.tech as tag}
                            <span class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        {/each}
                    </div>

                    <!-- Interactive Tabs (Challenge vs Solution/Outcome) -->
                    <div class="border-b border-zinc-100 dark:border-zinc-800 flex gap-4 text-xs font-bold uppercase tracking-wider mb-4">
                        <button 
                            type="button"
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'challenge' ? 'text-blue-500' : 'text-zinc-400'}"
                            onclick={() => setTab(idx, "challenge")}
                        >
                            The Challenge
                            {#if activeTabs[idx] === 'challenge'}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                            {/if}
                        </button>
                        <button 
                            type="button"
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'solution' ? 'text-blue-500' : 'text-zinc-400'}"
                            onclick={() => setTab(idx, "solution")}
                        >
                            The Solution & Outcome
                            {#if activeTabs[idx] === 'solution'}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                            {/if}
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="flex-1">
                        {#if activeTabs[idx] === "challenge"}
                            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                                {project.challenge}
                            </p>
                        {:else}
                            <div class="space-y-3">
                                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <strong class="text-zinc-700 dark:text-zinc-300 font-medium">Architecture:</strong> {project.solution}
                                </p>
                                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <strong class="text-zinc-700 dark:text-zinc-300 font-medium">Result:</strong> {project.outcome}
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Pricing & Transparency (Commercial clarity next) -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Estimasi Biaya & Transparansi Scope
        </h3>

        <!-- Catatan Penting -->
        <div class="mb-10 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <span class="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Catatan Penting untuk Klien:</span>
            Biaya pembuatan (Development Fee) adalah biaya one-time yang dibayarkan di awal kepada kami, sedangkan biaya infrastruktur (Domain & Cloud/VPS) adalah biaya operasional pihak ketiga yang wajib dibayarkan secara berkala agar platform tetap online.
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Basic Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-blue-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
                    <span class="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-2">Basic MVP</span>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex flex-col text-[10px]  text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                            <span>start</span>
                            <span>from</span>
                        </div>
                        <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            Rp 2.500.000
                        </h5>
                    </div>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[96px] md:min-h-[112px]">
                        Landing Page, Website Company Profile statis (3–5 halaman), dan Blog sederhana.
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Domain (.com / .id)</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 150.000 - 250.000<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / thn</span></td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">Hosting/VPS Entry</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 50.000 - 100.000<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=web_service&tier=basic" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Pilih Paket Basic
                </a>
            </div>

            <!-- Intermediate Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-blue-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
                    <span class="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-2">Intermediate Custom</span>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex flex-col text-[10px]  text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                            <span>start</span>
                            <span>from</span>
                        </div>
                        <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            Rp 6.000.000
                        </h5>
                    </div>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[96px] md:min-h-[112px]">
                        E-commerce lokal, Portal Berita, dan Web Kustom dengan Dashboard Admin (Multi-role).
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Domain (.com / .co.id)</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 200.000<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / thn</span></td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">Production VPS</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 200.000 - 500.000<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=web_service&tier=intermediate" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Pilih Paket Intermediate
                </a>
            </div>

            <!-- Enterprise Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-blue-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
                    <span class="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-2">Industrial / Enterprise</span>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex flex-col text-[10px]  text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                            <span>start</span>
                            <span>from</span>
                        </div>
                        <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            Rp 20.000.000
                        </h5>
                    </div>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[96px] md:min-h-[112px]">
                        B2B SaaS Dashboard, Platform FinTech, dan Web Application kompleks dengan integrasi multi-API.
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Cloud Scaling</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 1.000.000+<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">Dedicated VPS</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 1.000.000+<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=web_service&tier=industrial" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Hubungi Kami (Enterprise)
                </a>
            </div>
        </div>
    </section>

    <!-- Delivery Process (Operational roadmap) -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            The Delivery Process
        </h3>

        <div class="relative pl-6 border-l border-zinc-100 dark:border-zinc-800 space-y-12">
            <!-- Step 1 -->
            <div class="relative">
                <!-- Bullet Indicator -->
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                </div>
                <div class="flex flex-col md:flex-row md:gap-12 items-start">
                    <div class="md:w-1/4 mb-2 md:mb-0">
                        <span class="text-xs font-bold uppercase tracking-wider text-blue-500">Phase 01</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Architecture & Mapping</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Defining page hierarchy, component matrices, technical constraints, data schemas, and routing layers. This step ensures we align on requirements, content models, and integrations before writing code.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 2 -->
            <div class="relative">
                <!-- Bullet Indicator -->
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                </div>
                <div class="flex flex-col md:flex-row md:gap-12 items-start">
                    <div class="md:w-1/4 mb-2 md:mb-0">
                        <span class="text-xs font-bold uppercase tracking-wider text-blue-500">Phase 02</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Component Design</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Developing reusable, isolated components aligned on a unified style guide (colors, typography scales, spacing tokens). This promotes visual coherence, clean layouts, and rapid interface adjustments.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="relative">
                <!-- Bullet Indicator -->
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 dark:border-blue-500/80 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </div>
                <div class="flex flex-col md:flex-row md:gap-12 items-start">
                    <div class="md:w-1/4 mb-2 md:mb-0">
                        <span class="text-xs font-bold uppercase tracking-wider text-blue-500">Phase 03</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Frontend & Backend Engineering</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
                            Programming modular routes and secure database interfaces using SvelteKit or Next.js. We integrate static assets efficiently, coordinate external APIs, configure global state managers, and verify layout response across all viewports.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 4 -->
            <div class="relative">
                <!-- Bullet Indicator -->
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                </div>
                <div class="flex flex-col md:flex-row md:gap-12 items-start">
                    <div class="md:w-1/4 mb-2 md:mb-0">
                        <span class="text-xs font-bold uppercase tracking-wider text-blue-500">Phase 04</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Audit & Launch</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Running comprehensive Core Web Vitals checks to achieve 90+ Lighthouse indexes. Configuring host domains, DNS maps, and SSL layers. Providing complete repository handover, setup documents, and post-launch review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Capabilities (Technical details pushed down) -->
    <section class="mb-24 md:mb-32" id="capabilities">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Core Focus Areas
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Cap 1 -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-blue-500/20 hover:bg-blue-500/[0.01] dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-105 transition-transform">
                    <LayoutGrid size={18} />
                </div>
                <h5 class="font-medium text-zinc-800 dark:text-zinc-200 mb-2 text-base">Custom Web Apps & SaaS</h5>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Complex web applications and analytical dashboards featuring secure session handshakes, state management, and relational schema database patterns.
                </p>
            </div>

            <!-- Cap 2 -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-blue-500/20 hover:bg-blue-500/[0.01] dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-105 transition-transform">
                    <Globe size={18} />
                </div>
                <h5 class="font-medium text-zinc-800 dark:text-zinc-200 mb-2 text-base">Interactive Landing Pages</h5>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    High-end, grid-aligned marketing assets configured with elegant styling transitions, custom interactive typography, and conversion elements.
                </p>
            </div>

            <!-- Cap 3 -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-blue-500/20 hover:bg-blue-500/[0.01] dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-105 transition-transform">
                    <Gauge size={18} />
                </div>
                <h5 class="font-medium text-zinc-800 dark:text-zinc-200 mb-2 text-base">Performance-First Setup</h5>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Prioritizing Google Lighthouse metrics and Core Web Vitals. Code splits, image optimization, and caching rules ensure sub-second loads.
                </p>
            </div>

            <!-- Cap 4 -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-blue-500/20 hover:bg-blue-500/[0.01] dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-105 transition-transform">
                    <Search size={18} />
                </div>
                <h5 class="font-medium text-zinc-800 dark:text-zinc-200 mb-2 text-base">SEO & Accessibility</h5>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Semantic HTML structures, JSON-LD schema bindings, meta tags optimization, and full keyboard-focusable WCAG compliance.
                </p>
            </div>
        </div>
    </section>

    <!-- Tech Stack -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            The Tech Stack
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {#each techStack as tech}
                <div class="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200">
                    <div>
                        <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-3 {tech.color}">
                            {tech.name}
                        </span>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {tech.description}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Ownership & Handoff -->
    <section class="mb-24 md:mb-32 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-[2rem]">
        <div class="max-w-3xl">
            <h3 class="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                <Sparkles class="text-blue-500" size={20} />
                Client Guarantee: Code Ownership & Support
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                All websites and custom dashboards are developed with the primary principle that the intellectual property and code assets remain entirely yours. There are no proprietary lock-ins or licensing layers.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">100% Code Ownership</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Complete access to Git repositories, build scripts, and static configs upon completion.</p>
                </div>
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">Detailed Technical Doc</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Step-by-step documentation detailing environment configurations, component parameters, and hosting maps.</p>
                </div>
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">30-Day Support Window</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Direct support for server migrations, domain configuration, or post-launch adjustments.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="border-t border-zinc-100 dark:border-zinc-800/80 pt-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Ready to build your web platform?
            </h2>
            <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
                Let's discuss your product requirements, tech stack alignment, and project timeline.
            </p>
        </div>

        <a 
            href="mailto:hamasazeezan@gmail.com?subject=Website Development Inquiry" 
            class="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium py-3 px-6 rounded-xl transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
            id="cta-web-contact"
        >
            Book a Discovery Call
            <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
        </a>
    </section>
</div>
