import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  shortcuts: [],
  presets: [presetUno(), presetRemToPx({ baseFontSize: 4 }), presetIcons({}), presetAttributify()],
  shortcuts: [
    ['t-c', 'w-full h-full'],
    ['f-c-c', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['text-ellipsis', 'truncate'],
  ],
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
    [/^fs-(.+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^fw-(.+)$/, ([, height]) => ({ 'font-weight': `${height}` })],
  ],
});
