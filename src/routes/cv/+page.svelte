<script>
	/** @type {HTMLElement} */
	let cardRef;
	let rotation = { x: 0, y: 0 };
	let isHovering = false;
	let glarePosition = { x: 50, y: 50 };

	/**
	 * @param {number} clientX
	 * @param {number} clientY
	 */
	const handleMove = (clientX, clientY) => {
		if (!cardRef) return;
		const rect = cardRef.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		const x = clientX - rect.left;
		const y = clientY - rect.top;

		const rotateY = (x / width - 0.5) * 30; // -15deg to +15deg
		const rotateX = (y / height - 0.5) * -30; // +15deg to -15deg

		const glareX = (x / width) * 100;
		const glareY = (y / height) * 100;

		rotation = { x: rotateX, y: rotateY };
		glarePosition = { x: glareX, y: glareY };
	};

	/**
	 * @param {MouseEvent} e
	 */
	const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
	/**
	 * @param {TouchEvent} e
	 */
	const onTouchMove = (e) => {
		if (isHovering) e.preventDefault();
		handleMove(e.touches[0].clientX, e.touches[0].clientY);
	};

	const handleEnter = () => (isHovering = true);
	const handleLeave = () => {
		isHovering = false;
		rotation = { x: 0, y: 0 };
	};

	let skills = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"];
</script>

<div
	class="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 font-sans overflow-hidden text-neutral-900"
>
	<!-- Perspective Container -->
	<div
		class="relative w-full flex justify-center items-center"
		style="perspective: 1200px;"
	>
		<!-- 3D Transform Wrapper -->
		<div
			bind:this={cardRef}
			on:mousemove={onMouseMove}
			on:touchmove={onTouchMove}
			on:mouseenter={handleEnter}
			on:touchstart={handleEnter}
			on:mouseleave={handleLeave}
			on:touchend={handleLeave}
			class="relative w-full max-w-[420px] cursor-crosshair group"
			role="group"
			aria-label="Interactive CV Card"
			style="aspect-ratio: 1 / 1.414; transform: rotateX({rotation.x}deg) rotateY({rotation.y}deg); transform-style: preserve-3d; transition: {isHovering
				? 'none'
				: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'};"
		>
			<!-- Physical Card Background -->
			<div
				class="absolute inset-0 bg-gradient-to-br from-white via-neutral-100 to-neutral-200 rounded-lg shadow-2xl border border-white/60"
				style="box-shadow: {isHovering
					? `${-rotation.y * 1.5}px ${rotation.x * 1.5}px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.5)`
					: '0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.5)'}; transition: {isHovering
					? 'box-shadow 0.1s ease-out'
					: 'box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1)'}; transform-style: preserve-3d;"
			>
				<!-- Decorative Background Pattern -->
				<div
					class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] rounded-lg pointer-events-none"
				></div>

				<!-- Inner Content with Z-Translation for 3D Depth -->
				<div
					class="p-6 sm:p-8 h-full flex flex-col relative z-10 w-full text-left"
					style="transform: translateZ(60px); transform-style: preserve-3d;"
				>
					<!-- Header / Contact -->
					<div style="transform: translateZ(30px);">
						<h1
							class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight"
						>
							Lorem Ipsum
						</h1>

						<div
							class="flex flex-wrap gap-x-3 gap-y-1 text-[9px] sm:text-[10px] text-neutral-500 mt-3 border-b border-neutral-200/80 pb-3"
						>
							<span class="flex items-center gap-1">
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									></path></svg
								>
								lorem.ipsum@example.com
							</span>
							<span class="flex items-center gap-1">
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									></path></svg
								>
								+12 345 678 90123
							</span>
							<span class="flex items-center gap-1">
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path></svg
								>
								Adipiscing, ELIT
							</span>
						</div>
					</div>

					<!-- Objective Section -->
					<div class="mt-3" style="transform: translateZ(40px);">
						<h3
							class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5"
						>
							Lorem Ipsum
						</h3>
						<p
							class="text-[9px] sm:text-[10px] text-neutral-600 leading-relaxed text-justify"
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat.
						</p>
					</div>

					<!-- Education Section -->
					<div
						class="mt-3 flex-1"
						style="transform: translateZ(50px);"
					>
						<h3
							class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5"
						>
							Education
						</h3>
						<div class="space-y-2.5">
							<div
								class="relative pl-3 border-l-2 border-blue-200"
							>
								<div
									class="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
								></div>
								<div
									class="flex justify-between items-baseline"
								>
									<h4
										class="text-xs font-bold text-neutral-800"
									>
										University X
									</h4>
									<span
										class="text-[9px] text-neutral-500 font-medium"
										>XXXX - XXXX</span
									>
								</div>
								<p
									class="text-[10px] text-blue-600 font-medium"
								>
									B.S. in Computer Science
								</p>
							</div>

							<div
								class="relative pl-3 border-l-2 border-neutral-200"
							>
								<div
									class="absolute w-2 h-2 bg-neutral-300 rounded-full -left-[5px] top-1"
								></div>
								<div
									class="flex justify-between items-baseline"
								>
									<h4
										class="text-xs font-bold text-neutral-800"
									>
										College Y
									</h4>
									<span
										class="text-[9px] text-neutral-500 font-medium"
										>XXXX - XXXX</span
									>
								</div>
								<p
									class="text-[10px] text-neutral-500 font-medium"
								>
									Associate Degree
								</p>
							</div>

							<div
								class="relative pl-3 border-l-2 border-neutral-200"
							>
								<div
									class="absolute w-2 h-2 bg-neutral-300 rounded-full -left-[5px] top-1"
								></div>
								<div
									class="flex justify-between items-baseline"
								>
									<h4
										class="text-xs font-bold text-neutral-800"
									>
										High School Z
									</h4>
									<span
										class="text-[9px] text-neutral-500 font-medium"
										>XXXX - XXXX</span
									>
								</div>
								<p
									class="text-[10px] text-neutral-500 font-medium"
								>
									High School Diploma
								</p>
							</div>
						</div>
					</div>

					<!-- Footer / Skills -->
					<div
						class="mt-auto pt-3 border-t border-neutral-200/80 flex justify-between items-end"
						style="transform: translateZ(20px);"
					>
						<div>
							<h3
								class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5"
							>
								Core Skills
							</h3>
							<div class="flex flex-wrap gap-1 max-w-[200px]">
								{#each skills as skill}
									<span
										class="px-1.5 py-0.5 bg-white border border-neutral-200 text-neutral-700 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded shadow-sm"
									>
										{skill}
									</span>
								{/each}
							</div>
						</div>

						<!-- Simulated Barcode -->
						<div
							class="flex gap-[2px] opacity-30 mix-blend-multiply pb-1"
						>
							{#each Array(12) as _, i}
								<div
									class="h-5 sm:h-6 bg-neutral-800"
									class:w-1.5={i % 3 === 0}
									class:w-1={i % 2 === 0 && i % 3 !== 0}
									class:w-0.5={i % 2 !== 0 && i % 3 !== 0}
								></div>
							{/each}
						</div>
					</div>
				</div>

				<!-- --- BLUR AND GLARE OVERLAYS --- -->
				<div
					class="absolute inset-0 pointer-events-none rounded-lg z-30 transition-opacity duration-500 ease-out"
					class:opacity-0={isHovering}
					class:opacity-100={!isHovering}
					style="transform: translateZ(120px) scale(0.9); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);"
				></div>
				<div
					class="absolute inset-0 pointer-events-none rounded-lg z-40 transition-opacity duration-500 ease-out"
					class:opacity-100={isHovering}
					class:opacity-0={!isHovering}
					style="transform: translateZ(120px) scale(0.9); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); mask-image: radial-gradient(circle at {glarePosition.x}% {glarePosition.y}%, transparent 0%, transparent 15%, black 50%); -webkit-mask-image: radial-gradient(circle at {glarePosition.x}% {glarePosition.y}%, transparent 0%, transparent 15%, black 50%);"
				></div>
				<div
					class="absolute inset-0 pointer-events-none rounded-lg mix-blend-overlay z-50"
					style="transform: translateZ(121px) scale(0.899); background: radial-gradient(circle at {glarePosition.x}% {glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%); opacity: {isHovering
						? 0.7
						: 0}; transition: opacity 0.4s ease;"
				></div>
			</div>
		</div>
	</div>

	<p
		class="mt-12 text-neutral-500 text-sm tracking-wide opacity-50 font-medium"
	>
		this is just a gibberish placeholder for my cv :)
	</p>

	<div class="mt-8 text-center">
		<a
			href="/CV.pdf"
			download
			class="inline-block bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700/50 text-zinc-800 dark:text-zinc-200 font-medium text-sm py-3 px-6 rounded-lg transition-colors duration-200"
		>
			Download CV
		</a>
	</div>
</div>
