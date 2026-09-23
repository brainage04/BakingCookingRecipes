import { describe, expect, it } from 'vitest';
import type { IngredientChoice, ProductChoice } from '../data/types';
import { ingredients as cookieIngredients } from '../data/cookies';
import { recipes, type AlternativeControl } from '../data/recipes';
import {
  calculateRecipe,
  calculateShoppingList,
  caloriesForBatch,
  formatQuantity,
  macrosForBatch,
  normalizeBatchInput,
} from './calculations';

const standardProduct: ProductChoice = {
  id: 'standard',
  name: 'Standard sugar',
  packageQuantity: 100,
  packageUnit: 'g',
  priceAud: 2,
  unitPriceLabel: '$2 / 100g',
  url: 'https://example.com/standard',
  source: 'Test fixture',
  kcalPer100g: 400,
  macrosPer100g: { protein: 0, carbohydrates: 100, fat: 0 },
};

const alternativeProduct: ProductChoice = {
  ...standardProduct,
  id: 'stevia',
  name: 'Stevia replacement',
  priceAud: 6,
  kcalPer100g: 20,
  macrosPer100g: { protein: 1, carbohydrates: 4, fat: 0 },
};

const ingredient: IngredientChoice = {
  key: 'sugar',
  label: 'Sugar',
  sourceAmount: '50g',
  metricQuantity: 50,
  metricUnit: 'g',
  costQuantity: 50,
  costUnit: 'g',
  batchGrams: 50,
  products: { default: standardProduct, stevia: alternativeProduct },
};

const vanillaIngredient: IngredientChoice = {
  ...ingredient,
  key: 'vanilla',
  label: 'Vanilla extract',
  metricQuantity: 10,
  metricUnit: 'ml',
  costQuantity: 10,
  costUnit: 'ml',
  batchGrams: 8.4,
  products: {
    default: {
      ...standardProduct,
      id: 'vanilla',
      name: 'Vanilla extract',
      packageQuantity: 50,
      packageUnit: 'ml',
      kcalPer100g: 288,
      macrosPer100g: null,
    },
  },
};

const controls = [
  {
    key: 'stevia',
    productKey: 'stevia',
    label: 'Use stevia',
    defaultChecked: false,
  },
] as const satisfies readonly AlternativeControl[];

describe('recipe calculations', () => {
  it('normalizes invalid and negative batch input without rejecting decimals', () => {
    expect(normalizeBatchInput('1.5')).toBe(1.5);
    expect(normalizeBatchInput('-2')).toBe(0);
    expect(normalizeBatchInput('not a number')).toBe(0);
  });

  it('uses selected alternatives for quantities, nutrition, and both cost models', () => {
    const result = calculateRecipe([ingredient], controls, { stevia: true }, 2, 4);

    expect(result.rows[0]?.product).toBe(alternativeProduct);
    expect(result.rows[0]?.scaledMetric).toBe(100);
    expect(result.usedTotal).toBe(6);
    expect(result.basketTotal).toBe(6);
    expect(result.caloriesPerBatch).toBe(10);
    expect(result.caloriesPerServing).toBe(2.5);
  });

  it('uses converted grams, not millilitres, for millilitre ingredient nutrition and mass', () => {
    const result = calculateRecipe([vanillaIngredient], [], {}, 1, 16);

    expect(result.caloriesPerBatch).toBeCloseTo(24.192);
    expect(result.caloriesPerServing).toBeCloseTo(1.512);
    expect(result.macrosPerBatch).toEqual({ protein: 0, carbohydrates: 0, fat: 0 });
    expect(result.massGrams).toBeCloseTo(8.4);
  });

  it('buys a whole egg for the cookie egg yolk and shares the egg carton', () => {
    const cookies = recipes.find(({ slug }) => slug === 'cookies');
    if (!cookies) throw new Error('Missing cookie recipe.');
    const shopping = (batches: number) =>
      calculateShoppingList(
        [{ slug: 'cookies', title: 'Cookies', ingredients: cookies.ingredients, alternativeControls: [] }],
        { cookies: batches },
        {},
      ).rows.find(({ unit }) => unit === 'egg');

    expect(shopping(7)).toMatchObject({ quantity: 14, packageCount: 2, basketCost: 10 });
    expect(shopping(6)).toMatchObject({ quantity: 12, packageCount: 1, basketCost: 5 });

    const eggRows = (batches: number) =>
      calculateRecipe(cookies.ingredients, [], {}, batches, cookies.servingsPerBatch).rows.filter(
        ({ ingredient }) => ingredient.costUnit === 'egg',
      );
    expect(eggRows(7).map(({ basket }) => basket)).toEqual([
      { packageCount: 2, cost: 10 },
      { sharedWith: 'Large egg' },
    ]);
    expect(eggRows(4)[0]?.basket).toEqual({ packageCount: 1, cost: 5 });
  });

  it('uses raw egg yolk nutrition for the cookie egg yolk', () => {
    const yolk = cookieIngredients.find(({ key }) => key === 'egg-yolk');
    if (!yolk) throw new Error('Missing cookie egg yolk.');

    expect(caloriesForBatch(yolk, yolk.products.default)).toBeCloseTo(54.74);
    const macros = macrosForBatch(yolk, yolk.products.default);
    expect(macros.protein).toBeCloseTo(2.6962);
    expect(macros.carbohydrates).toBeCloseTo(0.6103);
    expect(macros.fat).toBeCloseTo(4.5118);
  });

  it('combines matching products before rounding up packages', () => {
    const result = calculateShoppingList(
      [
        { slug: 'one', title: 'One', ingredients: [ingredient], alternativeControls: controls },
        { slug: 'two', title: 'Two', ingredients: [ingredient], alternativeControls: controls },
      ],
      { one: 1.2, two: 1 },
      { stevia: false },
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.quantity).toBe(110);
    expect(result.rows[0]?.packageCount).toBe(2);
    expect(result.basketTotal).toBe(4);
    expect(result.usedTotal).toBeCloseTo(2.2);
  });

  it('formats ingredient units and egg plurals for display', () => {
    expect(formatQuantity(1.25, 'g')).toBe('1.3g');
    expect(formatQuantity(1, 'egg')).toBe('1 egg');
    expect(formatQuantity(2, 'egg')).toBe('2 eggs');
    expect(formatQuantity(1, 'yolk')).toBe('1 yolk');
    expect(formatQuantity(3, 'yolk')).toBe('3 yolks');
  });

  it('keeps configured recipe data and calculated totals valid', () => {
    const alternatives = Object.fromEntries(
      recipes.flatMap((recipe) => recipe.alternativeControls.map((control) => [control.key, control.defaultChecked])),
    );

    for (const recipe of recipes) {
      expect(recipe.servingsPerBatch).toBeGreaterThan(0);
      expect(new Set(recipe.ingredients.map(({ key }) => key)).size).toBe(recipe.ingredients.length);

      for (const ingredient of recipe.ingredients) {
        expect(ingredient.metricQuantity).toBeGreaterThanOrEqual(0);
        expect(ingredient.costQuantity).toBeGreaterThanOrEqual(0);
        expect(ingredient.batchGrams).toBeGreaterThanOrEqual(0);

        for (const product of Object.values(ingredient.products)) {
          if (!product) continue;
          expect(product.packageQuantity).toBeGreaterThan(0);
          expect(product.priceAud).toBeGreaterThanOrEqual(0);
          if (product.kcalPer100g !== null) expect(product.kcalPer100g).toBeGreaterThanOrEqual(0);
          if (product.macrosPer100g) {
            for (const macro of Object.values(product.macrosPer100g)) {
              expect(macro).toBeGreaterThanOrEqual(0);
            }
          }
        }
      }

      const result = calculateRecipe(
        recipe.ingredients,
        recipe.alternativeControls,
        alternatives,
        1,
        recipe.servingsPerBatch,
      );
      for (const value of [
        result.servings,
        result.massGrams,
        result.caloriesPerBatch,
        result.caloriesPerServing,
        result.usedTotal,
        result.basketTotal,
        ...Object.values(result.macrosPerBatch),
        ...Object.values(result.macrosPerServing),
      ]) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
      }
    }

    const shoppingList = calculateShoppingList(
      recipes.map((recipe) => ({
        slug: recipe.slug,
        title: recipe.cardTitle,
        ingredients: recipe.ingredients,
        alternativeControls: recipe.alternativeControls,
      })),
      Object.fromEntries(recipes.map(({ slug }) => [slug, 1])),
      alternatives,
    );
    expect(shoppingList.rows.length).toBeGreaterThan(0);
    expect(Number.isFinite(shoppingList.usedTotal)).toBe(true);
    expect(Number.isFinite(shoppingList.basketTotal)).toBe(true);
    for (const row of shoppingList.rows) {
      expect(row.packageCount).toBeGreaterThan(0);
      expect(Number.isFinite(row.basketCost)).toBe(true);
    }
  });
});
