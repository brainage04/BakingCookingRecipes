import type { SiteConfig } from '@brainage04/astro-shell/config';
import { recipes } from './data/recipes';

export const siteConfig = {
  siteName: 'BakingCookingRecipes',
  homeTitle: 'BakingCookingRecipes',
  description: 'Recipe batch scalers, Woolworths cost calculators, substitutions, and bake notes.',
  navItems: [
    { name: 'Home', href: '/', match: '/', activeMode: 'exact' },
    ...recipes.map((recipe) => ({
      name: recipe.navTitle,
      href: `/${recipe.slug}/`,
      match: `/${recipe.slug}/`,
      activeMode: 'exact' as const,
    })),
    { name: 'Shopping list', href: '/shopping-list/', match: '/shopping-list/', activeMode: 'exact' },
    { name: 'Main site', href: 'https://brainage04.github.io/', external: true },
  ],
  sourceHref: 'https://github.com/brainage04/BakingCookingRecipes',
  faviconHref: undefined,
  faviconType: undefined,
  image: undefined,
  themeColor: '#171218',
  preconnectHrefs: [],
  ownerHref: 'https://github.com/brainage04',
  ownerName: 'brainage04',
  creatorHref: undefined,
  creatorName: undefined,
} as const satisfies SiteConfig;
