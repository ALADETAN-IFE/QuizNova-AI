import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const config = {
  plugins: ["tailwindcss", "autoprefixer"], // Use 'tailwindcss' instead of '@tailwindcss/postcss'
};

export default config;
