<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import {
    Bell,
    CheckCheck,
    X,
    User,
    Building2,
    Globe,
    Smartphone,
    Clock,
    ChevronRight,
    Inbox,
    Sparkles,
    CheckCircle2,
    Calendar
  } from 'lucide-svelte';
  import { notificationStore, type AdminNotification } from '$lib/entities/notifications/notifications.svelte';

  let activeFilter = $state<'all' | 'unread'>('all');

  function handleClose() {
    notificationStore.close();
  }

  function handleSelectNotification(item: AdminNotification) {
    notificationStore.markAsRead(item.id);
    notificationStore.close();
    goto(item.url);
  }

  function handleMarkAllAsRead(e: MouseEvent) {
    e.stopPropagation();
    notificationStore.markAllAsRead();
  }

  const displayedNotifications = $derived.by(() => {
    if (activeFilter === 'unread') {
      return notificationStore.unreadNotifications;
    }
    return notificationStore.notifications;
  });

  function formatTimeAgo(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Baru saja';
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return 'Baru saja';
      if (diffMin < 60) return `${diffMin}m yang lalu`;
      if (diffHour < 24) return `${diffHour} jam yang lalu`;
      if (diffDay === 1) return 'Kemarin';
      if (diffDay < 7) return `${diffDay} hari yang lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Baru saja';
    }
  }

  // Handle backdrop click
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Handle keyboard ESC
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  // Lock body scroll & interactions behind popup when open
  $effect(() => {
    if (notificationStore.isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow || '';
      };
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if notificationStore.isOpen}
  <!-- Backdrop Overlay -->
  <div
    class="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-xs flex items-start justify-center md:justify-end p-4 sm:p-6 md:pt-20 md:pr-10 overscroll-contain"
    onclick={handleBackdropClick}
    onwheel={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    ontouchmove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    role="dialog"
    aria-modal="true"
    aria-label="Notifications"
    transition:fade={{ duration: 150 }}
  >
    <!-- Pop-up Floating Window (Positioned top-right near dashboard topbar action buttons) -->
    <div
      class="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[560px] overscroll-contain"
      onclick={(e) => e.stopPropagation()}
      transition:fly={{ y: -10, duration: 200 }}
    >
      <!-- Header -->
      <div class="px-5 py-4 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Bell size={16} />
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              Notifications
              {#if notificationStore.unreadCount > 0}
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                  {notificationStore.unreadCount} baru
                </span>
              {/if}
            </h3>
            
          </div>
        </div>

        <div class="flex items-center gap-1">
          {#if notificationStore.unreadCount > 0}
            <button
              type="button"
              onclick={handleMarkAllAsRead}
              title="Tandai semua dibaca"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <CheckCheck size={13} />
              <span class="hidden sm:inline">Tandai Dibaca</span>
            </button>
          {/if}

          <button
            type="button"
            onclick={handleClose}
            class="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            onclick={() => (activeFilter = 'all')}
            class="px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer {activeFilter === 'all' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
          >
            Semua ({notificationStore.notifications.length})
          </button>
          <button
            type="button"
            onclick={() => (activeFilter = 'unread')}
            class="px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'unread' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
          >
            Belum Dibaca
            {#if notificationStore.unreadCount > 0}
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {/if}
          </button>
        </div>

        {#if notificationStore.isLoading}
          <div class="text-[10px] text-zinc-400 flex items-center gap-1">
            <span class="inline-block w-2 h-2 rounded-full border border-zinc-400 border-t-transparent animate-spin"></span>
            Syncing...
          </div>
        {/if}
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 text-left overscroll-contain">
        {#if displayedNotifications.length === 0}
          <div class="p-10 text-center space-y-3">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Inbox size={22} />
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {activeFilter === 'unread' ? 'Semua notifikasi sudah dibaca' : 'Belum ada notifikasi lead'}
              </p>
              <p class="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto">
                Lead klien baru yang mengisi formulir konsultasi akan otomatis muncul di sini.
              </p>
            </div>
          </div>
        {:else}
          {#each displayedNotifications as item (item.id)}
            {@const isUnread = !notificationStore.isRead(item.id)}
            <button
              type="button"
              onclick={() => handleSelectNotification(item)}
              class="w-full p-4 flex items-start gap-3.5 transition-colors text-left cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 relative group {isUnread ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''}"
            >
              <!-- Unread Indicator Dot -->
              {#if isUnread}
                <div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
              {/if}

              <!-- Lead Icon -->
              <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-xs {item.serviceType === 'web_service' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40'}">
                {#if item.serviceType === 'web_service'}
                  <Globe size={16} />
                {:else}
                  <Smartphone size={16} />
                {/if}
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0 pr-4 space-y-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Lead Klien Baru
                  </span>
                  {#if item.alreadyConsulted}
                    <span class="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Sudah Konsultasi
                    </span>
                  {/if}
                </div>

                <p class="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {item.contactName}
                  {#if item.companyName}
                    <span class="text-zinc-400 dark:text-zinc-500 font-normal">({item.companyName})</span>
                  {/if}
                </p>

                {#if item.projectTitle}
                  <p class="text-[11px] text-zinc-600 dark:text-zinc-300 truncate">
                    {item.projectTitle}
                  </p>
                {/if}

                <div class="flex items-center gap-2 pt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                  <span class="flex items-center gap-1">
                    <Clock size={10} />
                    {formatTimeAgo(item.createdAt)}
                  </span>
                  <span>•</span>
                  <span class="capitalize">
                    {item.serviceType === 'web_service' ? 'Website' : 'Mobile App'} ({item.projectTier})
                  </span>
                </div>
              </div>

              <!-- Arrow icon -->
              <div class="self-center text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors">
                <ChevronRight size={15} />
              </div>
            </button>
          {/each}
        {/if}
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between text-xs">
        
        
      </div>
    </div>
  </div>
{/if}
