import { describe, expect, it } from 'vitest';
import type { IngredientChoice, ProductChoice } from '../data/recipe';
import type { AlternativeControl } from '../data/recipes';
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
});
