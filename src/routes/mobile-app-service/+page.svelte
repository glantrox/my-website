<script>
    import { 
        Smartphone, 
        Layers, 
        Database, 
        Github, 
        ArrowRight, 
        Sparkles, 
        ExternalLink, 
        CheckCircle2,
        ShieldCheck,
        FileCode2,
        Headphones
    } from "lucide-svelte";

    // Tech Stack List
    const techStack = [
        { name: "Flutter", description: "Cross-platform mobile SDK", color: "text-blue-500 border-blue-500/20 bg-blue-500/5" },
        { name: "React Native", description: "Native hybrid apps", color: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5" },
        { name: "Swift", description: "iOS native development", color: "text-orange-500 border-orange-500/20 bg-orange-500/5" },
        { name: "Kotlin", description: "Android native development", color: "text-purple-500 border-purple-500/20 bg-purple-500/5" },
        { name: "Firebase", description: "Realtime DB & cloud auth", color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" },
        { name: "Node.js", description: "Scalable backend services", color: "text-green-500 border-green-500/20 bg-green-500/5" },
        { name: "SQLite / Hive", description: "Local embedded storage", color: "text-sky-500 border-sky-500/20 bg-sky-500/5" },
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
    
    <!-- 1. Hero Section (Hook & Value Proposition) -->
    <section class="mb-24 md:mb-32 text-center max-w-3xl mx-auto">
        <p class="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
            Service / Mobile App Development
        </p>

        <h1 class="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.9] text-zinc-800 dark:text-zinc-100 mb-6">
            Native feel.<br />
            <span class="text-zinc-300 dark:text-zinc-200/50">One codebase.</span>
        </h1>

        <p class="text-zinc-500 dark:text-zinc-400 font-serif italic text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            / Crafting mobile apps that start fast, scale seamlessly, and delight users /
        </p>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 2. Selected Case Studies (Proof & Tangible Results First) -->
    <section class="mb-24 md:mb-32" id="case-studies">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
                <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Proven Track Record
                </h3>
                <h2 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                    Selected Case Studies
                </h2>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
                Real-world solutions built with offline synchronization, high-speed rendering, and reliable backend infrastructure.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {#each mobileProjects as project, idx}
                <div class="flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 p-6 sm:p-8 rounded-2xl relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 shadow-xs">
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
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'challenge' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}"
                            onclick={() => setTab(idx, "challenge")}
                        >
                            The Challenge
                            {#if activeTabs[idx] === 'challenge'}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></span>
                            {/if}
                        </button>
                        <button 
                            type="button"
                            class="pb-2 relative focus:outline-none transition-colors {activeTabs[idx] === 'solution' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}"
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

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 3. Pricing & Transparency (Commercial Clarity Next) -->
    <section class="mb-24 md:mb-32" id="pricing">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
                <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Investasi & Transparansi
                </h3>
                <h2 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                    Estimasi Biaya & Paket Layanan
                </h2>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
                Struktur biaya transparan tanpa biaya tersembunyi. Skala disesuaikan dengan kebutuhan bisnis Anda.
            </p>
        </div>

        <!-- Catatan Penting -->
        <div class="mb-10 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <span class="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Catatan Penting untuk Klien:</span>
            Biaya pembuatan (Development Fee) adalah biaya one-time yang dibayarkan di awal kepada kami, sedangkan biaya lisensi developer store (Apple Developer Program $99/thn, Google Play Console $25 one-time) dan server/database adalah biaya operasional pihak ketiga yang dibayarkan langsung ke penyedia terkait.
        </div>

        <!-- Development Fee One-Time Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Basic Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
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
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[80px]">
                        Aplikasi MVP (Minimum Viable Product), fungsionalitas inti, UI bersih berbasis Flutter/React Native, dan integrasi database standar (Firebase/Supabase).
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Google Play Console</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">$25<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> (one-time)</span></td>
                            </tr>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Apple Developer</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">$99<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / thn</span></td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">Backend / Database</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">Free Tier / ~Rp 100k<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=mobile_app&tier=basic" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Pilih Paket Basic MVP
                </a>
            </div>

            <!-- Intermediate Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
                    <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Intermediate Custom</span>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex flex-col text-[10px] text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                            <span>start</span>
                            <span>from</span>
                        </div>
                        <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            Rp 25.000.000
                        </h5>
                    </div>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[80px]">
                        Aplikasi bisnis kustom, integrasi Payment Gateway, geolokasi/Maps, Push Notifications real-time, sinkronisasi offline, dan arsitektur API dedicated.
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Apple & Google Stores</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">Standard Store Licenses</td>
                            </tr>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Production Cloud DB</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">~Rp 350.000<span class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500"> / bln</span></td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">Push Notification Gateway</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">FCM (Free) / OneSignal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=mobile_app&tier=intermediate" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Pilih Paket Intermediate
                </a>
            </div>

            <!-- Enterprise Card -->
            <div class="p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between hover:border-emerald-500/20 transition-all min-h-[500px]">
                <div class="flex-1 flex flex-col">
                    <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Industrial / Enterprise</span>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex flex-col text-[10px] text-zinc-400 dark:text-zinc-500 font-bold leading-none">
                            <span>start</span>
                            <span>from</span>
                        </div>
                        <h5 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                            Rp 60.000.000
                        </h5>
                    </div>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 min-h-[80px]">
                        Aplikasi skala industri / IoT tracking, integrasi hardware/Bluetooth, enkripsi data berlapis, microservices high-throughput, dan SLA support.
                    </p>
                </div>
                
                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-6">
                    <h6 class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">Skenario Operasional (Pihak Ketiga)</h6>
                    <table class="w-full text-xs text-left border-collapse text-zinc-500 dark:text-zinc-400">
                        <tbody>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Cloud Autoscaling</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">AWS / GCP (~Rp 1.000.000+)</td>
                            </tr>
                            <tr class="border-b border-zinc-100 dark:border-zinc-800/40">
                                <td class="py-2 pr-2 font-medium">Dedicated Telemetry VPS</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">&gt;8 Core, &gt;16GB RAM</td>
                            </tr>
                            <tr>
                                <td class="py-2 pr-2 font-medium">CI/CD & App Store CI</td>
                                <td class="py-2 text-right font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">Fastlane / GitHub Actions</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a 
                    href="/order?service_type=mobile_app&tier=industrial" 
                    class="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
                >
                    Hubungi Kami (Enterprise)
                </a>
            </div>
        </div>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 4. Client Guarantees & Risk Reversal -->
    <section class="mb-24 md:mb-32 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-[2rem]">
        <div class="max-w-4xl">
            <h3 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2.5">
                <Sparkles class="text-emerald-500 shrink-0" size={24} />
                Client Guarantee: 100% Code Ownership & Support
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-2xl">
                Setiap aplikasi mobile yang kami bangun sepenuhnya menjadi aset intelektual bisnis Anda. Tanpa sistem sewa lisensi tertutup (vendor lock-in), tanpa biaya royalti tersembunyi.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div class="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <ShieldCheck size={18} />
                    </div>
                    <h5 class="font-bold text-zinc-800 dark:text-zinc-200 mb-1">100% Code Ownership</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Hak cipta penuh, akses repositori Git lengkap, dan file build diserahkan saat rilis.</p>
                </div>
                <div class="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <FileCode2 size={18} />
                    </div>
                    <h5 class="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Detailed Technical Doc</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Panduan instalasi, konfigurasi variabel environment, dan panduan upload ke App Store.</p>
                </div>
                <div class="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <Headphones size={18} />
                    </div>
                    <h5 class="font-bold text-zinc-800 dark:text-zinc-200 mb-1">30-Day Support Window</h5>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Garansi pemeliharaan teknis, penyesuaian bug kritis, dan asistensi pasca peluncuran.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 5. Core Capabilities (Business Solutions Offered) -->
    <section class="mb-24 md:mb-32" id="capabilities">
        <div class="max-w-2xl mb-12">
            <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                Business Solutions
            </h3>
            <h2 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                Core Mobile Capabilities
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Dirancang untuk menghasilkan performa tinggi, waktu muat instan, dan retensi pengguna yang maksimal.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Cap 1 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Layers size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Cross-Platform Velocity</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Satu basis kode untuk rilis simultan di iOS dan Android menggunakan Flutter atau React Native. Menghemat hingga 40% biaya pengembangan tanpa mengorbankan kualitas UI native.
                </p>
            </div>

            <!-- Cap 2 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Smartphone size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Fluid Native UX & Offline</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Animasi responsif 60fps/120fps, caching offline-first (SQLite/Hive), dan interaksi sentuh ergonomis yang mematuhi standar desain Apple HIG & Material 3.
                </p>
            </div>

            <!-- Cap 3 -->
            <div class="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02] transition-all duration-300 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-105 transition-transform">
                    <Database size={18} />
                </div>
                <h4 class="font-medium text-zinc-800 dark:text-zinc-200 mb-3 text-lg">Robust Integrations</h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Integrasi payment gateway lokal/global, GPS geolokasi, sinkronisasi realtime, sensor perangkat/Bluetooth IoT, serta autentikasi multi-faktor yang aman.
                </p>
            </div>
        </div>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 6. Development Pipeline (Execution Roadmap) -->
    <section class="mb-24 md:mb-32" id="process">
        <div class="max-w-2xl mb-12">
            <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                Execution Roadmap
            </h3>
            <h2 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                Our Development Pipeline
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Tahapan kerja terstruktur dan transparan dari konsep awal hingga aplikasi tayang di store.
            </p>
        </div>

        <div class="relative pl-6 border-l border-zinc-100 dark:border-zinc-800 space-y-12">
            <!-- Step 1 -->
            <div class="relative">
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
                            Memetakan alur pengguna (user journey), menentukan batasan MVP, dan menyusun spesifikasi teknis (arsitektur database, integrasi API, dan mode offline).
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 2 -->
            <div class="relative">
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
                            Merancang antarmuka visual presisi dengan pedoman Apple Human Interface Guidelines (HIG) dan Android Material Design 3 untuk kenyamanan penggunaan satu tangan.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="relative">
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
                            Pengembangan kode modular, pengujian lintas perangkat (beragam resolusi layar dan versi OS), error monitoring (Sentry), serta optimasi konsumsi memori dan baterai.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 4 -->
            <div class="relative">
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
                            Pendampingan submit ke Apple App Store dan Google Play Store hingga lolos review, transfer repositori Git, dan pelatihan pengoperasian platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Spacer Line -->
    <hr class="border-zinc-100 dark:border-zinc-800/60 my-16 md:my-24" />

    <!-- 7. The Tech Stack (Technical Credibility) -->
    <section class="mb-24 md:mb-32" id="tech-stack">
        <h3 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-12">
            The Tech Stack
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {#each techStack as tech}
                <div class="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200 shadow-xs">
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

    <!-- 8. Call to Action (Conversion Section) -->
    <section class="border-t border-zinc-100 dark:border-zinc-800/80 pt-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Ready to build your mobile application?
            </h2>
            <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
                Diskusikan kebutuhan ide aplikasi, estimasi timeline, dan rekomendasi arsitektur terbaik untuk bisnis Anda.
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
