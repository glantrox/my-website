<script>
    import { ArrowUpRight, Cpu, Database, Activity, Wifi, Calendar, Users, Github, FileText, CheckCircle2, Trophy, Camera } from 'lucide-svelte';
    import petsaHome from '$lib/assets/petsahome.png';
    import ptnBumn from '$lib/assets/ptn_bumn.jpg';
    import teamPhoto from '$lib/assets/tkaja_team.jpeg';
    const techStack = ['React', 'Tailwind', 'Python', 'FastAPI', 'PostgreSQL', 'TensorFlow', 'C++ (ESP32)'];
    
    // Generate random noise dots for the chart once to prevent re-rendering layout shifts
    const noiseDots = Array.from({ length: 20 }, () => ({
        cx: Math.random() * 400,
        cy: Math.random() * 100 + 25
    }));
</script>

<div class="w-full max-w-6xl mx-auto px-6 py-12 md:py-24 font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
    
    <!-- Header Section -->
    <header class="mb-16 max-w-3xl">
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            TernakAja
        </h1>
        <p class="text-xl md:text-2xl text-gray-500 font-light leading-relaxed">
            AgTech Data Modeling & IoT for the Beef Supply Chain.
        </p>
        
      
    </header>

    <!-- Core Product Bento Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- CARD A: The Core Problem -->
        <div class="lg:col-span-1 bg-[#f8f9fa] rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-between group hover:border-gray-200 transition-colors">
            <div class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-8 text-rose-500 group-hover:scale-110 transition-transform duration-300">
                <Activity class="w-6 h-6" />
            </div>
            <div>
                <h3 class="text-2xl font-semibold text-gray-900 leading-tight mb-2">The Problem</h3>
                <p class="text-gray-500 leading-relaxed font-medium text-lg">
                    Tracking cattle health manually costs farmers time and money.
                </p>
            </div>
        </div>

        <!-- CARD B: The PETSA Solution -->
        <div class="lg:col-span-2 bg-[#f8f9fa] rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden group">
            <div class="relative z-10 w-full h-full flex flex-col justify-between">
                <div>
                    <h3 class="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Hardware Prototype</h3>
                    <h2 class="text-2xl font-semibold text-gray-900">The PETSA Smart Tag</h2>
                </div>
                
                <div class="absolute -bottom-10 -right-10 w-3/4 h-[120%] bg-gradient-to-br from-yellow-50 to-orange-50 rounded-tl-full opacity-50 transition-transform duration-700 group-hover:scale-105"></div>
                
                <div class="mt-8 flex-1 flex items-center justify-end w-full relative z-10 pr-4">                    
                    <img src={petsaHome} alt="PETSA Smart Tag Prototype" class="w-1/2 max-w-sm object-contain shrink-0" />
                    
                </div>
            </div>
        </div>

        <!-- CARD C: Tech Stack & Role -->
        <div class="lg:col-span-1 bg-[#f8f9fa] rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-between group">
            <div class="flex gap-4 mb-12">
                <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <svg viewBox="0 0 110 110" class="w-5 h-5" fill="currentColor">
                        <path d="M54.5,13.2c-19.8,0-18.9,8.6-18.9,8.6l0,8.9h19.2v2.7H25.3c0,0-20.1-2.3-20.1,20.4c0,22.7,17.4,21.7,17.4,21.7 h8v-9.5c0-11,9.1-20.1,20.2-20.1h19.5c0,0,8.8,0.2,8.8-8.8V19.1C79.1,19.1,81.1,13.2,54.5,13.2z M43.4,24.3 c-2.4,0-4.3-1.9-4.3-4.3s1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3S45.8,24.3,43.4,24.3z" />
                        <path d="M55.8,96.8c19.8,0,18.9-8.6,18.9-8.6l0-8.9H55.5v-2.7h29.5c0,0,20.1,2.3,20.1-20.4c0-22.7-17.4-21.7-17.4-21.7 h-8v9.5c0,11-9.1,20.1-20.2,20.1H40c0,0-8.8-0.2-8.8,8.8v18.1C31.2,90.9,29.2,96.8,55.8,96.8z M66.9,85.7 c2.4,0,4.3,1.9,4.3,4.3c0,2.4-1.9,4.3-4.3,4.3c-2.4,0-4.3-1.9-4.3-4.3C62.6,87.6,64.5,85.7,66.9,85.7z" />
                    </svg>
                </div>
                <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <Cpu class="w-5 h-5" />
                </div>
                <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-purple-600 shadow-sm">
                    <Database class="w-5 h-5" />
                </div>
            </div>
            
            <div class="mt-auto">
                <h3 class="text-lg font-semibold text-gray-900">Role</h3>
                <p class="text-gray-500 font-medium mt-1">Lead Developer</p>
                <p class="text-gray-500 font-medium text-sm">&amp; Data Modeler</p>
            </div>
        </div>

        <!-- CARD D: Data & Impact -->
        <div class="lg:col-span-2 bg-gray-950 text-white rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer border border-gray-800 hover:border-gray-700 transition-colors">
            <div class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white/20 group-hover:scale-110 transition-all z-20">
                <ArrowUpRight class="w-5 h-5" />
            </div>

            <div class="relative z-10 mb-6">
                <h3 class="text-2xl font-semibold text-white">Predictive Modeling</h3>
                <p class="text-gray-400 mt-1 max-w-sm">Regression analysis on sensor metrics vs. yield output.</p>
            </div>

            <div class="relative w-full h-48 mt-4 rounded-xl overflow-hidden bg-gray-900 border border-white/5">
                <div class="absolute inset-0 flex flex-col justify-between py-4 px-2 opacity-10">
                    {#each [1, 2, 3, 4] as i}
                        <div class="w-full h-px bg-white"></div>
                    {/each}
                </div>
                
                <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="rgb(16 185 129)" stop-opacity="0.3" />
                            <stop offset="100%" stop-color="rgb(16 185 129)" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {#each noiseDots as dot}
                        <circle cx={dot.cx} cy={dot.cy} r="1.5" fill="rgba(255,255,255,0.2)" />
                    {/each}
                    
                    <path 
                        d="M 0,120 Q 100,100 200,80 T 400,30" 
                        fill="none" 
                        stroke="rgb(52 211 153)" 
                        stroke-width="3" 
                        stroke-linecap="round"
                        class="group-hover:stroke-white transition-colors duration-500"
                    />
                    
                    <path 
                        d="M 0,120 Q 100,100 200,80 T 400,30 L 400,150 L 0,150 Z" 
                        fill="url(#chartGradient)" 
                    />

                    <circle cx="200" cy="80" r="4" fill="white" class="shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <circle cx="400" cy="30" r="4" fill="white" />
                </svg>

                <div class="absolute bottom-3 right-4 bg-gray-950/80 backdrop-blur text-xs px-2 py-1 rounded text-emerald-400 font-mono border border-emerald-500/20">
                    r² = 0.892
                </div>
            </div>
        </div>

    </div>

    <!-- Background Story, Achievement & Gallery Bento -->
    <div class="mt-24 pt-16 border-t border-gray-100">
        <div class="flex items-center gap-4 mb-8">
            <h3 class="text-2xl font-semibold text-gray-900">Di Balik Layar</h3>
           
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Introduction Text Card -->
            <div class="lg:col-span-2 bg-[#f8f9fa] rounded-[2rem] p-8 md:p-10 border border-gray-100 flex flex-col justify-center">
                <h4 class="text-xl font-semibold text-gray-900 mb-4">Awal Mula Keterlibatan</h4>
                <p class="text-gray-600 leading-relaxed text-lg">
                    Jadi aku terlibat di project ini karena diajak lomba oleh asisten lab di kampus. Dari sana peranku terus berkembang, hingga akhirnya aku memegang tanggung jawab dalam development device IoT, baik dari segi rancangan sistem komputasinya maupun <em>product engineering</em> menggunakan software CAD.
                </p>
            </div>

            <!-- Gallery 1: Farm Visit -->
            <div class="lg:col-span-1 bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden relative group min-h-[250px] flex items-center justify-center">
                <div class="absolute inset-0 bg-gray-200 opacity-60 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"></div>
                <img src={teamPhoto} alt="TernakAja Team at the Farm" class="w-full h-full object-cover object-center rounded-[2rem] relative z-10" />
            </div>

            <!-- Gallery 2 & Achievement: Awarding Day -->
            <div class="lg:col-span-3 bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden relative group min-h-[320px] flex items-end">
                <div class="absolute inset-0 flex items-center justify-center bg-gray-800 transition-transform duration-700 group-hover:scale-105">
                    <span class="text-gray-500 font-medium text-lg px-6 text-center">
                        <!-- Image placeholder -->
                    </span>
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" style="background-image: url({ptnBumn}); background-size: cover; background-position: center;"></div>
                
                <div class="relative z-10 p-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                 
                        <h4 class="text-3xl md:text-4xl font-bold text-white mb-2">Winner Pikiran Terbaik Negeri</h4>
                        <p class="text-gray-300 font-medium text-lg">AI Ideation Category 2025</p>
                    </div>
                    
                    <div class="text-gray-400 text-sm flex items-center gap-2 shrink-0 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                        <Camera class="w-4 h-4" />
                        Awarding Day
                    </div>
                </div>
            </div>

        </div>
    </div>
    
    <div class="d-flex flex-row w-full items-center justify-center ">
        <a href="https://ternakaja.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 no-underline">
            Official Website
        </a>
    </div>

    <!-- Useful Information Section -->
    <div class="mt-24 pt-16 border-t border-gray-100">
        <h3 class="text-2xl font-semibold text-gray-900 mb-8">Project Details & Resources</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <!-- Timeline Column -->
            <div>
                <div class="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <Calendar class="w-5 h-5 text-gray-400" />
                    Timeline
                </div>
                <ul class="space-y-3 text-sm text-gray-500">
                    <li class="flex items-start gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Phase 1: Prototyping</li>
                    <li class="flex items-start gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Phase 2: Data Collection</li>
                    <li class="flex items-start gap-2"><div class="w-4 h-4 rounded-full border-2 border-emerald-500 mt-0.5 shrink-0"></div> Phase 3: Feasibility Study (Ongoing)</li>
                </ul>
            </div>

            <!-- Team Column -->
            <div>
                <div class="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <Users class="w-5 h-5 text-gray-400" />
                    Team Structure
                </div>
                <ul class="space-y-3 text-sm text-gray-500">
                    <li><strong class="text-gray-700">Lead Dev:</strong> UI & Backend</li>
                    <li><strong class="text-gray-700">Data Scientist:</strong> Regression Models</li>
                    <li><strong class="text-gray-700">Hardware Eng:</strong> ESP32 & Sensors</li>
                    <li><strong class="text-gray-700">Domain Expert:</strong> Vet & Agronomist</li>
                </ul>
            </div>

            <!-- Stack Column -->
            <div>
                <div class="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <Cpu class="w-5 h-5 text-gray-400" />
                    Full Stack
                </div>
                <div class="flex flex-wrap gap-2">
                    {#each techStack as tech}
                        <span class="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 font-medium">
                            {tech}
                        </span>
                    {/each}
                </div>
            </div>

            

            <!-- Resources Column -->
            <div>
                <div class="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <FileText class="w-5 h-5 text-gray-400" />
                    Resources
                </div>
                <div class="space-y-3">
                    <a href="#" class="flex items-start gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                        <Github class="w-4 h-4 mt-0.5 shrink-0 group-hover:text-black transition-colors" />
                        <span>Core API Repository</span>
                        <ArrowUpRight class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                    </a>
                    <a href="#" class="flex items-start gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                        <FileText class="w-4 h-4 mt-0.5 shrink-0 group-hover:text-blue-500 transition-colors" />
                        <span>Whitepaper v1.2 (PDF)</span>
                        <ArrowUpRight class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                    </a>
                </div>
            </div>

        </div>
    </div>

</div>