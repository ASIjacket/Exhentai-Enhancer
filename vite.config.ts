import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'https://github.com/sk2589822/Exhentai-Enhancer',
        match: [
          'https://exhentai.org/*',
          'https://e-hentai.org/*',
        ],
        description: {
          '': 'improve UX of gallery & multipage viewer',
          'zh-TW': '改善 gallery 和 multipage viewer 的 UX',
        },
      },
      build: {
        metaFileName: true,
        externalGlobals: {
          'vue': cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
          'vue-toastification': [
            'VueToastification',
            (version, name) => `https://unpkg.com/pkg-cdn/dist/${name}/v${version}.iife.js`,
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
