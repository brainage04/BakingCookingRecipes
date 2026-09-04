import { describe, expect, it } from 'vitest';
import type { IngredientChoice, ProductChoice } from '../data/recipe';
import { recipes, type AlternativeControl } from '../data/recipes';
import { calculateRecipe, calculateShoppingList, formatQuantity, normalizeBatchInput } from './calculations';

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
  nutritionQuantity: 50,
  nutritionUnit: 'g',
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
  nutritionQuantity: 10,
  nutritionUnit: 'ml',
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

  it('includes the vanilla calorie estimate for millilitre-based ingredients', () => {
    const result = calculateRecipe([vanillaIngredient], [], {}, 1, 16);

    expect(result.caloriesPerBatch).toBeCloseTo(28.8);
    expect(result.caloriesPerServing).toBeCloseTo(1.8);
    expect(result.macrosPerBatch).toEqual({ protein: 0, carbohydrates: 0, fat: 0 });
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
        expect(ingredient.nutritionQuantity).toBeGreaterThanOrEqual(0);

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
