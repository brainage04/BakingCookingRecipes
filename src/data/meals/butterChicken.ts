import { ingredient } from './ingredient';
import {
  chickenBreast,
  chickenThigh,
  spiceTailorClassicButterChicken,
  spiceTailorOriginalTikkaMasala,
  spiceTailorSpicyButterChicken,
  sunflowerOil,
  whiteRice,
} from './products';
import type { MealIngredient, MealProduct, MealRecipe, MealVariant } from './types';

/** Example batch cooked on 23 November 2026: 2 kits, 550mL of uncooked rice and 1.576kg of raw chicken breast. */
export const exampleBatch = { kits: 2, riceMillilitres: 550, chickenGrams: 1576, oilTablespoons: 2 } as const;

/**
 * Uncooked long grain white rice, 0.78g/mL: one US cup is 185g in 237mL, from USDA FoodData Central via
 * https://cookingcalculator.app/ingredients/white-rice. A cup packed a little tighter reaches about 0.85g/mL, which
 * would make the rice 468g and add about 140 kcal to the batch.
 */
export const riceGramsPerMillilitre = 0.78;

const kitGrams = 300;

const kits: readonly { key: string; title: string; product: MealProduct }[] = [
  { key: 'classic-butter-chicken', title: 'Classic Butter Chicken', product: spiceTailorClassicButterChicken },
  { key: 'spicy-butter-chicken', title: 'Spicy Butter Chicken', product: spiceTailorSpicyButterChicken },
  { key: 'original-tikka-masala', title: 'Original Tikka Masala', product: spiceTailorOriginalTikkaMasala },
];

const proteins: readonly { key: string; title: string; product: MealProduct }[] = [
  { key: 'breast', title: 'chicken breast', product: chickenBreast },
  { key: 'thigh', title: 'chicken thigh', product: chickenThigh },
];

function variantFor(kit: (typeof kits)[number], protein: (typeof proteins)[number]): MealVariant {
  const ingredients: MealIngredient[] = [
    ingredient(
      kit.title,
      `${exampleBatch.kits} kits (${exampleBatch.kits * kitGrams}g)`,
      exampleBatch.kits * kitGrams,
      kit.product,
    ),
    ingredient(`Raw ${protein.title}`, `${exampleBatch.chickenGrams}g`, exampleBatch.chickenGrams, protein.product),
  ];
  return { key: `${kit.key}-${protein.key}`, title: `${kit.title} with ${protein.title}`, ingredients };
}

export const butterChicken: MealRecipe = {
  slug: 'butter-chicken',
  navTitle: 'Butter chicken',
  cardTitle: 'Butter Chicken and Rice (The Spice Tailor)',
  pageTitle: 'Butter Chicken',
  description:
    'Meal-prep butter chicken and rice made with The Spice Tailor kits from Woolworths, with calories and macros per container.',
  intro:
    'Two The Spice Tailor kits, raw chicken and uncooked rice, cooked as one batch and split into 5 equal containers: one plate and 4 for meal prep. The weights are the batch cooked on 23 November 2026.',
  shared: [
    ingredient(
      'Uncooked white rice',
      `${exampleBatch.riceMillilitres}mL, measuring cup (about ${Math.round(exampleBatch.riceMillilitres * riceGramsPerMillilitre)}g)`,
      exampleBatch.riceMillilitres * riceGramsPerMillilitre,
      whiteRice,
      {
        assumption: `${riceGramsPerMillilitre}g per mL for uncooked long grain white rice (USDA FoodData Central, via cookingcalculator.app).`,
      },
    ),
  ],
  variants: kits
    .flatMap((kit) => proteins.map((protein) => variantFor(kit, protein)))
    .map((variant) => ({
      ...variant,
      extras: [
        {
          label: `${exampleBatch.oilTablespoons} tbsp sunflower oil (1 tbsp per kit, as the kit's step 1 says)`,
          ingredients: [
            ingredient(
              'Sunflower oil',
              `${exampleBatch.oilTablespoons} tbsp (${exampleBatch.oilTablespoons * 15}mL)`,
              exampleBatch.oilTablespoons * 15,
              sunflowerOil,
              {
                assumption: 'A tablespoon is 15mL, the serve size on the oil panel.',
              },
            ),
          ],
        },
      ],
    })),
  servings: 5,
  servingLabel: 'container (20% of the batch)',
  batchLabel: 'whole batch',
  method: [
    'Cut the chicken into generous pieces.',
    "Heat 1 tbsp of oil in a pan per kit, add the kit's spices and cook for 20 seconds.",
    'Add the chicken and brown lightly. Add the base sauce and simmer for 1 to 2 minutes.',
    'Stir in the main sauce and simmer for 3 to 5 minutes, or until the chicken is cooked through.',
    'Cook the rice. Split the chicken and sauce and the rice into 5 equal portions: one plate and 4 meal-prep containers.',
  ],
  notes: [
    "Kit method: The Spice Tailor's own page for the Classic Butter Chicken, https://au.thespicetailor.com/products/classic-butter-chicken/. The Spicy Butter Chicken and Original Tikka Masala kits use the same 3 steps.",
    "The kit does not fix the amount of chicken. The maker's recipe card uses 250g of chicken thigh per kit: https://au.thespicetailor.com/recipes/classic-butter-chicken-with-rice/. The batch above uses 1.576kg for 2 kits.",
    'Buy the kits at 40 to 50 percent off and keep 4 to 6 in the cupboard.',
    "The Spice Tailor's Australian range has no Spicy Tikka Masala: https://au.thespicetailor.com/products/. Only Classic Butter Chicken, Spicy Butter Chicken and Original Tikka Masala are sold.",
    'Woolworths calls the mild kit Classic Butter Chicken. The Original Butter Chicken made on 23 November is taken as that kit.',
  ],
  sourceNotes: [
    'Chicken is counted raw and rice uncooked, as the panels list them. Cooking adds water and does not change the totals.',
    'Butter or oil added at the pan is not counted unless a row says so.',
  ],
};
