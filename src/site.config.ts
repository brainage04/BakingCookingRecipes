import type { SiteConfig } from '@brainage04/astro-shell/config';
import { recipes } from './data/recipes';

export const siteConfig = {
  siteName: 'BakingCookingRecipes',
  description: 'Recipe batch scalers, Woolworths cost calculators, substitutions, and bake notes.',
  navItems: [
    { name: 'Home', href: '/' },
    ...recipes.map((recipe) => ({ name: recipe.navTitle, href: `/${recipe.slug}/` })),
    { name: 'Shopping list', href: '/shopping-list/' },
    { name: 'Main site', href: 'https://brainage04.github.io/', external: true },
  ],
  sourceHref: 'https://github.com/brainage04/BakingCookingRecipes',
  faviconHref: '/pfp.webp',
  faviconType: 'image/webp',
  themeColor: '#171218',
  ownerHref: 'https://github.com/brainage04',
  ownerName: 'brainage04',
} as const satisfies SiteConfig;
