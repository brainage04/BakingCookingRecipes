import { ingredient } from './ingredient';
import {
  cotteesVanillaPudding,
  custardCasein,
  dailyShakeVanilla,
  pb2,
  skimMilk,
  stevia,
  strawberries,
} from './products';
import type { MealRecipe } from './types';

const steviaTablespoonAssumption =
  'A teaspoon of this 1:1 sweetener is taken as 4g (the panel serve) and an Australian tablespoon as 4 teaspoons, so 1 tbsp is 16g.';
const pb2TablespoonAssumption =
  'The panel serve is 13g, 2 tbsp is taken as 13g, so 1 tbsp is 6.5g and 3 tbsp is 19.5g.';

export const proteinIceCream: MealRecipe = {
  slug: 'protein-ice-cream',
  navTitle: 'Protein ice cream',
  cardTitle: 'Protein Ice Cream (Ninja Creami)',
  pageTitle: 'Protein Ice Cream',
  description:
    'High-protein Ninja Creami ice cream made with skim milk and Muscle Nation powder, with calories and macros from Australian nutrition panels.',
  intro:
    'One Ninja Swirl by CREAMi (NC701) tub of lite ice cream, in the two versions made on 23 November 2026. A serve is half a tub.',
  shared: [
    ingredient('Skim milk', '300mL', 300, skimMilk),
    ingredient('Stevia sweetener', '1 tbsp', 16, stevia, { assumption: steviaTablespoonAssumption }),
    ingredient('PB2 powdered peanut butter', '3 tbsp', 19.5, pb2, { assumption: pb2TablespoonAssumption }),
    ingredient("Cottee's instant vanilla pudding mix", '10g (about 2 tsp)', 10, cotteesVanillaPudding),
  ],
  variants: [
    {
      key: 'custard',
      title: 'Custard',
      ingredients: [ingredient('Muscle Nation Custard Casein', '2 scoops (40g)', 40, custardCasein)],
      extras: [
        {
          label: '150g mashed strawberries instead of the PB2 (untried)',
          replaces: [pb2.key],
          ingredients: [ingredient('Strawberries', '150g', 150, strawberries)],
        },
      ],
    },
    {
      key: 'vanilla',
      title: 'Vanilla soft serve',
      ingredients: [
        ingredient('Muscle Nation Protein Daily Shake, vanilla ice cream', '1 scoop (30g)', 30, dailyShakeVanilla),
      ],
      extras: [
        {
          label: '150g mashed strawberries instead of the PB2 (untried)',
          replaces: [pb2.key],
          ingredients: [ingredient('Strawberries', '150g', 150, strawberries)],
        },
      ],
    },
  ],
  servings: 2,
  servingLabel: 'half tub',
  batchLabel: 'whole tub',
  method: [
    'Put the milk, stevia, PB2 (or 150g of mashed strawberries instead), pudding mix and protein powder in an NC701 tub. Add water up to the MAX FILL line.',
    'Freeze the tub upright and level. Minimum 8 hours, best 16 hours or more.',
    'Select Scoop, then Lite Ice Cream.',
    'Re-spin only if it comes out crumbly or powdery: add 1 to 2 tbsp of milk and press Re-spin. The manual says very cold bases often need it.',
    'Mix-ins (optional): dig a hole down the middle, add the pieces and press Mix-In.',
  ],
  notes: [
    'Spare tubs (2-pack, $59.99, only Swirl tubs fit): https://sharkninja.com.au/products/ninja-swirl-by-creami-2-pack-tubs-and-lids',
    'Ninja Australia says the NC701 tub holds 473mL to the MAX FILL line, needs at least 24 hours in the freezer, and should not be re-spun before a mix-in: https://ninjakitchenapac.zendesk.com/hc/en-au/articles/15978391315471-NC701-Ninja-Swirl-by-CREAMi-FAQ',
    'The Lite Ice Cream program is the one Ninja names for recipes made with sugar substitutes (same FAQ).',
    'The same FAQ suggests 1 tbsp of any instant pudding mix in place of xanthan gum.',
  ],
  sourceNotes: [
    'This is the 23 November version: 3 tbsp PB2 and 10g of pudding mix go in both. The older notes had the PB2 optional (or 150g of mashed strawberries in its place) and the pudding mix in the Vanilla only.',
    'The older notes estimated Custard at about 250 kcal and 48g protein, Vanilla at about 255 kcal and 33g, and about 337 kcal and 44g with PB2. The panel figures above differ: by the panels Custard without PB2 is 35g protein, and 3 tbsp of PB2 adds 8.6g protein, not 11g.',
    'Water added up to the MAX FILL line is counted as zero energy and zero macros.',
    'The Muscle Nation Custard Casein panel is the Woolworths Vanilla flavour. Other flavours have their own panels.',
  ],
};
