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

The meal pages (protein ice cream, iced coffee, butter chicken, bolognese) keep their recipes in `src/data/meals`. Every product there carries the panel line it was copied from and its Woolworths or maker URL, and `src/lib/mealNutrition.ts` turns the amounts into kcal, protein, carbohydrate and fat.

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
