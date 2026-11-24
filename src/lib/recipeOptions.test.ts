import { describe, expect, it } from 'vitest';
import { recipes } from '../data/recipes';
import type { OptionState, RecipePageData } from '../data/recipes';
import { calculateRecipe, calculateShoppingList, optionDefaults, resolveIngredients } from './calculations';
import { noteParts } from './noteParts';

function recipeFor(slug: string): RecipePageData {
  const recipe = recipes.find((candidate) => candidate.slug === slug);
  if (!recipe) throw new Error(`No recipe ${slug}`);
  return recipe;
}

function keysFor(slug: string, state: OptionState = {}): string[] {
  const recipe = recipeFor(slug);
  const merged = { ...optionDefaults(recipe.options), ...state };
  return resolveIngredients(recipe.ingredients, recipe.options, merged).map((ingredient) => ingredient.key);
}

function gramsFor(slug: string, key: string, state: OptionState = {}): number | undefined {
  const recipe = recipeFor(slug);
  const merged = { ...optionDefaults(recipe.options), ...state };
  return resolveIngredients(recipe.ingredients, recipe.options, merged).find((row) => row.key === key)?.metricQuantity;
}

function nutritionFor(slug: string, state: OptionState = {}) {
  const recipe = recipeFor(slug);
  const merged = { ...optionDefaults(recipe.options), ...state };
  return calculateRecipe(
    resolveIngredients(recipe.ingredients, recipe.options, merged),
    recipe.alternativeControls,
    {},
    1,
    recipe.servingsPerBatch,
  );
}

describe('protein ice cream options', () => {
  it('defaults to the custard protein, pudding mix, 2 tbsp PB2 and no fruit', () => {
    const state = optionDefaults(recipeFor('protein-ice-cream').options);
    expect(state).toEqual({ pb2Tbsp: 2, thickener: 'pudding', protein: 'custard', strawberries: false, banana: false });
    expect(keysFor('protein-ice-cream')).toEqual(['milk', 'stevia', 'pb2', 'pudding', 'custard']);
    expect(gramsFor('protein-ice-cream', 'pb2')).toBe(13);
  });

  it('always has exactly one protein powder, never both and never neither', () => {
    for (const protein of ['custard', 'shake']) {
      const keys = keysFor('protein-ice-cream', { protein });
      expect(keys.filter((key) => key === 'custard' || key === 'shake')).toEqual([protein]);
    }
    const proteinOption = recipeFor('protein-ice-cream').options?.find((option) => option.key === 'protein');
    expect(proteinOption?.kind).toBe('choice');
    if (proteinOption?.kind === 'choice') {
      expect(proteinOption.control).toBe('radio');
      expect(proteinOption.choices.map((choice) => choice.value)).toEqual(['custard', 'shake']);
    }
  });

  it('uses the pudding mix or xanthan gum or neither, never both', () => {
    const thickeners = (thickener: string) =>
      keysFor('protein-ice-cream', { thickener }).filter((key) => key === 'pudding' || key === 'xanthan');
    expect(thickeners('pudding')).toEqual(['pudding']);
    expect(thickeners('xanthan')).toEqual(['xanthan']);
    expect(thickeners('none')).toEqual([]);
    expect(gramsFor('protein-ice-cream', 'xanthan', { thickener: 'xanthan' })).toBeCloseTo(0.75, 5);
  });

  it('scales PB2 by the tbsp amount and drops it at 0', () => {
    expect(gramsFor('protein-ice-cream', 'pb2', { pb2Tbsp: 3 })).toBeCloseTo(19.5, 5);
    expect(gramsFor('protein-ice-cream', 'pb2', { pb2Tbsp: 0.5 })).toBeCloseTo(3.25, 5);
    expect(keysFor('protein-ice-cream', { pb2Tbsp: 0 })).not.toContain('pb2');
  });

  it('adds the fruit only when its box is ticked', () => {
    expect(keysFor('protein-ice-cream', { strawberries: true })).toContain('strawberries');
    expect(keysFor('protein-ice-cream', { banana: true })).toContain('banana');
    expect(keysFor('protein-ice-cream')).not.toContain('strawberries');
    expect(keysFor('protein-ice-cream')).not.toContain('banana');
  });

  it('moves the nutrition with the selection', () => {
    const base = nutritionFor('protein-ice-cream');
    expect(base.caloriesPerBatch).toBeCloseTo(374.5 - 82.0 * (1 / 3), 0);
    expect(base.macrosPerBatch.protein).toBeCloseTo(43.83 - (19.5 - 13) * 0.44, 1);
    const shake = nutritionFor('protein-ice-cream', { protein: 'shake' });
    expect(shake.caloriesPerBatch).toBeLessThan(base.caloriesPerBatch);
    expect(nutritionFor('protein-ice-cream', { pb2Tbsp: 0 }).caloriesPerBatch).toBeLessThan(base.caloriesPerBatch);
    expect(base.caloriesPerServing).toBeCloseTo(base.caloriesPerBatch / 2, 5);
  });
});

describe('iced coffee options', () => {
  it('defaults to 600mL milk, 3 tsp coffee and 3 tsp stevia, and every amount scales', () => {
    expect(optionDefaults(recipeFor('iced-coffee').options)).toEqual({ milkMl: 600, coffeeTsp: 3, steviaTsp: 3 });
    expect(gramsFor('iced-coffee', 'milk')).toBe(600);
    expect(gramsFor('iced-coffee', 'coffee')).toBe(6);
    expect(gramsFor('iced-coffee', 'stevia')).toBe(12);
    expect(gramsFor('iced-coffee', 'milk', { milkMl: 500 })).toBe(500);
  });

  it('counts 600mL of skim milk from its per-100mL panel', () => {
    const coffee = nutritionFor('iced-coffee', { coffeeTsp: 0, steviaTsp: 0 });
    expect(coffee.caloriesPerBatch).toBeCloseTo((600 * 150) / 100 / 4.184, 3);
    expect(coffee.macrosPerBatch.protein).toBeCloseTo(21.6, 5);
  });

  it('scales every amount, the cost and the serve count together with the batch count', () => {
    const recipe = recipeFor('iced-coffee');
    const rows = resolveIngredients(recipe.ingredients, recipe.options);
    const one = calculateRecipe(rows, [], {}, 1, 1);
    const two = calculateRecipe(rows, [], {}, 2, 1);
    expect(two.rows.map((row) => row.scaledMetric)).toEqual(one.rows.map((row) => row.scaledMetric * 2));
    expect(two.usedTotal).toBeCloseTo(one.usedTotal * 2, 8);
    expect(two.servings).toBe(2);
    expect(two.caloriesPerServing).toBeCloseTo(one.caloriesPerServing, 8);
  });
});

describe('butter chicken options', () => {
  it("defaults to Thomas's 23 November batch: 2 Classic kits, 1.576kg breast, rice, no oil", () => {
    expect(keysFor('butter-chicken')).toEqual(['kit-classic', 'chicken-breast', 'rice']);
    expect(gramsFor('butter-chicken', 'kit-classic')).toBe(600);
    expect(gramsFor('butter-chicken', 'chicken-breast')).toBe(1576);
    expect(gramsFor('butter-chicken', 'rice')).toBeCloseTo(429, 5);
    const container = nutritionFor('butter-chicken');
    expect(container.caloriesPerServing).toBeCloseTo(780.6, 0);
    expect(container.macrosPerServing.protein).toBeCloseTo(81.1, 1);
  });

  it('has exactly one kit and one chicken cut at a time, and oil only when ticked', () => {
    for (const kit of ['classic', 'spicy', 'tikka']) {
      expect(keysFor('butter-chicken', { kit }).filter((key) => key.startsWith('kit-'))).toEqual([`kit-${kit}`]);
    }
    for (const chicken of ['breast', 'thigh']) {
      expect(keysFor('butter-chicken', { chicken }).filter((key) => key.startsWith('chicken-'))).toEqual([
        `chicken-${chicken}`,
      ]);
    }
    expect(keysFor('butter-chicken')).not.toContain('oil');
    expect(keysFor('butter-chicken', { oil: true })).toContain('oil');
  });
});

describe('spaghetti bolognese options', () => {
  it('defaults to extra lean mince and the Tomato, Onion and Roast Garlic jar', () => {
    expect(keysFor('spaghetti-bolognese')).toEqual([
      'mince-extra-lean',
      'bacon',
      'jar-tomato-onion-roast-garlic',
      'spaghetti',
    ]);
    expect(gramsFor('spaghetti-bolognese', 'spaghetti')).toBe(480);
  });

  it('takes one jar at a time and drops the pasta at 0', () => {
    for (const jar of recipeFor('spaghetti-bolognese').options?.flatMap((option) =>
      option.kind === 'choice' && option.key === 'jar' ? option.choices.map((choice) => choice.value) : [],
    ) ?? []) {
      expect(keysFor('spaghetti-bolognese', { jar }).filter((key) => key.startsWith('jar-'))).toEqual([`jar-${jar}`]);
    }
    expect(keysFor('spaghetti-bolognese', { pastaGrams: 0 })).not.toContain('spaghetti');
    expect(keysFor('spaghetti-bolognese', { mince: 'lean' })).toContain('mince-lean');
  });
});

describe('shopping list with meals', () => {
  const shoppingRecipes = recipes.map((recipe) => ({
    slug: recipe.slug,
    title: recipe.cardTitle,
    ingredients: recipe.ingredients,
    alternativeControls: recipe.alternativeControls,
    options: recipe.options,
  }));
  const meals = recipes.filter((recipe) => recipe.group === 'meals').map((recipe) => recipe.slug);
  const onlyMeals = Object.fromEntries(recipes.map((recipe) => [recipe.slug, meals.includes(recipe.slug) ? 1 : 0]));

  it('lists the default ingredients of all four meals', () => {
    const list = calculateShoppingList(shoppingRecipes, onlyMeals, {});
    const ids = list.rows.map((row) => row.product.id);
    for (const id of [
      '51379',
      '117715',
      '137364',
      '79369',
      '199136',
      '452266',
      '969723',
      '36493',
      '577860',
      '220824',
      '758342',
      '43974',
    ]) {
      expect(ids).toContain(id);
    }
    expect(ids).not.toContain('919594');
    expect(list.rows.every((row) => row.packageCount > 0)).toBe(true);
  });

  it("follows each recipe's option state", () => {
    const list = calculateShoppingList(
      shoppingRecipes,
      onlyMeals,
      {},
      { 'protein-ice-cream': { ...optionDefaults(recipeFor('protein-ice-cream').options), protein: 'shake' } },
    );
    const ids = list.rows.map((row) => row.product.id);
    expect(ids).toContain('919594');
    expect(ids).not.toContain('79369');
  });
});

describe('notes links', () => {
  it('turns a bare URL into a link and leaves trailing punctuation as text', () => {
    expect(noteParts('See https://example.com/a-b. Then go.')).toEqual([
      { text: 'See ' },
      { text: 'https://example.com/a-b', href: 'https://example.com/a-b' },
      { text: '. Then go.' },
    ]);
  });
});
