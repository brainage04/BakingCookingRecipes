import { defineConfig } from 'astro/config';
import astroShell from '@brainage04/astro-shell';
import { siteConfig } from './src/site.config.ts';

// The meal pages first lived under /meals/. Keep those addresses working. Astro adds the base path to a redirect's
// source but not to its destination, so the destination carries it here (the shell reads the same variable).
const base = (process.env.PUBLIC_BASE_PATH ?? '/').replace(/\/$/, '');
const mealRedirects = {
  '/meals': `${base}/`,
  '/meals/protein-ice-cream': `${base}/protein-ice-cream/`,
  '/meals/iced-coffee': `${base}/iced-coffee/`,
  '/meals/butter-chicken': `${base}/butter-chicken/`,
  '/meals/spaghetti-bolognese': `${base}/spaghetti-bolognese/`,
};

export default defineConfig({
  redirects: mealRedirects,
  integrations: [
    astroShell({
      config: siteConfig,
      styles: ['@brainage04/astro-shell/themes/rose.css', './src/styles/site.css'],
    }),
  ],
});
