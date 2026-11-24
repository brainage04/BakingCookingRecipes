import { ingredient } from './ingredient';
import { instantCoffee, skimMilk, stevia } from './products';
import type { MealRecipe } from './types';

export const icedCoffee: MealRecipe = {
  slug: 'iced-coffee',
  navTitle: 'Iced coffee',
  cardTitle: 'Protein Iced Coffee',
  pageTitle: 'Iced Coffee',
  description: 'Skim milk iced coffee, 750mL, with calories and macros from Australian nutrition panels.',
  intro: 'One 750mL glass of iced coffee made with skim milk and a sweetener.',
  shared: [
    ingredient('Skim milk', '500mL', 500, skimMilk),
    ingredient('Instant coffee', '2 to 3 tsp (about 4 to 6g)', 5, instantCoffee, {
      assumption: 'The middle of the 4 to 6g range.',
    }),
    ingredient('Stevia sweetener', '2 tbsp', 32, stevia, {
      assumption:
        'A teaspoon of this 1:1 sweetener is taken as 4g (the panel serve) and an Australian tablespoon as 4 teaspoons, so 1 tbsp is 16g.',
    }),
  ],
  variants: [{ key: 'iced-coffee', title: 'Iced coffee', ingredients: [] }],
  servings: 1,
  servingLabel: 'glass',
  batchLabel: '750mL glass',
  method: [
    'Dissolve the instant coffee and the stevia in 100mL of hot water.',
    'Add the milk.',
    'Add ice and/or cold water up to 750mL.',
  ],
  notes: ['Roughly 140 to 210mg of caffeine from 4 to 6g of instant coffee (from the original notes).'],
  sourceNotes: ['Ice and water are counted as zero energy and zero macros.'],
};
