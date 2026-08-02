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
