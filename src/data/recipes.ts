import * as brownieData from './brownies';
import * as cookieData from './recipe';
import type { IngredientChoice } from './recipe';

export type RecipeMeta = typeof brownieData.recipeMeta | typeof cookieData.recipeMeta;

export interface AlternativeControl {
  key: string;
  productKey: 'stevia' | 'brownMonkfruit' | 'proteinFlour';
  label: string;
  defaultChecked: boolean;
}

export interface RecipePageData {
  slug: string;
  navTitle: string;
  cardTitle: string;
  pageTitle: string;
  description: string;
  meta: RecipeMeta;
  sourceIngredients: readonly string[];
  sourceInstructions: readonly string[];
  ingredients: readonly IngredientChoice[];
  servingsPerBatch: number;
  servingSingular: string;
  servingPlural: string;
  massLabel: string;
  massDescription: string;
  unavailableNutritionNote: string;
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
    slug: 'Cookies',
    navTitle: 'Cookies',
    cardTitle: 'Chocolate Chip Cookies',
    pageTitle: 'Cookies',
    description: 'Chocolate chip cookie batch scaler, Woolworths cost calculator, substitutions, and bake notes.',
    meta: cookieData.recipeMeta,
    sourceIngredients: cookieData.sourceIngredients,
    sourceInstructions: cookieData.sourceInstructions,
    ingredients: cookieData.ingredients,
    servingsPerBatch: cookieData.recipeMeta.cookiesPerBatch,
    servingSingular: 'cookie',
    servingPlural: 'cookies',
    massLabel: 'Estimated dough',
    massDescription: `Dough estimate only; cookie count is fixed at ${cookieData.recipeMeta.cookiesPerBatch} per batch.`,
    unavailableNutritionNote: 'Vanilla calories use a USDA estimate; vanilla macros are unavailable.',
    alternativeControls: standardAlternativeControls,
  },
  {
    slug: 'Brownies',
    navTitle: 'Brownies',
    cardTitle: 'Brownies',
    pageTitle: 'Brownies',
    description:
      'Gordon Ramsay Restaurants brownie recipe scaler with Woolworths cost calculator, substitutions, and bake notes.',
    meta: brownieData.recipeMeta,
    sourceIngredients: brownieData.sourceIngredients,
    sourceInstructions: brownieData.sourceInstructions,
    ingredients: brownieData.ingredients,
    servingsPerBatch: brownieData.recipeMeta.servingsPerBatch,
    servingSingular: 'brownie',
    servingPlural: 'brownies',
    massLabel: 'Estimated batter',
    massDescription: `Batter estimate only; brownie count is fixed at ${brownieData.recipeMeta.servingsPerBatch} per batch.`,
    unavailableNutritionNote:
      'Vanilla calories use a USDA estimate; vanilla macros are unavailable. Optional chocolate chunks are included.',
    alternativeControls: standardAlternativeControls,
  },
] as const satisfies readonly RecipePageData[];
