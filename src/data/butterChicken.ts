import { mealIngredient } from './mealIngredient';
import {
  chickenBreast,
  chickenThigh,
  mealPriceDate,
  spiceTailorClassicButterChicken,
  spiceTailorOriginalTikkaMasala,
  spiceTailorSpicyButterChicken,
  sunflowerOil,
  whiteRice,
} from './mealProducts';
import type { IngredientChoice, RecipeOption } from './types';

export const recipeMeta = {
  title: 'Butter Chicken and Rice (The Spice Tailor)',
  sourceName: 'The Spice Tailor',
  sourceUrl: 'https://au.thespicetailor.com/products/classic-butter-chicken/',
  localStore: 'Selected Woolworths store',
  priceDate: mealPriceDate,
} as const;

/** Batch cooked on 23 November 2026: 2 kits, 550mL of uncooked rice from a measuring cup, 1.576kg of raw chicken. */
export const exampleBatch = { kits: 2, riceMillilitres: 550, chickenGrams: 1576, oilTablespoons: 2 } as const;

/**
 * Uncooked long grain white rice at 0.78g/mL: one US cup is 185g in 237mL (USDA FoodData Central, via
 * https://cookingcalculator.app/ingredients/white-rice). A cup packed tighter reaches about 0.85g/mL, which would
 * make the rice 468g and add about 140 kcal to the batch.
 */
export const riceGramsPerMillilitre = 0.78;
export const riceGrams = Math.round(exampleBatch.riceMillilitres * riceGramsPerMillilitre);

const kitGrams = 300;
const kitsGrams = exampleBatch.kits * kitGrams;

export const options: readonly RecipeOption[] = [
  {
    kind: 'choice',
    key: 'kit',
    label: 'Kit',
    control: 'radio',
    defaultValue: 'classic',
    choices: [
      { value: 'classic', label: 'Classic Butter Chicken (mild)' },
      { value: 'spicy', label: 'Spicy Butter Chicken' },
      { value: 'tikka', label: 'Original Tikka Masala' },
    ],
  },
  {
    kind: 'choice',
    key: 'chicken',
    label: 'Chicken',
    control: 'radio',
    defaultValue: 'breast',
    choices: [
      { value: 'breast', label: 'Chicken breast' },
      { value: 'thigh', label: 'Chicken thigh' },
    ],
  },
  {
    kind: 'toggle',
    key: 'oil',
    label: "Cook with the kit's oil step (1 tbsp sunflower oil per kit)",
    defaultValue: false,
  },
];

export const sourceIngredients = [
  `${exampleBatch.kits} The Spice Tailor kits (${kitsGrams}g): Classic Butter Chicken, Spicy Butter Chicken or Original Tikka Masala`,
  `${exampleBatch.chickenGrams}g raw chicken breast or chicken thigh`,
  `${exampleBatch.riceMillilitres}mL uncooked white rice, measured in a cup (about ${riceGrams}g)`,
  `${exampleBatch.oilTablespoons} tbsp sunflower oil, optional (1 tbsp per kit)`,
] as const;

export const sourceInstructions = [
  'Cut the chicken into generous pieces.',
  "Heat 1 tbsp of oil in a pan per kit, add the kit's spices and cook for 20 seconds.",
  'Add the chicken and brown lightly. Add the base sauce and simmer for 1 to 2 minutes.',
  'Stir in the main sauce and simmer for 3 to 5 minutes, or until the chicken is cooked through.',
  'Cook the rice. Split the chicken, sauce and rice into 5 equal portions: one plate and 4 meal-prep containers.',
] as const;

export const sourceNotes = [
  'The weights are the batch cooked on 23 November 2026: 2 kits, 550mL of uncooked rice and 1.576kg of raw chicken breast, split into 5 equal containers.',
  "The kit's own instructions (https://au.thespicetailor.com/products/classic-butter-chicken/) do not fix an amount of chicken. The maker's recipe card uses 250g of chicken thigh per kit (https://au.thespicetailor.com/recipes/classic-butter-chicken-with-rice/).",
  'Buy the kits at 40 to 50 percent off and keep 4 to 6 in the cupboard.',
  "The Spice Tailor's Australian range has no Spicy Tikka Masala (https://au.thespicetailor.com/products/). It sells Classic Butter Chicken, Spicy Butter Chicken and Original Tikka Masala.",
  'Woolworths calls the mild kit Classic Butter Chicken. The Original Butter Chicken made on 23 November is taken as that kit.',
  'Rice is taken as 0.78g per mL when uncooked (USDA FoodData Central, via https://cookingcalculator.app/ingredients/white-rice). A cup packed tighter, at 0.85g per mL, would add about 27 kcal to each container.',
  'Chicken is counted raw and rice uncooked, as the panels list them. Cooking changes only the water, so the totals stay the same.',
] as const;

const kitIngredients = [
  {
    key: 'kit-classic',
    value: 'classic',
    label: 'The Spice Tailor Classic Butter Chicken',
    product: spiceTailorClassicButterChicken,
  },
  {
    key: 'kit-spicy',
    value: 'spicy',
    label: 'The Spice Tailor Spicy Butter Chicken',
    product: spiceTailorSpicyButterChicken,
  },
  {
    key: 'kit-tikka',
    value: 'tikka',
    label: 'The Spice Tailor Original Tikka Masala',
    product: spiceTailorOriginalTikkaMasala,
  },
].map(({ key, value, label, product }) =>
  mealIngredient({
    key,
    label,
    sourceAmount: `${exampleBatch.kits} kits (${kitsGrams}g)`,
    quantity: kitsGrams,
    product,
    when: { option: 'kit', equals: value },
  }),
);

export const ingredients: IngredientChoice[] = [
  ...kitIngredients,
  mealIngredient({
    key: 'chicken-breast',
    label: 'Raw chicken breast',
    sourceAmount: `${exampleBatch.chickenGrams}g`,
    quantity: exampleBatch.chickenGrams,
    product: chickenBreast,
    when: { option: 'chicken', equals: 'breast' },
  }),
  mealIngredient({
    key: 'chicken-thigh',
    label: 'Raw chicken thigh',
    sourceAmount: `${exampleBatch.chickenGrams}g`,
    quantity: exampleBatch.chickenGrams,
    product: chickenThigh,
    when: { option: 'chicken', equals: 'thigh' },
  }),
  mealIngredient({
    key: 'rice',
    label: 'White rice, uncooked',
    sourceAmount: `${exampleBatch.riceMillilitres}mL (about ${riceGrams}g)`,
    quantity: exampleBatch.riceMillilitres * riceGramsPerMillilitre,
    product: whiteRice,
  }),
  mealIngredient({
    key: 'oil',
    label: 'Sunflower oil',
    sourceAmount: `${exampleBatch.oilTablespoons} tbsp (${exampleBatch.oilTablespoons * 15}mL)`,
    quantity: exampleBatch.oilTablespoons * 15,
    product: sunflowerOil,
    when: { option: 'oil', equals: true },
  }),
];
