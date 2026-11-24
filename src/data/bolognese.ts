import { mealIngredient } from './mealIngredient';
import {
  beefMinceExtraLean,
  beefMinceLean,
  dolmioClassicTomatoBasil,
  dolmioExtraBolognese,
  dolmioSaltReduced,
  dolmioTomatoOnionRoastGarlic,
  dolmioTraditionalClassicTomato,
  donShortCutBacon,
  mealPriceDate,
  spaghetti,
} from './mealProducts';
import type { IngredientChoice, RecipeOption } from './types';

export const recipeMeta = {
  title: 'Spaghetti Bolognese',
  sourceName: "Thomas's own recipe",
  localStore: 'Selected Woolworths store',
  priceDate: mealPriceDate,
} as const;

/** Placeholder: Thomas has not said how many serves the batch makes. */
export const servesPerBatch = 6;
/** Placeholder: Thomas has not said how much pasta a serve takes. */
export const pastaGramsPerServe = 80;

export const options: readonly RecipeOption[] = [
  {
    kind: 'choice',
    key: 'mince',
    label: 'Beef mince, 1kg',
    control: 'radio',
    defaultValue: 'extra-lean',
    choices: [
      { value: 'extra-lean', label: 'Extra lean (5% fat)' },
      { value: 'lean', label: 'Lean (10% fat)' },
    ],
  },
  {
    kind: 'choice',
    key: 'jar',
    label: 'Dolmio pasta sauce, 500g jar',
    control: 'select',
    defaultValue: 'tomato-onion-roast-garlic',
    choices: [
      { value: 'tomato-onion-roast-garlic', label: 'Extra Tomato, Onion and Roast Garlic (usual jar)' },
      { value: 'extra-bolognese', label: 'Extra Bolognese' },
      { value: 'classic-tomato-basil', label: 'Classic Tomato with Basil' },
      { value: 'traditional-classic-tomato', label: 'Traditional Recipe Classic Tomato' },
      { value: 'salt-reduced', label: 'Extra Tomato, Onion and Garlic Salt Reduced' },
    ],
  },
  {
    kind: 'amount',
    key: 'pastaGrams',
    label: 'Dry spaghetti per serve (placeholder)',
    unit: 'g',
    defaultValue: pastaGramsPerServe,
    min: 0,
    step: 10,
    hint: `Placeholder until the real amount is set. The batch is ${servesPerBatch} serves, also a placeholder. 0 leaves the pasta out.`,
  },
];

export const sourceIngredients = [
  '1kg beef mince, extra lean (5% fat) or lean (10% fat)',
  '500g Don shortcut bacon (half a 1kg pack)',
  '1 jar (500g) Dolmio pasta sauce, usually Tomato, Onion and Roasted Garlic',
  `Dry spaghetti, ${pastaGramsPerServe}g a serve (placeholder)`,
] as const;

export const sourceInstructions = [] as const;

export const sourceNotes = [
  `The batch is ${servesPerBatch} serves and the pasta is ${pastaGramsPerServe}g of dry spaghetti a serve. Both are placeholders until Thomas sets them.`,
  'The usual jar is Dolmio Extra Tomato, Onion and Roast Garlic. The other four 500g jars are in the sauce list.',
  'The Woolworths listings for Dolmio Traditional Recipe Classic Tomato and Extra Tomato, Onion and Garlic Salt Reduced had no price on 24 November, so they show $0.00 until Woolworths has a price.',
  'Mince and bacon are counted raw, so fat that stays in the pan is not taken off.',
  "Bacon is priced from the 200g Don Short Cut Rindless pack, which has the same panel as the 500g pack on Don's own page (https://isdonisgood.com.au/product/don-short-cut-bacon-500g/).",
] as const;

const jars = [
  {
    value: 'tomato-onion-roast-garlic',
    label: 'Dolmio Extra Tomato, Onion and Roast Garlic',
    product: dolmioTomatoOnionRoastGarlic,
  },
  { value: 'extra-bolognese', label: 'Dolmio Extra Bolognese', product: dolmioExtraBolognese },
  { value: 'classic-tomato-basil', label: 'Dolmio Classic Tomato with Basil', product: dolmioClassicTomatoBasil },
  {
    value: 'traditional-classic-tomato',
    label: 'Dolmio Traditional Recipe Classic Tomato',
    product: dolmioTraditionalClassicTomato,
  },
  { value: 'salt-reduced', label: 'Dolmio Extra Tomato, Onion and Garlic Salt Reduced', product: dolmioSaltReduced },
];

export const ingredients: IngredientChoice[] = [
  mealIngredient({
    key: 'mince-extra-lean',
    label: 'Extra lean beef mince (5% fat)',
    sourceAmount: '1kg',
    quantity: 1000,
    product: beefMinceExtraLean,
    when: { option: 'mince', equals: 'extra-lean' },
  }),
  mealIngredient({
    key: 'mince-lean',
    label: 'Lean beef mince (10% fat)',
    sourceAmount: '1kg',
    quantity: 1000,
    product: beefMinceLean,
    when: { option: 'mince', equals: 'lean' },
  }),
  mealIngredient({
    key: 'bacon',
    label: 'Don shortcut bacon',
    sourceAmount: '500g (half a 1kg pack)',
    quantity: 500,
    product: donShortCutBacon,
  }),
  ...jars.map(({ value, label, product }) =>
    mealIngredient({
      key: `jar-${value}`,
      label,
      sourceAmount: '1 jar (500g)',
      quantity: 500,
      product,
      when: { option: 'jar', equals: value },
    }),
  ),
  mealIngredient({
    key: 'spaghetti',
    label: 'Dry spaghetti (placeholder amount)',
    sourceAmount: `${pastaGramsPerServe}g a serve, ${servesPerBatch} serves`,
    quantity: servesPerBatch,
    product: spaghetti,
    perUnitOf: 'pastaGrams',
  }),
];
