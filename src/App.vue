<template>
  <main class="app-shell" :style="backgroundStyle">
    <div class="overlay"></div>

    <section class="content">
      <header class="top">
        <div>
          <h1>Gestor de Clientes Contables</h1>
          <p>Control de ficha tributaria e historial mensual de IVA.</p>
        </div>

        <div class="theme-switcher" data-cy="theme-switcher">
          <span>Fondo:</span>
          <button
            v-for="theme in themes"
            :key="theme.id"
            type="button"
            :class="['theme-chip', { active: selectedTheme === theme.id }]"
            @click="setTheme(theme.id)"
          >
            {{ theme.label }}
          </button>
        </div>
      </header>

      <router-view />
    </section>
  </main>
</template>

<script>
import floresPurple from './assets/backgrounds/flores-purple.jpg';
import otono from './assets/backgrounds/otono.jpg';
import principito from './assets/backgrounds/principito.webp';

const THEME_STORAGE_KEY = 'ui_theme_background';

export default {
  name: 'App',
  data() {
    return {
      selectedTheme: localStorage.getItem(THEME_STORAGE_KEY) || 'lavender',
      themes: [
        {
          id: 'lavender',
          label: 'Paisaje Otoño',
          image: otono,
          palette: {
            ink: '#2f1f1a',
            panel: 'rgba(255, 245, 236, 0.86)',
            panelBorder: 'rgba(255, 237, 214, 0.95)',
            chipBg: '#fff7f0',
            chipText: '#6d3e2f',
            title: '#6d3e2f',
            accent: '#cb7c39',
            accentSoft: '#f4dec6',
            inputBorder: '#ddb895',
            muted: '#6a544a',
            error: '#b42318',
            overlayTop: 'rgba(255, 244, 232, 0.22)',
            overlayBottom: 'rgba(255, 233, 210, 0.32)'
          }
        },
        {
          id: 'floral',
          label: 'Flores Purple',
          image: floresPurple,
          palette: {
            ink: '#352744',
            panel: 'rgba(255, 246, 255, 0.84)',
            panelBorder: 'rgba(244, 224, 255, 0.95)',
            chipBg: '#fcf6ff',
            chipText: '#6e3b89',
            title: '#6e3b89',
            accent: '#a25fd4',
            accentSoft: '#efddff',
            inputBorder: '#d8b8f1',
            muted: '#6b5a7d',
            error: '#a01f5d',
            overlayTop: 'rgba(255, 240, 255, 0.2)',
            overlayBottom: 'rgba(240, 223, 255, 0.3)'
          }
        },
        {
          id: 'prince',
          label: 'Principito',
          image: principito,
          palette: {
            ink: '#f9e8b1',
            panel: 'rgba(40, 37, 79, 0.76)',
            panelBorder: 'rgba(124, 110, 198, 0.9)',
            chipBg: '#3f3975',
            chipText: '#f9e8b1',
            title: '#f9e8b1',
            accent: '#7861d4',
            accentSoft: '#3b3568',
            inputBorder: '#8c7fcd',
            muted: '#d9d1f5',
            error: '#ff9eb1',
            overlayTop: 'rgba(36, 32, 66, 0.28)',
            overlayBottom: 'rgba(28, 24, 52, 0.45)'
          }
        }
      ]
    };
  },
  computed: {
    activeTheme() {
      return this.themes.find((theme) => theme.id === this.selectedTheme) || this.themes[0];
    },
    backgroundStyle() {
      const palette = this.activeTheme.palette;
      return {
        backgroundImage: `url(${this.activeTheme.image})`,
        '--ink': palette.ink,
        '--panel': palette.panel,
        '--panel-border': palette.panelBorder,
        '--chip-bg': palette.chipBg,
        '--chip-text': palette.chipText,
        '--title-color': palette.title,
        '--accent': palette.accent,
        '--accent-soft': palette.accentSoft,
        '--input-border': palette.inputBorder,
        '--muted': palette.muted,
        '--error': palette.error,
        '--overlay-top': palette.overlayTop,
        '--overlay-bottom': palette.overlayBottom
      };
    }
  },
  methods: {
    setTheme(themeId) {
      this.selectedTheme = themeId;
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  }
};
</script>

<style>
:root {
  --ink: #1f1a2e;
  --panel: rgba(255, 255, 255, 0.88);
  --panel-border: rgba(255, 255, 255, 0.92);
  --chip-bg: #fbf7ff;
  --chip-text: #4f3b78;
  --title-color: #4f3b78;
  --accent: #b996ef;
  --accent-soft: #f4ecff;
  --input-border: #c9afe9;
  --muted: #4a5d6f;
  --error: #b42318;
  --overlay-top: rgba(255, 255, 255, 0.38);
  --overlay-bottom: rgba(255, 255, 255, 0.28);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Avenir Next', 'Trebuchet MS', 'Gill Sans', sans-serif;
  color: var(--ink);
}

.app-shell {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px 14px;
  color: var(--ink);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--overlay-top), var(--overlay-bottom));
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1150px;
  margin: 0 auto;
}

.top {
  margin-bottom: 16px;
  border: 1px solid var(--panel-border);
  border-radius: 18px;
  padding: 16px;
  background: var(--panel);
  backdrop-filter: blur(2px);
  display: grid;
  gap: 12px;
}

.top h1 {
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  color: var(--title-color);
}

.top p {
  margin: 6px 0 0;
  color: var(--ink);
}

.theme-switcher {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.theme-switcher span {
  font-weight: 600;
  font-size: 0.92rem;
}

.theme-chip {
  border: 1px solid var(--input-border);
  border-radius: 999px;
  padding: 6px 12px;
  background: var(--chip-bg);
  color: var(--chip-text);
  cursor: pointer;
  font-size: 0.8rem;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.theme-chip:hover {
  transform: translateY(-1px);
}

.theme-chip.active {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}

.panel {
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 16px;
  background: var(--panel);
  backdrop-filter: blur(1px);
  color: var(--ink);
}

.panel h1,
.panel h2,
.panel h3,
.panel h4 {
  color: var(--title-color);
}

@media (max-width: 700px) {
  .app-shell {
    padding: 12px;
  }

  .top {
    padding: 12px;
  }

  .theme-chip {
    padding: 5px 9px;
    font-size: 0.75rem;
  }
}
</style>
