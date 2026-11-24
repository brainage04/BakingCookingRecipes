import { mealIngredient } from './mealIngredient';
import { instantCoffee, mealPriceDate, skimMilk, stevia } from './mealProducts';
import type { IngredientChoice, RecipeOption } from './types';

export const recipeMeta = {
  title: 'Protein Iced Coffee',
  sourceName: "Thomas's own recipe",
  localStore: 'Selected Woolworths store',
  priceDate: mealPriceDate,
} as const;

export const options: readonly RecipeOption[] = [
  {
    kind: 'amount',
    key: 'milkMl',
    label: 'Skim milk',
    unit: 'mL',
    defaultValue: 600,
    min: 0,
    step: 50,
    hint: 'More milk and less water keeps it from tasting diluted.',
  },
  { kind: 'amount', key: 'coffeeTsp', label: 'Instant coffee', unit: 'tsp', defaultValue: 3, min: 0, step: 0.5 },
  {
    kind: 'amount',
    key: 'steviaTsp',
    label: 'Stevia',
    unit: 'tsp',
    defaultValue: 3,
    min: 0,
    step: 0.5,
    hint: '1 tbsp (3 tsp) is still a bit much for some, 2 tbsp was far too sweet.',
  },
];

export const sourceIngredients = [
  '600mL skim milk',
  '3 tsp instant coffee',
  '3 tsp stevia',
  '100mL hot water',
  'Ice, up to about 750mL in total',
] as const;

export const sourceInstructions = [
  'Dissolve the instant coffee and the stevia in 100mL of hot water.',
  'Add the milk.',
  'Add ice, and cold water only if needed, up to about 750mL in total.',
] as const;

export const sourceNotes = [
  'Too much water makes it taste diluted and weird, so keep the water low and use milk for the volume.',
  '2 tbsp of stevia was far too sweet and 1 tbsp was still a bit much.',
  'The original notes had 500mL skim milk (about 175 kcal and 18g protein), 2 to 3 tsp instant coffee (about 4 to 6g, about 140 to 210mg caffeine) and 2 tbsp stevia, with ice and/or cold water up to 750mL.',
  'Use the Batches box to make more of everything, for example 2 for a bigger glass or a second one.',
  'A teaspoon of instant coffee is taken as 2g (4 to 6g for 2 to 3 teaspoons, from the original notes). A teaspoon of stevia is taken as 4g, the panel serve. Water and ice count as zero energy and zero macros.',
] as const;

export const ingredients: IngredientChoice[] = [
  mealIngredient({
    key: 'milk',
    label: 'Skim milk',
    sourceAmount: '600mL by default',
    quantity: 1,
    product: skimMilk,
    perUnitOf: 'milkMl',
  }),
  mealIngredient({
    key: 'coffee',
    label: 'Instant coffee',
    sourceAmount: '3 tsp by default (2g each)',
    quantity: 2,
    product: instantCoffee,
    perUnitOf: 'coffeeTsp',
  }),
  mealIngredient({
    key: 'stevia',
    label: 'Stevia',
    sourceAmount: '3 tsp by default (4g each)',
    quantity: 4,
    product: stevia,
    perUnitOf: 'steviaTsp',
  }),
];
