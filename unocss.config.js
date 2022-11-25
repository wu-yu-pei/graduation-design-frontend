import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  shortcuts: [],
  presets: [presetUno(), presetRemToPx({ baseFontSize: 4 }), presetIcons({}), presetAttributify()],
});
