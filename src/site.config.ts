import type { SiteConfig } from '@brainage04/astro-shell/config';
import { recipes } from './data/recipes';

// Shell releases after 0.7.0 keep pinned links in the bar and move the rest into the menu drawer. Shell 0.7.0 does not know
// the flag and ignores it, and its NavItem type rejects the property on a literal, so it is added through this helper.
const pinned = <T extends object>(item: T) => ({ ...item, pinned: true as const });

export const siteConfig = {
  siteName: 'BakingCookingRecipes',
  description: 'Recipe batch scalers, Woolworths cost calculators, substitutions, and bake notes.',
  navItems: [
    pinned({ name: 'Home', href: '/' }),
    ...recipes.map((recipe) => ({ name: recipe.navTitle, href: `/${recipe.slug}/` })),
    pinned({ name: 'Shopping list', href: '/shopping-list/' }),
    pinned({ name: 'Main site', href: 'https://brainage04.github.io/', external: true }),
  ],
  sourceHref: 'https://github.com/brainage04/BakingCookingRecipes',
  faviconHref: '/pfp.webp',
  faviconType: 'image/webp',
  themeColor: '#171218',
  themeColorLight: '#fbf5f8',
  ownerHref: 'https://github.com/brainage04',
  ownerName: 'brainage04',
} as const satisfies SiteConfig;
