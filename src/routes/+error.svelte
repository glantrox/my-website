<script>
  import { page } from "$app/stores";
  import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";

  function handleRetry() {
    window.location.reload();
  }
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors duration-200">
  <div class="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
    <div class="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center animate-bounce">
      <ShieldAlert size={32} />
    </div>

    <div class="space-y-2">
      <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
        {$page.status === 404 ? "Halaman Tidak Ditemukan" : "Terjadi Kesalahan"}
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
        {#if $page.status === 404}
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        {:else}
          {$page.error?.message || "We're having trouble connecting to our servers. Please check your internet connection or try again in a few moments."}
        {/if}
      </p>
    </div>

    <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        variant="outline"
        onclick={() => history.back()}
        class="border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-2 rounded-xl text-xs py-4.5 px-5"
      >
        <ArrowLeft size={14} />
        Kembali
      </Button>
      <Button
        onclick={handleRetry}
        class="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-xl text-xs py-4.5 px-5"
      >
        <RefreshCw size={14} />
        Coba Lagi
      </Button>
    </div>
  </div>
</div>
