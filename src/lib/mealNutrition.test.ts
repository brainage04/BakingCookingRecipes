import { describe, expect, it } from 'vitest';
import { bolognese } from '../data/meals/bolognese';
import { butterChicken, exampleBatch, riceGramsPerMillilitre } from '../data/meals/butterChicken';
import { icedCoffee } from '../data/meals/icedCoffee';
import { ingredient } from '../data/meals/ingredient';
import { meals } from '../data/meals';
import { proteinIceCream } from '../data/meals/proteinIceCream';
import { skimMilk } from '../data/meals/products';
import { ingredientNutrition, perServing, sumNutrition, variantBatch } from './mealNutrition';

function batchOf(recipe: (typeof meals)[number], key: string, extraIndex?: number) {
  const variant = recipe.variants.find((candidate) => candidate.key === key);
  if (!variant) throw new Error(`No variant ${key} in ${recipe.slug}`);
  const extra = extraIndex === undefined ? undefined : variant.extras?.[extraIndex];
  return variantBatch(recipe, variant, extra);
}

describe('ingredientNutrition', () => {
  it('scales a per-100mL panel to the amount used and converts kilojoules to kcal', () => {
    const milk = ingredientNutrition(ingredient('Milk', '300mL', 300, skimMilk));
    expect(milk.kcal).toBeCloseTo((150 * 3) / 4.184, 5);
    expect(milk.protein).toBeCloseTo(10.8, 5);
    expect(milk.carbohydrate).toBeCloseTo(15, 5);
    expect(milk.fat).toBeCloseTo(0.3, 5);
  });

  it('sums nothing to zero', () => {
    expect(sumNutrition([])).toEqual({ kcal: 0, protein: 0, carbohydrate: 0, fat: 0 });
  });
});

describe('protein ice cream', () => {
  it('matches the panel arithmetic for the Custard tub', () => {
    const custard = batchOf(proteinIceCream, 'custard');
    expect(custard.kcal).toBeCloseTo(374.5, 0);
    expect(custard.protein).toBeCloseTo(43.8, 1);
    const half = perServing(custard, proteinIceCream.servings);
    expect(half.kcal).toBeCloseTo(187.2, 0);
    expect(half.protein).toBeCloseTo(21.9, 1);
  });

  it('matches the panel arithmetic for the Vanilla tub and its strawberry option', () => {
    expect(batchOf(proteinIceCream, 'vanilla').kcal).toBeCloseTo(347.5, 0);
    expect(batchOf(proteinIceCream, 'vanilla').protein).toBeCloseTo(41.3, 1);
    expect(batchOf(proteinIceCream, 'vanilla', 0).kcal).toBeCloseTo(386.2, 0);
  });
});

describe('iced coffee', () => {
  it('is one serve of 500mL skim milk plus coffee and sweetener', () => {
    const coffee = batchOf(icedCoffee, 'iced-coffee');
    expect(coffee.kcal).toBeCloseTo(195.5, 0);
    expect(coffee.protein).toBeCloseTo(18.8, 1);
  });
});

describe('butter chicken', () => {
  it('uses the batch Thomas cooked on 23 November: 2 kits, 550mL rice and 1.576kg raw chicken breast', () => {
    expect(exampleBatch).toMatchObject({ kits: 2, riceMillilitres: 550, chickenGrams: 1576 });
    const rice = butterChicken.shared[0];
    expect(rice?.quantity).toBeCloseTo(550 * riceGramsPerMillilitre, 5);
    expect(butterChicken.servings).toBe(5);
  });

  it('gives one container of the Classic Butter Chicken with breast and rice', () => {
    const batch = batchOf(butterChicken, 'classic-butter-chicken-breast');
    const container = perServing(batch, butterChicken.servings);
    expect(container.kcal).toBeCloseTo(780.6, 0);
    expect(container.protein).toBeCloseTo(81.1, 1);
    expect(container.carbohydrate).toBeCloseTo(79.1, 1);
    expect(container.fat).toBeCloseTo(15.1, 1);
  });

  it('adds the kit oil as a separate row', () => {
    const withOil = batchOf(butterChicken, 'classic-butter-chicken-breast', 0);
    const without = batchOf(butterChicken, 'classic-butter-chicken-breast');
    expect(withOil.kcal - without.kcal).toBeCloseTo((30 * 3390) / 100 / 4.184, 3);
  });

  it('lists three kits with both chicken cuts and no Spicy Tikka Masala', () => {
    expect(butterChicken.variants).toHaveLength(6);
    expect(butterChicken.variants.some((variant) => /spicy tikka/i.test(variant.title))).toBe(false);
  });
});

describe('spaghetti bolognese', () => {
  it('keeps the placeholder pasta out of the base nutrition row', () => {
    const variant = bolognese.variants[0];
    expect(variant?.extras?.[0]?.ingredients.every((item) => item.placeholder)).toBe(true);
    const sauceOnly = batchOf(bolognese, 'extra-lean-tomato-onion-roast-garlic');
    expect(sauceOnly.kcal).toBeCloseTo(2387.7, 0);
    expect(sauceOnly.protein).toBeCloseTo(299, 0);
  });

  it('offers both mince grades and all five Dolmio jars', () => {
    expect(bolognese.variants).toHaveLength(10);
  });
});

describe('meal pages', () => {
  it('have unique slugs and a Woolworths or maker link on every ingredient', () => {
    expect(new Set(meals.map((meal) => meal.slug)).size).toBe(meals.length);
    for (const meal of meals) {
      const ingredients = [
        ...meal.shared,
        ...meal.variants.flatMap((variant) => [
          ...variant.ingredients,
          ...(variant.extras ?? []).flatMap((extra) => extra.ingredients),
        ]),
      ];
      for (const item of ingredients) {
        expect(item.product.url).toMatch(/^https:\/\/(www\.woolworths\.com\.au|au\.thespicetailor\.com)\//);
        expect(item.quantity).toBeGreaterThan(0);
      }
    }
  });
});
