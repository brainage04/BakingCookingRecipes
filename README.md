# BakingCookingRecipes

Astro recipe calculators for scaling cookie and brownie batches, comparing ingredient substitutions, estimating Woolworths costs, and combining purchases into one shopping list.

## Requirements

- Node.js 24
- npm

## Development

```bash
npm ci
npm run dev
```

Recipe and product data live in `src/data`. Pure calculation logic lives in `src/lib/calculations.ts`.

The meal recipes (protein ice cream, iced coffee, butter chicken, spaghetti bolognese) use the same calculator pages as cookies and brownies. Each has options (checkboxes, radio groups, a dropdown and amounts) that add, swap or scale ingredient rows, declared in `src/data/<recipe>.ts` and resolved by `resolveIngredients` in `src/lib/calculations.ts`. Every product in `src/data/mealProducts.ts` carries the panel line it was copied from and its Woolworths or maker URL. The old `/meals/...` addresses redirect to the top-level pages (`astro.config.mjs`).

## Validation

```bash
npm run check
npm run lint
npm run format:check
npm test
npm run build
```

## Deployment

Pushes to `main` are validated and deployed to [BakingCookingRecipes](https://brainage04.github.io/BakingCookingRecipes/) through GitHub Actions and GitHub Pages.
