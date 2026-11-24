import { ingredient } from './ingredient';
import {
  beefMinceExtraLean,
  beefMinceLean,
  dolmioClassicTomatoBasil,
  dolmioExtraBolognese,
  dolmioExtraTomatoOnionGarlicSaltReduced,
  dolmioExtraTomatoOnionRoastGarlic,
  dolmioTraditionalClassicTomato,
  donShortCutBacon,
  spaghetti,
} from './products';
import type { MealProduct, MealRecipe, MealVariant } from './types';

/** Placeholders: Thomas has not said how many serves the batch makes or how much pasta a serve takes. */
export const placeholderServings = 6;
export const placeholderPastaGramsPerServe = 80;

const minces: readonly { key: string; title: string; product: MealProduct }[] = [
  { key: 'extra-lean', title: 'extra-lean mince (5% fat)', product: beefMinceExtraLean },
  { key: 'lean', title: 'lean mince (10% fat)', product: beefMinceLean },
];

const sauces: readonly { key: string; title: string; product: MealProduct }[] = [
  {
    key: 'tomato-onion-roast-garlic',
    title: 'Dolmio Tomato, Onion and Roast Garlic',
    product: dolmioExtraTomatoOnionRoastGarlic,
  },
  { key: 'extra-bolognese', title: 'Dolmio Extra Bolognese', product: dolmioExtraBolognese },
  { key: 'classic-tomato-basil', title: 'Dolmio Classic Tomato with Basil', product: dolmioClassicTomatoBasil },
  {
    key: 'traditional-classic-tomato',
    title: 'Dolmio Traditional Recipe Classic Tomato',
    product: dolmioTraditionalClassicTomato,
  },
  {
    key: 'salt-reduced',
    title: 'Dolmio Extra Tomato, Onion and Garlic Salt Reduced',
    product: dolmioExtraTomatoOnionGarlicSaltReduced,
  },
];

const pastaExtra = {
  label: `${placeholderServings * placeholderPastaGramsPerServe}g dry spaghetti (PLACEHOLDER: ${placeholderPastaGramsPerServe}g for each of ${placeholderServings} serves)`,
  ingredients: [
    ingredient(
      'Spaghetti, dry',
      `${placeholderServings * placeholderPastaGramsPerServe}g (placeholder)`,
      placeholderServings * placeholderPastaGramsPerServe,
      spaghetti,
      {
        placeholder: true,
      },
    ),
  ],
};

const variants: MealVariant[] = minces.flatMap((mince) =>
  sauces.map((sauce) => ({
    key: `${mince.key}-${sauce.key}`,
    title: `${mince.title} with ${sauce.title}`,
    ingredients: [
      ingredient('Beef mince', '1kg', 1000, mince.product),
      ingredient('Dolmio pasta sauce', '1 jar (500g)', 500, sauce.product),
    ],
    extras: [pastaExtra],
  })),
);

export const bolognese: MealRecipe = {
  slug: 'spaghetti-bolognese',
  navTitle: 'Bolognese',
  cardTitle: 'Spaghetti Bolognese',
  pageTitle: 'Spaghetti Bolognese',
  description:
    'Spaghetti bolognese from 1kg of lean beef mince, Don shortcut bacon and a Dolmio jar, with calories and macros per serve.',
  intro:
    '1kg of beef mince, 500g of Don shortcut bacon (half a 1kg pack) and one 500g jar of Dolmio pasta sauce. The serve count and the pasta per serve are placeholders until Thomas fixes them.',
  shared: [ingredient('Don shortcut bacon', '500g (half a 1kg pack)', 500, donShortCutBacon)],
  variants,
  servings: placeholderServings,
  servingLabel: `serve (PLACEHOLDER: ${placeholderServings} per batch)`,
  batchLabel: 'whole batch',
  method: [],
  notes: [
    'The default jar is Dolmio Extra Tomato, Onion and Roast Garlic. The other four 500g Dolmio jars are in the nutrition table as options.',
  ],
  sourceNotes: [
    'Mince and bacon are counted raw, so fat that stays in the pan is not taken off.',
    'The nutrition table lists the meat sauce alone first, then the same batch with the placeholder pasta.',
  ],
};
