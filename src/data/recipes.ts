import * as bologneseData from './bolognese';
import * as brownieData from './brownies';
import * as butterChickenData from './butterChicken';
import * as cookieData from './cookies';
import * as icedCoffeeData from './icedCoffee';
import * as proteinIceCreamData from './proteinIceCream';
import type { IngredientChoice, RecipeOption } from './types';

export interface RecipeMeta {
  title: string;
  sourceName: string;
  sourceUrl?: string;
  priceDate: string;
}

export interface RecipeSource {
  name: string;
  url?: string;
}

export interface AlternativeControl {
  key: string;
  productKey: 'stevia' | 'brownMonkfruit' | 'proteinFlour';
  label: string;
  defaultChecked: boolean;
}

export interface RecipePageData {
  slug: string;
  /** Home page section the recipe's card sits in. */
  group: 'baking' | 'meals';
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
  /** Options beyond the product swaps: checkboxes, radio groups, dropdowns and amounts that change the ingredients. */
  options?: readonly RecipeOption[];
  /** Links for the source line at the top, when one link is not enough. */
  sources?: readonly RecipeSource[];
  notes?: readonly string[];
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

export const recipes: readonly RecipePageData[] = [
  {
    slug: 'cookies',
    group: 'baking',
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
    massDescription: `Dough estimate only. The cookie count is fixed at ${cookieData.recipeMeta.cookiesPerBatch} per batch.`,
    unavailableNutritionNote: 'Vanilla calories use a USDA estimate. Vanilla macros are unavailable.',
    alternativeControls: standardAlternativeControls,
  },
  {
    slug: 'brownies',
    group: 'baking',
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
    massDescription: `Batter estimate only. The brownie count is fixed at ${brownieData.recipeMeta.servingsPerBatch} per batch.`,
    unavailableNutritionNote:
      'Vanilla calories use a USDA estimate. Vanilla macros are unavailable. Optional chocolate chunks are included.',
    alternativeControls: standardAlternativeControls,
  },
  {
    slug: 'protein-ice-cream',
    group: 'meals',
    navTitle: 'Protein ice cream',
    cardTitle: 'Protein Ice Cream',
    pageTitle: 'Protein Ice Cream',
    description:
      'Ninja Creami protein ice cream from Lee Lem with options for PB2, thickener, protein powder and fruit, live nutrition, Woolworths costs and freezing notes.',
    meta: proteinIceCreamData.recipeMeta,
    sources: proteinIceCreamData.sources,
    sourceIngredients: proteinIceCreamData.sourceIngredients,
    sourceInstructions: proteinIceCreamData.sourceInstructions,
    notes: proteinIceCreamData.sourceNotes,
    ingredients: proteinIceCreamData.ingredients,
    servingsPerBatch: 2,
    servingSingular: 'serve',
    servingPlural: 'serves',
    massLabel: 'Ingredient weight',
    massDescription:
      'One batch is one NC701 tub, split into 2 serves (half a tub each). Weight excludes the water added up to the MAX FILL line.',
    unavailableNutritionNote: 'Water added to the MAX FILL line counts as zero.',
    alternativeControls: [],
    options: proteinIceCreamData.options,
  },
  {
    slug: 'iced-coffee',
    group: 'meals',
    navTitle: 'Iced coffee',
    cardTitle: 'Protein Iced Coffee',
    pageTitle: 'Iced Coffee',
    description: 'Skim milk iced coffee with adjustable milk, coffee and stevia, live nutrition and Woolworths costs.',
    meta: icedCoffeeData.recipeMeta,
    sourceIngredients: icedCoffeeData.sourceIngredients,
    sourceInstructions: icedCoffeeData.sourceInstructions,
    notes: icedCoffeeData.sourceNotes,
    ingredients: icedCoffeeData.ingredients,
    servingsPerBatch: 1,
    servingSingular: 'glass',
    servingPlural: 'glasses',
    massLabel: 'Ingredient weight',
    massDescription: 'One batch is one glass of about 750mL. Weight excludes the hot water and ice.',
    unavailableNutritionNote: 'Hot water and ice count as zero.',
    alternativeControls: [],
    options: icedCoffeeData.options,
  },
  {
    slug: 'butter-chicken',
    group: 'meals',
    navTitle: 'Butter chicken',
    cardTitle: 'Butter Chicken and Rice',
    pageTitle: 'Butter Chicken',
    description:
      'Meal-prep butter chicken and rice made with The Spice Tailor kits from Woolworths, with kit and chicken options, live nutrition per container and costs.',
    meta: butterChickenData.recipeMeta,
    sourceIngredients: butterChickenData.sourceIngredients,
    sourceInstructions: butterChickenData.sourceInstructions,
    notes: butterChickenData.sourceNotes,
    ingredients: butterChickenData.ingredients,
    servingsPerBatch: 5,
    servingSingular: 'container',
    servingPlural: 'containers',
    massLabel: 'Raw weight',
    massDescription:
      'One batch is the whole pan split into 5 equal containers: one plate and 4 for meal prep. Weight is raw chicken, uncooked rice and the kits.',
    unavailableNutritionNote: 'Chicken is counted raw and rice uncooked.',
    alternativeControls: [],
    options: butterChickenData.options,
  },
  {
    slug: 'spaghetti-bolognese',
    group: 'meals',
    navTitle: 'Spaghetti bolognese',
    cardTitle: 'Spaghetti Bolognese',
    pageTitle: 'Spaghetti Bolognese',
    description:
      'Spaghetti bolognese from 1kg of lean beef mince, Don shortcut bacon and a Dolmio jar, with live nutrition and Woolworths costs.',
    meta: bologneseData.recipeMeta,
    sourceIngredients: bologneseData.sourceIngredients,
    sourceInstructions: bologneseData.sourceInstructions,
    notes: bologneseData.sourceNotes,
    ingredients: bologneseData.ingredients,
    servingsPerBatch: bologneseData.servesPerBatch,
    servingSingular: 'serve',
    servingPlural: 'serves',
    massLabel: 'Raw weight',
    massDescription: `The serve count is ${bologneseData.servesPerBatch}, a placeholder. Weight is raw mince and bacon, the jar and dry pasta.`,
    unavailableNutritionNote: 'Mince and bacon are counted raw.',
    alternativeControls: [],
    options: bologneseData.options,
  },
];
