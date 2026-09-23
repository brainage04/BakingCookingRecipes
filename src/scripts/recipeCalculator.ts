import type { AlternativeControl } from '../data/recipes';
import type { IngredientChoice, MacroBreakdown, ProductChoice } from '../data/types';
import {
  calculateRecipe,
  formatQuantity,
  normalizeBatchInput,
  type IngredientCalculation,
  type RecipeCalculation,
} from '../lib/calculations';
import { appendCell, productSummary } from './tableCells';

interface CalculatorData {
  ingredients: readonly IngredientChoice[];
  alternativeControls: readonly AlternativeControl[];
  servingsPerBatch: number;
  servingSingular: string;
  servingPlural: string;
}

const dataElement = document.getElementById('calculator-data');
if (!dataElement?.textContent) throw new Error('Missing recipe calculator data.');
const data = JSON.parse(dataElement.textContent) as CalculatorData;

const alternatives: Record<string, boolean> = {};
for (const control of data.alternativeControls) alternatives[control.key] = control.defaultChecked;
let batches = 1;

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing calculator element: ${id}`);
  return element as T;
}

const elements = {
  batchInput: getElement<HTMLInputElement>('batch-input'),
  servingsOutput: getElement<HTMLOutputElement>('servings-output'),
  massOutput: getElement<HTMLOutputElement>('mass-output'),
  caloriesBatchOutput: getElement<HTMLOutputElement>('calories-batch-output'),
  caloriesServingOutput: getElement<HTMLOutputElement>('calories-serving-output'),
  macrosBatchOutput: getElement<HTMLOutputElement>('macros-batch-output'),
  macrosServingOutput: getElement<HTMLOutputElement>('macros-serving-output'),
  usedCostOutput: getElement<HTMLOutputElement>('used-cost-output'),
  basketCostOutput: getElement<HTMLOutputElement>('basket-cost-output'),
  ingredientRows: getElement<HTMLTableSectionElement>('ingredient-rows'),
  summary: getElement<HTMLElement>('calculator-summary'),
  alternativeToggles: document.querySelectorAll<HTMLInputElement>('[data-alternative-key]'),
};

const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
const number = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 });
const tableLabels = [
  'Ingredient',
  'Source amount',
  'Scaled amount',
  'Woolworths item',
  'Used cost',
  'Packs / basket cost',
];

function formatMacros(macros: MacroBreakdown): string {
  return `Protein ${number.format(macros.protein)}g\nCarbs ${number.format(macros.carbohydrates)}g\nFat ${number.format(macros.fat)}g`;
}

function renderProductCell(row: HTMLTableRowElement, product: ProductChoice): void {
  const summary = productSummary(product);
  if (product.nutritionNote) {
    const note = document.createElement('small');
    note.className = 'muted';
    note.textContent = product.nutritionNote;
    summary.append(document.createElement('br'), note);
  }
  appendCell(row, tableLabels, [summary]);
}

function basketText({ basket, product }: IngredientCalculation): string {
  if ('sharedWith' in basket) return `Included in ${basket.sharedWith} packs`;
  return `${basket.packageCount} x ${product.name} · ${currency.format(basket.cost)}`;
}

function announce(calculation: RecipeCalculation): void {
  const servings = `${number.format(calculation.servings)} ${calculation.servings === 1 ? data.servingSingular : data.servingPlural}`;
  elements.summary.textContent = `${number.format(batches)} ${batches === 1 ? 'batch' : 'batches'}: ${servings}, ${number.format(calculation.caloriesPerServing)} kcal per ${data.servingSingular}, basket estimate ${currency.format(calculation.basketTotal)}.`;
}

function render(): RecipeCalculation {
  const calculation = calculateRecipe(
    data.ingredients,
    data.alternativeControls,
    alternatives,
    batches,
    data.servingsPerBatch,
  );
  elements.ingredientRows.replaceChildren();

  for (const item of calculation.rows) {
    const row = document.createElement('tr');
    appendCell(row, tableLabels, item.ingredient.label);
    appendCell(row, tableLabels, item.ingredient.sourceAmount);
    appendCell(row, tableLabels, formatQuantity(item.scaledMetric, item.ingredient.metricUnit));
    renderProductCell(row, item.product);
    appendCell(row, tableLabels, currency.format(item.scaledCost));
    appendCell(row, tableLabels, basketText(item));
    elements.ingredientRows.append(row);
  }

  elements.servingsOutput.textContent = number.format(calculation.servings);
  elements.massOutput.textContent = `${number.format(calculation.massGrams)}g`;
  elements.caloriesBatchOutput.textContent = `${number.format(calculation.caloriesPerBatch)} kcal`;
  elements.caloriesServingOutput.textContent = `${number.format(calculation.caloriesPerServing)} kcal`;
  elements.macrosBatchOutput.textContent = formatMacros(calculation.macrosPerBatch);
  elements.macrosServingOutput.textContent = formatMacros(calculation.macrosPerServing);
  elements.usedCostOutput.textContent = currency.format(calculation.usedTotal);
  elements.basketCostOutput.textContent = currency.format(calculation.basketTotal);
  return calculation;
}

elements.batchInput.addEventListener('input', () => {
  batches = normalizeBatchInput(elements.batchInput.value);
  announce(render());
});

for (const toggle of elements.alternativeToggles) {
  toggle.addEventListener('change', () => {
    const key = toggle.dataset.alternativeKey;
    if (key) alternatives[key] = toggle.checked;
    announce(render());
  });
}

render();
