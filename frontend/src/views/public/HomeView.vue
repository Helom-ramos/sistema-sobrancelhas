<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden"
       style="background:linear-gradient(180deg,#120b10 0%,#0c070a 50%,#120b10 100%)">

    <!-- ============ DECORAÇÕES DE FUNDO ============ -->

    <!-- Glows radiais rosa dominantes -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
         style="width:520px;height:380px;background:radial-gradient(ellipse,rgba(232,85,122,0.25) 0%,transparent 65%);z-index:0"/>
    <div class="fixed top-1/3 right-0 pointer-events-none"
         style="width:320px;height:320px;background:radial-gradient(circle,rgba(232,85,122,0.18) 0%,transparent 70%);z-index:0"/>
    <div class="fixed bottom-0 left-0 pointer-events-none"
         style="width:380px;height:380px;background:radial-gradient(circle,rgba(232,85,122,0.15) 0%,transparent 70%);z-index:0"/>
    <div class="fixed bottom-1/3 right-1/3 pointer-events-none"
         style="width:240px;height:240px;background:radial-gradient(circle,rgba(212,175,116,0.06) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical topo-direita (grande) -->
    <svg class="absolute pointer-events-none select-none float-slow"
         style="top:60px;right:-10px;width:150px;height:300px;opacity:0.35;z-index:1"
         viewBox="0 0 150 300" fill="none">
      <path d="M130 5 C118 60 95 110 75 160 C60 200 45 245 30 295" stroke="#e8557a" stroke-width="1.5" fill="none"/>
      <path d="M122 35 C144 14 154 38 130 54 C115 46 122 35 122 35Z" fill="#e8557a"/>
      <path d="M108 72 C130 50 144 72 120 88 C104 78 108 72 108 72Z" fill="#e8557a" opacity="0.7"/>
      <path d="M94 110 C82 82 60 90 68 113 C75 130 94 122 94 110Z" fill="#e8557a"/>
      <path d="M82 148 C104 126 118 150 94 164 C78 156 82 148 82 148Z" fill="#d4af74" opacity="0.6"/>
      <path d="M70 186 C52 162 30 174 40 196 C50 214 70 200 70 186Z" fill="#e8557a"/>
      <path d="M58 224 C76 202 88 226 66 240 C52 232 58 224 58 224Z" fill="#e8557a" opacity="0.7"/>
      <path d="M46 262 C28 240 12 254 22 274 C32 290 46 274 46 262Z" fill="#e8557a"/>
    </svg>

    <!-- Botanical baixo-esquerda (grande) -->
    <svg class="absolute pointer-events-none select-none float-medium"
         style="bottom:60px;left:-10px;width:140px;height:280px;opacity:0.32;z-index:1"
         viewBox="0 0 140 280" fill="none">
      <path d="M25 280 C35 230 60 188 72 145 C82 105 88 65 95 5" stroke="#e8557a" stroke-width="1.5" fill="none"/>
      <path d="M35 252 C12 268 6 244 25 234 C40 240 35 252 35 252Z" fill="#e8557a"/>
      <path d="M48 215 C26 230 18 208 38 200 C52 204 48 215 48 215Z" fill="#e8557a" opacity="0.7"/>
      <path d="M60 178 C40 162 44 142 62 152 C72 162 60 178 60 178Z" fill="#d4af74" opacity="0.6"/>
      <path d="M72 142 C52 126 56 104 74 116 C84 126 72 142 72 142Z" fill="#e8557a"/>
      <path d="M82 105 C64 88 70 68 86 80 C95 90 82 105 82 105Z" fill="#e8557a" opacity="0.8"/>
      <path d="M90 68 C75 50 82 32 96 44 C104 53 90 68 90 68Z" fill="#e8557a"/>
    </svg>

    <!-- Botanical meio-esquerda (pequena) -->
    <svg class="absolute pointer-events-none select-none float-slow"
         style="top:45%;left:-5px;width:70px;height:140px;opacity:0.25;z-index:1"
         viewBox="0 0 70 140" fill="none">
      <path d="M10 140 C18 105 30 75 38 45 C44 25 48 12 52 2" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M18 120 C5 130 0 116 12 110 C20 114 18 120 18 120Z" fill="#e8557a"/>
      <path d="M28 88 C14 96 8 80 22 76 C30 80 28 88 28 88Z" fill="#e8557a" opacity="0.7"/>
      <path d="M38 56 C24 46 28 30 40 40 C46 48 38 56 38 56Z" fill="#e8557a"/>
    </svg>

    <!-- Botanical meio-direita (pequena) -->
    <svg class="absolute pointer-events-none select-none float-medium"
         style="top:55%;right:-5px;width:65px;height:130px;opacity:0.25;z-index:1"
         viewBox="0 0 65 130" fill="none">
      <path d="M55 130 C48 100 36 70 28 42 C22 22 18 10 14 2" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M48 110 C58 118 64 104 52 100 C44 104 48 110 48 110Z" fill="#e8557a"/>
      <path d="M38 80 C50 86 56 72 42 68 C36 72 38 80 38 80Z" fill="#e8557a" opacity="0.7"/>
      <path d="M28 50 C40 42 36 28 26 36 C20 42 28 50 28 50Z" fill="#e8557a"/>
    </svg>

    <!-- Sparkles -->
    <div class="absolute twinkle-1 pointer-events-none" style="top:120px;left:30px;z-index:2">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="#e8557a" style="opacity:0.7"><path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6Z"/></svg>
    </div>
    <div class="absolute twinkle-2 pointer-events-none" style="top:200px;right:60px;z-index:2">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="#d4af74" style="opacity:0.6"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
    </div>
    <div class="absolute twinkle-3 pointer-events-none" style="top:50%;left:50px;z-index:2">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="#e8557a" style="opacity:0.7"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/></svg>
    </div>
    <div class="absolute twinkle-1 pointer-events-none" style="top:30%;right:30px;z-index:2">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#e8557a" style="opacity:0.5"><path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z"/></svg>
    </div>
    <div class="absolute twinkle-2 pointer-events-none" style="bottom:30%;left:30%;z-index:2">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="#e8557a" style="opacity:0.5"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
    </div>

    <!-- ============ HEADER ============ -->
    <header class="relative z-10 px-5 py-3 flex items-center justify-between"
            style="border-bottom:1px solid rgba(232,85,122,0.15);background:rgba(12,7,10,0.6);backdrop-filter:blur(8px)">
      <p class="text-xs font-semibold tracking-widest uppercase" style="color:#e8557a;letter-spacing:0.2em">
        Déborah Cristhiany
      </p>
      <button @click="$router.push('/login')"
              class="text-xs transition-colors px-3 py-1 rounded-full"
              style="color:#b89eb0;border:1px solid rgba(232,85,122,0.2);letter-spacing:0.05em">
        Admin
      </button>
    </header>

    <!-- ============ HERO ============ -->
    <div class="relative z-10 flex flex-col items-center pt-10 pb-6 px-5">

      <!-- Frame com ornamentos rosa -->
      <div class="relative" style="max-width:320px;width:100%">
        <svg class="absolute -top-2 -left-2" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M2 14 L2 2 L14 2" stroke="#e8557a" stroke-width="1.2" fill="none" opacity="0.8"/>
          <circle cx="2" cy="2" r="2" fill="#e8557a" opacity="0.8"/>
        </svg>
        <svg class="absolute -top-2 -right-2" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M30 14 L30 2 L18 2" stroke="#e8557a" stroke-width="1.2" fill="none" opacity="0.8"/>
          <circle cx="30" cy="2" r="2" fill="#e8557a" opacity="0.8"/>
        </svg>
        <svg class="absolute -bottom-2 -left-2" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M2 18 L2 30 L14 30" stroke="#e8557a" stroke-width="1.2" fill="none" opacity="0.8"/>
          <circle cx="2" cy="30" r="2" fill="#e8557a" opacity="0.8"/>
        </svg>
        <svg class="absolute -bottom-2 -right-2" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M30 18 L30 30 L18 30" stroke="#e8557a" stroke-width="1.2" fill="none" opacity="0.8"/>
          <circle cx="30" cy="30" r="2" fill="#e8557a" opacity="0.8"/>
        </svg>

        <div class="py-8 px-6 flex justify-center"
             style="background:radial-gradient(ellipse at center,rgba(232,85,122,0.12) 0%,transparent 70%)">
          <img src="/banner.png" alt="Déborah Cristhiany"
               style="display:block;width:100%;max-width:240px;height:auto;filter:invert(1);opacity:0.95"/>
        </div>
      </div>

      <!-- Divider ornamental rosa -->
      <div class="flex items-center gap-3 w-full max-w-xs mt-6">
        <div class="flex-1 h-px" style="background:linear-gradient(to right,transparent,rgba(232,85,122,0.6))"/>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#e8557a" stroke-width="0.8" fill="none" opacity="0.7"/>
          <path d="M11 4L12 9L17 11L12 13L11 18L10 13L5 11L10 9Z" fill="#e8557a" opacity="0.9"/>
        </svg>
        <div class="flex-1 h-px" style="background:linear-gradient(to left,transparent,rgba(232,85,122,0.6))"/>
      </div>

      <p class="text-xs tracking-widest uppercase text-center mt-3" style="color:#e8557a;letter-spacing:0.25em;opacity:0.9">
        Designer de Sobrancelhas
      </p>
    </div>

    <!-- ============ CONTEÚDO ============ -->
    <main class="relative z-10 flex-1 flex flex-col items-center px-5 pt-4 pb-12">

      <p class="text-center text-sm mb-8 max-w-xs" style="color:#d4c4d4;line-height:1.8">
        Realce sua beleza natural com técnicas exclusivas.<br/>
        <span style="color:#e8557a;font-weight:500">Agende seu horário em poucos cliques.</span>
      </p>

      <!-- Botão principal -->
      <div class="relative w-full max-w-xs mb-10">
        <div class="absolute -top-2 -right-2 twinkle-2 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#e8557a"><path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6Z"/></svg>
        </div>
        <div class="absolute -bottom-2 -left-2 twinkle-3 pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="#e8557a"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
        </div>

        <button @click="$router.push('/agendar')"
          class="w-full font-semibold py-4 rounded-2xl text-sm tracking-wide transition-all active:scale-95 relative overflow-hidden"
          style="background:linear-gradient(135deg,#e8557a 0%,#c93d65 60%,#a82e52 100%);color:#fff;letter-spacing:0.08em;box-shadow:0 8px 32px rgba(232,85,122,0.5),0 2px 8px rgba(0,0,0,0.6)">
          <span class="relative z-10 flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"/></svg>
            Agendar Agora
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"/></svg>
          </span>
          <div class="absolute inset-0 opacity-30" style="background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.6) 50%,transparent 60%);animation:shimmer 3s infinite"/>
        </button>
      </div>

      <!-- ============ DIFERENCIAIS ============ -->
      <div class="w-full max-w-xs mb-10">
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-2xl p-3 text-center"
               style="background:linear-gradient(135deg,rgba(232,85,122,0.1) 0%,rgba(232,85,122,0.04) 100%);border:1px solid rgba(232,85,122,0.2)">
            <div class="text-xl mb-1">✨</div>
            <p class="text-xs font-semibold" style="color:#f5ecf0">Exclusivo</p>
            <p class="text-xs" style="color:#a094a8">Personalizado</p>
          </div>
          <div class="rounded-2xl p-3 text-center"
               style="background:linear-gradient(135deg,rgba(232,85,122,0.1) 0%,rgba(232,85,122,0.04) 100%);border:1px solid rgba(232,85,122,0.2)">
            <div class="text-xl mb-1">💎</div>
            <p class="text-xs font-semibold" style="color:#f5ecf0">Premium</p>
            <p class="text-xs" style="color:#a094a8">Qualidade</p>
          </div>
          <div class="rounded-2xl p-3 text-center"
               style="background:linear-gradient(135deg,rgba(232,85,122,0.1) 0%,rgba(232,85,122,0.04) 100%);border:1px solid rgba(232,85,122,0.2)">
            <div class="text-xl mb-1">🌸</div>
            <p class="text-xs font-semibold" style="color:#f5ecf0">Acolhedor</p>
            <p class="text-xs" style="color:#a094a8">Ambiente</p>
          </div>
        </div>
      </div>

      <!-- ============ SERVIÇOS ============ -->
      <div class="flex items-center gap-3 w-full max-w-xs mb-5">
        <div class="h-px flex-1" style="background:linear-gradient(to right,transparent,rgba(232,85,122,0.5))"/>
        <div class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#e8557a"><path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6Z"/></svg>
          <p class="text-xs tracking-widest uppercase font-semibold" style="color:#e8557a;letter-spacing:0.22em">Serviços</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#e8557a"><path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6Z"/></svg>
        </div>
        <div class="h-px flex-1" style="background:linear-gradient(to left,transparent,rgba(232,85,122,0.5))"/>
      </div>

      <div v-if="loading" class="text-sm py-6" style="color:#9a8aa4">Carregando...</div>

      <div v-else class="w-full max-w-xs space-y-3">
        <div v-for="s in services" :key="s._id"
          class="rounded-2xl overflow-hidden flex items-center transition-all relative"
          style="background:linear-gradient(135deg,#1a0f14 0%,#1f1018 100%);border:1px solid rgba(232,85,122,0.2);box-shadow:0 4px 20px rgba(0,0,0,0.4),0 0 0 1px rgba(232,85,122,0.05) inset">
          <div class="w-20 h-20 shrink-0 overflow-hidden relative" style="background:#150a0e">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-2xl opacity-40">💆</span>
            </div>
            <div class="absolute inset-0 pointer-events-none"
                 style="background:linear-gradient(to right,transparent 50%,rgba(26,15,20,0.4))"/>
          </div>
          <div class="flex-1 px-4 py-3">
            <p class="font-semibold text-sm" style="color:#f5ecf0">{{ s.name }}</p>
            <p class="text-xs mt-1" style="color:#b09ab4">⏱ {{ s.duration }} min</p>
          </div>
          <div class="pr-4 shrink-0 text-right">
            <p class="text-xs uppercase tracking-wider" style="color:#9a8aa4;letter-spacing:0.1em">A partir de</p>
            <p class="text-base font-bold" style="color:#e8557a">R$ {{ s.price }}</p>
          </div>
        </div>
      </div>

      <!-- ============ INSTAGRAM CTA ============ -->
      <div v-if="settings?.instagram" class="w-full max-w-xs mt-8">
        <a :href="settings.instagram" target="_blank" rel="noopener"
           class="block rounded-2xl p-4 transition-all active:scale-95 relative overflow-hidden"
           style="background:linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);box-shadow:0 8px 32px rgba(220,39,67,0.4)">
          <div class="absolute inset-0" style="background:linear-gradient(135deg,transparent,rgba(255,255,255,0.15));pointer-events:none"/>
          <div class="relative flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background:rgba(255,255,255,0.2);backdrop-filter:blur(10px)">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs text-white opacity-85" style="letter-spacing:0.08em">VEJA O TRABALHO E DEPOIMENTOS</p>
              <p class="text-sm font-bold text-white">@deboraahcr</p>
            </div>
            <svg class="w-5 h-5 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </a>
      </div>

      <!-- ============ CONTATO ============ -->
      <div v-if="settings" class="w-full max-w-xs mt-6 rounded-2xl p-5"
           style="background:linear-gradient(135deg,#1a0f14 0%,#1f1018 100%);border:1px solid rgba(232,85,122,0.2);box-shadow:0 4px 20px rgba(0,0,0,0.4)">

        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px flex-1" style="background:rgba(232,85,122,0.25)"/>
          <p class="text-xs uppercase tracking-widest font-semibold" style="color:#e8557a;letter-spacing:0.2em">Visite-nos</p>
          <div class="h-px flex-1" style="background:rgba(232,85,122,0.25)"/>
        </div>

        <div class="space-y-3">
          <div v-if="settings.address" class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                 style="background:rgba(232,85,122,0.15);border:1px solid rgba(232,85,122,0.25)">
              <span style="color:#e8557a">📍</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs uppercase tracking-wider mb-0.5" style="color:#9a8aa4;letter-spacing:0.1em">Endereço</p>
              <p class="text-sm" style="color:#e0d4e0;line-height:1.5">{{ settings.address }}</p>
            </div>
          </div>

          <a v-if="settings.phone" :href="`https://wa.me/55${settings.phone.replace(/\D/g,'')}`" target="_blank" rel="noopener"
             class="flex items-start gap-3 transition-opacity">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                 style="background:rgba(74,222,128,0.15);border:1px solid rgba(74,222,128,0.3)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#4ade80">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs uppercase tracking-wider mb-0.5" style="color:#9a8aa4;letter-spacing:0.1em">WhatsApp</p>
              <p class="text-sm font-medium" style="color:#4ade80">(38) 99924-3577</p>
            </div>
          </a>

          <div class="flex items-start gap-3 pt-3" style="border-top:1px solid rgba(232,85,122,0.12)">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                 style="background:rgba(232,85,122,0.15);border:1px solid rgba(232,85,122,0.3)">
              <span style="color:#e8557a">⏰</span>
            </div>
            <div class="flex-1">
              <p class="text-xs uppercase tracking-wider mb-0.5" style="color:#9a8aa4;letter-spacing:0.1em">Atendimento</p>
              <p class="text-sm" style="color:#e0d4e0">Somente com hora marcada</p>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ============ FOOTER ============ -->
    <footer class="relative z-10 text-center py-5 px-5"
            style="border-top:1px solid rgba(232,85,122,0.15)">
      <div class="flex items-center justify-center gap-2 mb-2">
        <div class="h-px w-8" style="background:rgba(232,85,122,0.4)"/>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#e8557a" style="opacity:0.7"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/></svg>
        <div class="h-px w-8" style="background:rgba(232,85,122,0.4)"/>
      </div>
      <p class="text-xs" style="color:#8a7494;letter-spacing:0.15em">© Déborah Cristhiany · Designer de Sobrancelhas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const services = ref([])
const settings = ref(null)
const loading  = ref(true)

onMounted(async () => {
  try {
    const [svcRes, setRes] = await Promise.all([api.get('/services'), api.get('/settings')])
    services.value = svcRes.data
    settings.value = setRes.data
  } catch { /* silencioso */ }
  finally { loading.value = false }
})
</script>

<style scoped>
@keyframes shimmer {
  0%   { transform: translateX(-100%) }
  100% { transform: translateX(200%) }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) rotate(0deg) }
  50%      { transform: translateY(-12px) rotate(1deg) }
}
@keyframes floatMedium {
  0%, 100% { transform: translateY(0) rotate(0deg) }
  50%      { transform: translateY(-8px) rotate(-1deg) }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.9) }
  50%      { opacity: 1;   transform: scale(1.2) }
}
.float-slow   { animation: floatSlow 9s ease-in-out infinite }
.float-medium { animation: floatMedium 7s ease-in-out infinite }
.twinkle-1    { animation: twinkle 3s ease-in-out infinite }
.twinkle-2    { animation: twinkle 4s ease-in-out infinite 0.5s }
.twinkle-3    { animation: twinkle 5s ease-in-out infinite 1s }
</style>
