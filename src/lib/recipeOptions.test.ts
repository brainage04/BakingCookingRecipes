import { describe, expect, it } from 'vitest';
import * as products from '../data/mealProducts';
import { recipes } from '../data/recipes';
import type { RecipePageData } from '../data/recipes';
import type { OptionState, ProductChoice } from '../data/types';
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
  it('defaults to extra lean mince and the Tomato, Onion and Roast Garlic jar, with no pasta', () => {
    expect(keysFor('spaghetti-bolognese')).toEqual(['mince-extra-lean', 'bacon', 'jar-tomato-onion-roast-garlic']);
    const sauceOnly = nutritionFor('spaghetti-bolognese');
    expect(sauceOnly.caloriesPerBatch).toBeCloseTo(2387.7, 0);
    expect(sauceOnly.macrosPerBatch.protein).toBeCloseTo(299, 0);
  });

  it('adds 6 serves of the pasta amount per serve when one is entered', () => {
    expect(gramsFor('spaghetti-bolognese', 'spaghetti', { pastaGrams: 80 })).toBe(480);
    expect(gramsFor('spaghetti-bolognese', 'spaghetti', { pastaGrams: 100 })).toBe(600);
  });

  it('marks the Tomato, Onion and Roast Garlic jar as the usual one', () => {
    const jar = recipeFor('spaghetti-bolognese').options?.find((option) => option.key === 'jar');
    const usual = jar?.kind === 'choice' ? jar.choices.filter((choice) => choice.label.includes('(usual jar)')) : [];
    expect(usual.map((choice) => choice.value)).toEqual(['tomato-onion-roast-garlic']);
    expect(jar?.kind === 'choice' ? jar.defaultValue : '').toBe('tomato-onion-roast-garlic');
  });

  it('offers both mince grades and all five Dolmio jars', () => {
    const jar = recipeFor('spaghetti-bolognese').options?.find((option) => option.key === 'jar');
    expect(jar?.kind === 'choice' ? jar.choices : []).toHaveLength(5);
    const mince = recipeFor('spaghetti-bolognese').options?.find((option) => option.key === 'mince');
    expect(mince?.kind === 'choice' ? mince.choices : []).toHaveLength(2);
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
    ]) {
      expect(ids).toContain(id);
    }
    expect(ids).not.toContain('919594');
    expect(ids).not.toContain('43974');
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

interface Amount {
  product: ProductChoice;
  grams: number;
}

/** kcal and macros of amounts of products, straight from each product's panel fields. */
function panelTotals(amounts: readonly Amount[]) {
  const totals = { kcal: 0, protein: 0, carbohydrates: 0, fat: 0 };
  for (const { product, grams } of amounts) {
    totals.kcal += ((product.kcalPer100g ?? 0) * grams) / 100;
    totals.protein += ((product.macrosPer100g?.protein ?? 0) * grams) / 100;
    totals.carbohydrates += ((product.macrosPer100g?.carbohydrates ?? 0) * grams) / 100;
    totals.fat += ((product.macrosPer100g?.fat ?? 0) * grams) / 100;
  }
  return totals;
}

function expectBatch(slug: string, state: OptionState, amounts: readonly Amount[]) {
  const expected = panelTotals(amounts);
  const actual = nutritionFor(slug, state);
  expect(actual.caloriesPerBatch).toBeCloseTo(expected.kcal, 6);
  expect(actual.macrosPerBatch.protein).toBeCloseTo(expected.protein, 6);
  expect(actual.macrosPerBatch.carbohydrates).toBeCloseTo(expected.carbohydrates, 6);
  expect(actual.macrosPerBatch.fat).toBeCloseTo(expected.fat, 6);
}

describe('every option branch matches the panel arithmetic', () => {
  const iceCreamBase: Amount[] = [
    { product: products.skimMilk, grams: 300 },
    { product: products.stevia, grams: 16 },
    { product: products.pb2, grams: 13 },
  ];
  const custard: Amount = { product: products.custardCasein, grams: 40 };
  const pudding: Amount = { product: products.cotteesVanillaPudding, grams: 10 };

  it('ice cream: the default, the Daily Shake, xanthan, no thickener and PB2 at 3 tbsp', () => {
    expectBatch('protein-ice-cream', {}, [...iceCreamBase, pudding, custard]);
    expectBatch('protein-ice-cream', { protein: 'shake' }, [
      ...iceCreamBase,
      pudding,
      { product: products.dailyShakeVanilla, grams: 30 },
    ]);
    expectBatch('protein-ice-cream', { thickener: 'xanthan' }, [
      ...iceCreamBase,
      { product: products.xanthanGum, grams: 0.75 },
      custard,
    ]);
    expectBatch('protein-ice-cream', { thickener: 'none' }, [...iceCreamBase, custard]);
    expectBatch('protein-ice-cream', { pb2Tbsp: 3 }, [
      ...iceCreamBase.slice(0, 2),
      { product: products.pb2, grams: 19.5 },
      pudding,
      custard,
    ]);
  });

  it('ice cream: strawberries and banana add 150g each', () => {
    const base = [...iceCreamBase, pudding, custard];
    expectBatch('protein-ice-cream', { strawberries: true }, [...base, { product: products.strawberries, grams: 150 }]);
    expectBatch('protein-ice-cream', { banana: true }, [...base, { product: products.banana, grams: 150 }]);
  });

  const kitGrams = 600;
  const chickenGrams = 1576;
  const rice: Amount = { product: products.whiteRice, grams: 550 * 0.78 };

  it('butter chicken: each kit, each chicken cut and the oil', () => {
    const kits = {
      classic: products.spiceTailorClassicButterChicken,
      spicy: products.spiceTailorSpicyButterChicken,
      tikka: products.spiceTailorOriginalTikkaMasala,
    };
    for (const [kit, product] of Object.entries(kits)) {
      expectBatch('butter-chicken', { kit }, [
        { product, grams: kitGrams },
        { product: products.chickenBreast, grams: chickenGrams },
        rice,
      ]);
    }
    expectBatch('butter-chicken', { chicken: 'thigh' }, [
      { product: products.spiceTailorClassicButterChicken, grams: kitGrams },
      { product: products.chickenThigh, grams: chickenGrams },
      rice,
    ]);
    const withOil = nutritionFor('butter-chicken', { oil: true });
    const without = nutritionFor('butter-chicken');
    expect(withOil.caloriesPerBatch - without.caloriesPerBatch).toBeCloseTo((30 * 3390) / 100 / 4.184, 3);
  });

  it('bolognese: lean mince, every jar and the pasta', () => {
    const bacon: Amount = { product: products.donShortCutBacon, grams: 500 };
    const jars = {
      'tomato-onion-roast-garlic': products.dolmioTomatoOnionRoastGarlic,
      'extra-bolognese': products.dolmioExtraBolognese,
      'classic-tomato-basil': products.dolmioClassicTomatoBasil,
      'traditional-classic-tomato': products.dolmioTraditionalClassicTomato,
      'salt-reduced': products.dolmioSaltReduced,
    };
    for (const [jar, product] of Object.entries(jars)) {
      expectBatch('spaghetti-bolognese', { jar }, [
        { product: products.beefMinceExtraLean, grams: 1000 },
        bacon,
        { product, grams: 500 },
      ]);
    }
    expectBatch('spaghetti-bolognese', { mince: 'lean' }, [
      { product: products.beefMinceLean, grams: 1000 },
      bacon,
      { product: products.dolmioTomatoOnionRoastGarlic, grams: 500 },
    ]);
    expectBatch('spaghetti-bolognese', { pastaGrams: 80 }, [
      { product: products.beefMinceExtraLean, grams: 1000 },
      bacon,
      { product: products.dolmioTomatoOnionRoastGarlic, grams: 500 },
      { product: products.spaghetti, grams: 480 },
    ]);
  });

  it('iced coffee: the defaults', () => {
    expectBatch('iced-coffee', {}, [
      { product: products.skimMilk, grams: 600 },
      { product: products.instantCoffee, grams: 6 },
      { product: products.stevia, grams: 12 },
    ]);
  });
});

describe('recipe pages', () => {
  it('have unique slugs and a Woolworths or maker link on every product', () => {
    expect(new Set(recipes.map((recipe) => recipe.slug)).size).toBe(recipes.length);
    for (const recipe of recipes.filter((candidate) => candidate.group === 'meals')) {
      for (const ingredient of recipe.ingredients) {
        for (const product of Object.values(ingredient.products)) {
          expect(product.url).toMatch(/^https:\/\/(www\.woolworths\.com\.au|au\.thespicetailor\.com)\//);
        }
        expect(ingredient.metricQuantity).toBeGreaterThan(0);
      }
    }
  });

  it('offers no Spicy Tikka Masala kit', () => {
    const kit = recipeFor('butter-chicken').options?.find((option) => option.key === 'kit');
    const labels = kit?.kind === 'choice' ? kit.choices.map((choice) => choice.label) : [];
    expect(labels).toHaveLength(3);
    expect(labels.some((label) => /spicy tikka/i.test(label))).toBe(false);
  });

  it('writes the pudding amount with its spoon size', () => {
    const pudding = recipeFor('protein-ice-cream').ingredients.find((item) => item.key === 'pudding');
    expect(pudding?.sourceAmount).toBe('10g (about 2 tsp)');
  });

  it('keeps the Scoop step before Lite Ice Cream and the Ninja re-spin, Lite and pudding notes', () => {
    const recipe = recipeFor('protein-ice-cream');
    expect(recipe.sourceInstructions.some((step) => step.includes('select Scoop, then Lite Ice Cream'))).toBe(true);
    const notes = (recipe.notes ?? []).join('\n');
    expect(notes).toContain('not to re-spin if you will also use the Mix-In program, because running both can over-process');
    expect(notes).toContain('Lite Ice Cream program is the one Ninja names for recipes made with sugar substitutes');
    expect(notes).toContain('1 tbsp of any instant pudding mix in place of xanthan gum');
  });
});
