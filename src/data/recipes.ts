import * as brownieData from './brownies';
import * as cookieData from './recipe';
import type { IngredientChoice } from './recipe';

export interface AlternativeControl {
  key: string;
  productKey: 'stevia' | 'brownMonkfruit' | 'proteinFlour';
  label: string;
  defaultChecked: boolean;
}

export interface RecipePageData {
  slug: string;
  navTitle: string;
  pageTitle: string;
  description: string;
  meta: Record<string, unknown>;
  sourceIngredients: readonly string[];
  sourceInstructions: readonly string[];
  experimentTodos: readonly string[];
  ingredients: readonly IngredientChoice[];
  servingsPerBatch: number;
  servingSingular: string;
  servingPlural: string;
  massLabel: string;
  massDescription: string;
  unavailableNutritionNote: string;
  storageKey: string;
  alternativeControls: readonly AlternativeControl[];
}

const standardAlternativeControls = [
  {
    key: 'stevia',
    productKey: 'stevia',
    label: 'Replace white/caster sugar with Whole Earth Stevia Sugar Replacement 600g.',
    defaultChecked: true,
  },
  {
    key: 'brownMonkfruit',
    productKey: 'brownMonkfruit',
    label: 'Replace brown sugar with Lakanto Monkfruit Sweetener Brown 450g.',
    defaultChecked: true,
  },
  {
    key: 'proteinFlour',
    productKey: 'proteinFlour',
    label: 'Replace plain flour with Vetta Smart Protein Plain Flour 1kg.',
    defaultChecked: true,
  },
] as const satisfies readonly AlternativeControl[];

export const recipes = [
  {
    slug: 'ChocolateChipCookies',
    navTitle: 'Cookies',
    pageTitle: 'Chocolate Chip Cookie Calculator',
    description: 'Chocolate chip cookie batch scaler, Woolworths cost calculator, substitutions, and bake notes.',
    meta: cookieData.recipeMeta,
    sourceIngredients: cookieData.sourceIngredients,
    sourceInstructions: cookieData.sourceInstructions,
    experimentTodos: cookieData.experimentTodos,
    ingredients: cookieData.ingredients,
    servingsPerBatch: cookieData.recipeMeta.cookiesPerBatch,
    servingSingular: 'cookie',
    servingPlural: 'cookies',
    massLabel: 'Estimated dough',
    massDescription: `Dough estimate only; cookie count is fixed at ${cookieData.recipeMeta.cookiesPerBatch} per batch.`,
    unavailableNutritionNote: 'Vanilla excluded: Woolworths nutrition is unavailable.',
    storageKey: 'cookie-calculator-todos',
    alternativeControls: standardAlternativeControls,
  },
  {
    slug: 'WorldsBestBrownies',
    navTitle: 'Brownies',
    pageTitle: 'World’s Best Brownies Calculator',
    description: 'Gordon Ramsay Restaurants brownie recipe scaler with Woolworths cost calculator, substitutions, and bake notes.',
    meta: brownieData.recipeMeta,
    sourceIngredients: brownieData.sourceIngredients,
    sourceInstructions: brownieData.sourceInstructions,
    experimentTodos: brownieData.experimentTodos,
    ingredients: brownieData.ingredients,
    servingsPerBatch: brownieData.recipeMeta.servingsPerBatch,
    servingSingular: 'brownie',
    servingPlural: 'brownies',
    massLabel: 'Estimated batter',
    massDescription: `Batter estimate only; brownie count is fixed at ${brownieData.recipeMeta.servingsPerBatch} per batch.`,
    unavailableNutritionNote: 'Vanilla excluded: Woolworths nutrition is unavailable. Optional chocolate chunks are included.',
    storageKey: 'brownie-calculator-todos',
    alternativeControls: standardAlternativeControls,
  },
] as const satisfies readonly RecipePageData[];

export function baseHref() {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
}

export function recipeHref(slug: string) {
  return `${baseHref()}${slug}/`;
}
