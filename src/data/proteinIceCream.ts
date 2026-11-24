import { mealIngredient } from './mealIngredient';
import {
  banana,
  cotteesVanillaPudding,
  custardCasein,
  dailyShakeVanilla,
  mealPriceDate,
  pb2,
  skimMilk,
  stevia,
  strawberries,
  xanthanGum,
} from './mealProducts';
import type { IngredientChoice, RecipeOption } from './types';

export const recipeMeta = {
  title: 'Protein Ice Cream (Ninja Creami)',
  sourceName: 'Lee Lem',
  sourceUrl: 'https://www.youtube.com/watch?v=u1qZQcYKmcM',
  localStore: 'Selected Woolworths store',
  priceDate: mealPriceDate,
} as const;

export const sources = [
  {
    name: 'Lee Lem, "My top 3 Ninja Creami recipes under 300 calories" (YouTube, 9 May 2026)',
    url: 'https://www.youtube.com/watch?v=u1qZQcYKmcM',
  },
  {
    name: 'Lee Lem, "Best Creami recipe I\'ve tried so far" (YouTube, 25 May 2024)',
    url: 'https://www.youtube.com/watch?v=_7xzieD6WUk',
  },
  { name: 'Lee Lem on YouTube', url: 'https://www.youtube.com/@l_eel_em' },
] as const;

export const options: readonly RecipeOption[] = [
  {
    kind: 'amount',
    key: 'pb2Tbsp',
    label: 'PB2 powdered peanut butter',
    unit: 'tbsp',
    defaultValue: 2,
    min: 0,
    hint: '2 tbsp by default, 3 is too strong. 0 leaves it out.',
  },
  {
    kind: 'choice',
    key: 'thickener',
    label: 'Thickener',
    control: 'radio',
    defaultValue: 'pudding',
    choices: [
      { value: 'pudding', label: "Cottee's instant vanilla pudding mix, 10g" },
      { value: 'xanthan', label: 'Xanthan gum, 1/4 tsp' },
      { value: 'none', label: 'None' },
    ],
  },
  {
    kind: 'choice',
    key: 'protein',
    label: 'Protein',
    control: 'radio',
    defaultValue: 'custard',
    choices: [
      { value: 'custard', label: 'Muscle Nation Custard Casein, 2 scoops (40g)' },
      { value: 'shake', label: 'Muscle Nation Protein Daily Shake vanilla ice cream, 1 scoop (30g)' },
    ],
  },
  { kind: 'toggle', key: 'strawberries', label: 'Add 150g mashed strawberries', defaultValue: false },
  {
    kind: 'toggle',
    key: 'banana',
    label: 'Add 150g mashed overripe banana',
    defaultValue: false,
    hint: 'Tried it: kind of mid, would not do it again.',
  },
];

export const sourceIngredients = [
  '300mL skim milk',
  '1 tbsp stevia',
  'PB2 powdered peanut butter, optional, 2 tbsp by default',
  "Thickener, optional: 10g Cottee's instant vanilla pudding mix, or 1/4 tsp xanthan gum",
  'Protein, exactly one: Muscle Nation Custard Casein, 2 scoops (40g), or Muscle Nation Protein Daily Shake vanilla ice cream, 1 scoop (30g)',
  '150g mashed strawberries, optional',
  '150g mashed overripe banana, optional (tried, not recommended)',
  'Water up to the MAX FILL line, added after everything else',
] as const;

export const sourceInstructions = [
  'Put the milk, stevia, PB2, thickener, protein powder and any mashed fruit in an NC701 tub and mix. Then add water up to the MAX FILL line.',
  'Freeze the tub upright and level for at least 12 hours. 16 hours or more is ideal, and past 16 hours the gains are small.',
  'Put the frozen tub in the machine and select Scoop, then Lite Ice Cream.',
  'Re-spin only if it comes out crumbly or powdery: add 1 to 2 tbsp of milk and press Re-spin. Very cold bases often need it.',
  'Mix-ins (optional): dig a hole down the middle, add the pieces and press Mix-In.',
] as const;

export const sourceNotes = [
  'Freezing time: Ninja Australia says at least 24 hours (https://ninjakitchenapac.zendesk.com/hc/en-au/articles/15978391315471-NC701-Ninja-Swirl-by-CREAMi-FAQ). In practice 12 hours is the minimum, 16 hours or more is ideal, and past 16 hours the gains are small.',
  "The base is Lee Lem's Vanilla Soft Serve (300mL milk, 30g Muscle Nation vanilla ice cream whey isolate, 10g instant pudding mix) and Custard Base (300mL skim milk, 40g Muscle Nation Custard Protein, sweetener), from the first video above. Lee says the Custard Base needs no xanthan gum or pudding mix as a thickener.",
  "PB2 is an addition to Lee's recipes. 3 tbsp was too strong, so 2 tbsp is the default.",
  'Ninja Australia says not to re-spin if you are also using the Mix-In program, so re-spin first and only then add mix-ins (same FAQ).',
  'The Lite Ice Cream program is the one Ninja names for recipes made with sugar substitutes (same FAQ).',
  'The same FAQ suggests 1 tbsp of any instant pudding mix in place of xanthan gum.',
  'Xanthan gum: 1/8 to 1/4 tsp per 16 oz (473mL) pint is the typical dose (https://scoopandchurn.com/blog/ninja-creami-stabilizers). 1/4 tsp is used here, about 0.75g.',
  "Overripe banana (150g mashed, from Lee's banana version in the second video) was tried and was kind of mid, so it is off by default.",
  'The 23 November version had 3 tbsp PB2 and 10g of pudding mix in both the Custard and the Vanilla. The older notes had the PB2 optional (or 150g of mashed strawberries in its place) and the pudding mix in the Vanilla only.',
  'The older notes estimated Custard at about 250 kcal and 48g protein, Vanilla at about 255 kcal and 33g, and about 337 kcal and 44g with PB2. The label figures differ: by the panels Custard without PB2 or pudding is 35g protein, and 3 tbsp of PB2 adds 8.6g protein, not 11g.',
  'The tub holds 473mL to the MAX FILL line. Water added up to the line counts as zero energy and zero macros.',
  'Spare tubs (2-pack, $59.99, only Swirl tubs fit): https://sharkninja.com.au/products/ninja-swirl-by-creami-2-pack-tubs-and-lids',
  'A tablespoon of stevia is taken as 16g (the panel serve of 4g as 1 teaspoon, 4 teaspoons to an Australian tablespoon). A tablespoon of PB2 is taken as 6.5g (the panel serve of 13g as 2 tbsp). Neither is from a source that gives a spoon weight. Weigh a level spoon to replace them.',
] as const;

export const ingredients: IngredientChoice[] = [
  mealIngredient({ key: 'milk', label: 'Skim milk', sourceAmount: '300mL', quantity: 300, product: skimMilk }),
  mealIngredient({ key: 'stevia', label: 'Stevia', sourceAmount: '1 tbsp (16g)', quantity: 16, product: stevia }),
  mealIngredient({
    key: 'pb2',
    label: 'PB2 powdered peanut butter',
    sourceAmount: '2 tbsp by default (6.5g each)',
    quantity: 6.5,
    product: pb2,
    perUnitOf: 'pb2Tbsp',
  }),
  mealIngredient({
    key: 'pudding',
    label: "Cottee's instant vanilla pudding mix",
    sourceAmount: '10g (about 2 tsp)',
    quantity: 10,
    product: cotteesVanillaPudding,
    when: { option: 'thickener', equals: 'pudding' },
  }),
  mealIngredient({
    key: 'xanthan',
    label: 'Xanthan gum',
    sourceAmount: '1/4 tsp (about 0.75g)',
    quantity: 0.75,
    product: xanthanGum,
    when: { option: 'thickener', equals: 'xanthan' },
  }),
  mealIngredient({
    key: 'custard',
    label: 'Muscle Nation Custard Casein',
    sourceAmount: '2 scoops (40g)',
    quantity: 40,
    product: custardCasein,
    when: { option: 'protein', equals: 'custard' },
  }),
  mealIngredient({
    key: 'shake',
    label: 'Muscle Nation Protein Daily Shake, vanilla ice cream',
    sourceAmount: '1 scoop (30g)',
    quantity: 30,
    product: dailyShakeVanilla,
    when: { option: 'protein', equals: 'shake' },
  }),
  mealIngredient({
    key: 'strawberries',
    label: 'Strawberries, mashed',
    sourceAmount: '150g',
    quantity: 150,
    product: strawberries,
    when: { option: 'strawberries', equals: true },
  }),
  mealIngredient({
    key: 'banana',
    label: 'Overripe banana, mashed',
    sourceAmount: '150g (about 1 banana)',
    quantity: 150,
    product: banana,
    when: { option: 'banana', equals: true },
  }),
];
