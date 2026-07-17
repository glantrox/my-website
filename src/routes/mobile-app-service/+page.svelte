<script>
    import { 
        Smartphone, 
        Cpu, 
        Layers, 
        Database, 
        Github, 
        ArrowRight, 
        CheckCircle2, 
        Sparkles, 
        ExternalLink, 
        Wrench,
        Terminal
    } from "lucide-svelte";

    // Tech Stack List
    const techStack = [
        { name: "Flutter", description: "Cross-platform mobile SDK", color: "text-blue-500 border-blue-500/20 bg-blue-500/5" },
        { name: "React Native", description: "Native hybrid apps", color: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5" },
        { name: "Swift", description: "iOS native development", color: "text-orange-500 border-orange-500/20 bg-orange-500/5" },
        { name: "Kotlin", description: "Android native development", color: "text-purple-500 border-purple-500/20 bg-purple-500/5" },
        { name: "Firebase", description: "Realtime DB & cloud auth", color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" },
        { name: "Node.js", description: "Scalable backend services", color: "text-green-500 border-green-500/20 bg-green-500/5" },
        { name: "SQLite", description: "Local embedded storage", color: "text-sky-500 border-sky-500/20 bg-sky-500/5" },
        { name: "Fastlane", description: "App store deployment automation", color: "text-rose-500 border-rose-500/20 bg-rose-500/5" }
    ];

    // Case Studies Data
    const mobileProjects = [
        {
            title: "AttendMe App",
            tagline: "Cross-platform mobile attendance tracking system.",
            tech: ["Flutter", "iOS", "Android", "Firebase"],
            github: "https://github.com/Izan2020/attendme_app",
            challenge: "Organizations faced delays and high error rates in manual attendance logging, especially for remote or multi-site teams.",
            solution: "Developed an intuitive Flutter app for instant attendance logging with offline-first support, sync queues, and administrative insights.",
            outcome: "Empowered organizations to process attendance logs with sub-second synchronization and zero data loss on unstable connections."
        },
        {
            title: "Mooshaf App",
            tagline: "High-performance native Android Quran reader.",
            tech: ["Android SDK", "Java/Kotlin", "SQLite", "Material Design 3"],
            github: "https://github.com/Izan2020/mooshaf_app",
            challenge: "Existing readers had slow page-turn performance, high resource overhead, and lacked responsive layouts for multiple Android tablet/phone sizes.",
            solution: "Engineered a native Android app optimizing text rendering adapters, featuring cached database queries, local bookmark systems, and theme compliance.",
            outcome: "Achieved seamless page animations, low RAM foot-print, and clean material aesthetics for modern mobile devices."
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
    <title>Mobile App Development Services | Hamas Azizan</title>
    <meta name="description" content="High-performance cross-platform and native iOS & Android mobile apps engineered for speed, custom API integrations, and smooth UI/UX." />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24 selection:bg-emerald-100 selection:text-emerald-950 dark:selection:bg-emerald-950/50 dark:selection:text-emerald-300">
    
    <!-- Hero Section -->
    <section class="mb-24 md:mb-32 text-center max-w-3xl mx-auto">
        <p class="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
            Service / Mobile App Development
        </p>

        <h1 class="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.9] text-zinc-800 dark:text-zinc-100 mb-6">
            Native feel.<br />
            <span class="text-zinc-300 dark:text-zinc-200/50">One codebase.</span>
        </h1>

        <p class="text-zinc-500 dark:text-zinc-400 font-serif italic text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            / Crafting mobile apps that start fast and stay smooth /
        </p>

        
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- Core Capabilities -->
    <section class="mb-24 md:mb-32" id="capabilities">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Core Capabilities
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Cap 1 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Layers size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Cross-Platform Tech</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Deployment on iOS and Android from a unified codebase using Flutter or React Native. Drastically reduces time-to-market while keeping native UI metrics.
                </p>
            </div>

            <!-- Cap 2 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Smartphone size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Native Experience</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Custom fluid micro-animations (60fps/120fps physics engine bounds), offline-first caching schemas, local SQLite/Hive storage, and native platform integration.
                </p>
            </div>

            <!-- Cap 3 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Database size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Robust Integrations</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Complex third-party API configurations, hardware-level sensors, secure JWT token mechanisms, Firestore real-time sync, and background task processing.
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

    <!-- Pipeline Timeline -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Our Development Pipeline
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
                        <span class="text-xs font-bold uppercase tracking-wider text-emerald-500">Phase 01</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Discovery & Wireframing</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Mapping user journeys, defining MVP scopes, and establishing core application logic. We align early on features like offline behavior, navigation structures, and API dependencies to build a concrete technical outline.
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
                        <span class="text-xs font-bold uppercase tracking-wider text-emerald-500">Phase 02</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Interactive UI/UX</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Designing high-fidelity layouts centered on mobile ergonomics. We emphasize accessibility (WCAG color ratios, dynamic font scales) and follow Apple human interface guidelines (HIG) and Android Material Design 3 structures.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="relative">
                <!-- Bullet Indicator -->
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-emerald-500 dark:border-emerald-500/80 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div class="flex flex-col md:flex-row md:gap-12 items-start">
                    <div class="md:w-1/4 mb-2 md:mb-0">
                        <span class="text-xs font-bold uppercase tracking-wider text-emerald-500">Phase 03</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">Agile Engineering & QA</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium font-sans">
                            Writing modular, test-covered logic with Sentry error monitoring and CI/CD pipelines. Rigorous manual and automated test execution across diverse viewports, Android OS versions, and bandwidth constraints.
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
                        <span class="text-xs font-bold uppercase tracking-wider text-emerald-500">Phase 04</span>
                        <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mt-1">App Store Delivery</h4>
                    </div>
                    <div class="md:w-3/4">
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Managing submission cycles, content rating guidelines, and developer consoles for App Store and Google Play. Complete delivery of clean git repositories, setup configurations, and documentation for ownership handoff.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Case Studies Section -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Selected Case Studies
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {#each mobileProjects as project, idx}
                <div class="flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 p-8 rounded-2xl relative overflow-hidden group">
                    <!-- Title Area -->
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h4 class="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{project.title}</h4>
                            <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{project.tagline}</p>
                        </div>
                        {#if project.github}
                            <a href={project.github} target="_blank" rel="noopener noreferrer" class="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-105 transition-all" aria-label="View Source Code">
                                <Github size={16} />
                            </a>
                        {/if}
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
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'challenge' ? 'text-emerald-500' : 'text-zinc-400'}"
                            onclick={() => setTab(idx, "challenge")}
                        >
                            The Challenge
                            {#if activeTabs[idx] === 'challenge'}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></span>
                            {/if}
                        </button>
                        <button 
                            type="button"
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'solution' ? 'text-emerald-500' : 'text-zinc-400'}"
                            onclick={() => setTab(idx, "solution")}
                        >
                            The Solution & Outcome
                            {#if activeTabs[idx] === 'solution'}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></span>
                            {/if}
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="flex-1">
                        {#if activeTabs[idx] === "challenge"}
                            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
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

    <!-- Pricing & Transparency -->
    <section class="mb-24 md:mb-32">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            Estimasi Biaya & Transparansi Scope
        </h3>

        <!-- Development Fee One-Time Grid -->
        <div class="mb-16">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Basic Card -->
                <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                    <div>
                        <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Basic MVP</span>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="flex flex-col text-[10px] text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                                <span>start</span>
                                <span>from</span>
                            </div>
                            <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                                Rp 10.000.000
                            </h5>
                        </div>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
                            Aplikasi MVP (Minimum Viable Product), fungsionalitas simpel, UI standar, dan integrasi database basic (Firebase/Supabase).
                        </p>
                        
                           <div class="">
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300">Skenario</h5>
                    <ul class="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <li><strong>Domain:</strong> .com atau .id (~Rp 150.000 – Rp 250.000 / tahun)</li>
                        <li><strong>Hosting/VPS:</strong> Entry-level (1vCPU, 1-2GB RAM) (~Rp 50.000 – Rp 100.000 / bulan)</li>
                    </ul>
                </div>
                    </div>
                </div>

                <!-- Intermediate Card -->
                <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                    <div>
                        <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Intermediate Custom</span>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="flex flex-col text-[10px]  text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                                <span>start</span>
                                <span>from</span>
                            </div>
                            <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                                Rp 25.000.000
                            </h5>
                        </div>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Aplikasi bisnis kustom, integrasi Payment Gateway, fitur geolokasi (Maps), notifikasi real-time, dan arsitektur backend dedicated.
                        </p>
                        <div class="space-y-2">
                            <h5 class="font-bold text-zinc-700 dark:text-zinc-300">Skenario</h5>
                            <ul class="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                <li><strong>Domain:</strong> Sejenis .com atau .co.id (~Rp 200.000 / tahun)</li>
                                <li><strong>VPS:</strong> Standard Production (2-4vCPU, 4-8GB RAM) (~Rp 200.000 – Rp 500.000 / bulan)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Enterprise Card -->
                <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                    <div>
                        <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Industrial / Enterprise</span>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="flex flex-col text-[10px]  text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                                <span>start</span>
                                <span>from</span>
                            </div>
                            <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                                Rp 60.000.000
                            </h5>
                        </div>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Aplikasi skala industri / IoT tracking, performa tinggi, keamanan berlapis, dan optimasi arsitektur cloud untuk traffic besar.
                        </p>
                        <div class="space-y-2">
                            <h5 class="font-bold text-zinc-700 dark:text-zinc-300">Skenario </h5>
                            <ul class="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                <li><strong>Cloud:</strong> AWS/GCP/DigitalOcean scaling (~Rp 1.000.000+ / bulan depending on traffic)</li>
                                <li><strong>Dedicated VPS:</strong> &gt;8 Core, &gt;16GB RAM (~Rp 1.000.000+ / bulan)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Infrastructure & Server scenarios -->
        <div class="p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
            
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-3xl">
                <strong class="text-zinc-700 dark:text-zinc-300 font-medium">Catatan Penting:</strong> Biaya pembuatan (Development Fee) dibayarkan di awal kepada kami, sedangkan biaya infrastruktur (Domain & Cloud/VPS) adalah biaya operasional pihak ketiga yang wajib dibayarkan secara berkala agar platform tetap online.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
             
                
                
            </div>
        </div>
    </section>

    <!-- Ownership & Handoff -->
    <section class="mb-24 md:mb-32 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-[2rem]">
        <div class="max-w-3xl">
            <h3 class="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                <Sparkles class="text-emerald-500" size={20} />
                Client Guarantee: Code Ownership & Support
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                All mobile products are developed with the primary principle that the intellectual property and code assets remain entirely yours. There are no proprietary lock-ins or licensing layers.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">100% Code Ownership</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Complete access to Git repositories and build configs upon completion.</p>
                </div>
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">Detailed Technical Doc</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Step-by-step developer guidelines for setup, variables, and store deploy.</p>
                </div>
                <div>
                    <h5 class="font-bold text-zinc-700 dark:text-zinc-300 mb-1">30-Day Support Window</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Direct response channel for server migrations, adjustments, or critical fixes.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="border-t border-zinc-100 dark:border-zinc-800/80 pt-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Ready to build your mobile application?
            </h2>
            <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
                Let's discuss your product requirements, tech stack alignment, and project timeline.
            </p>
        </div>

        <a 
            href="mailto:hamasazeezan@gmail.com?subject=Mobile App Development Inquiry" 
            class="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium py-3 px-6 rounded-xl transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
            id="cta-mobile-contact"
        >
            Book a Discovery Call
            <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
        </a>
    </section>
</div>
