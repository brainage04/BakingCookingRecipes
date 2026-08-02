import type { AlternativeControl } from '../data/recipes';
import type { IngredientChoice, MacroBreakdown, ProductChoice } from '../data/recipe';
import { calculateRecipe, formatQuantity, normalizeBatchInput } from '../lib/calculations';

interface CalculatorData {
  ingredients: readonly IngredientChoice[];
  alternativeControls: readonly AlternativeControl[];
  servingsPerBatch: number;
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

function renderCell(row: HTMLTableRowElement, text: string): void {
  const cell = document.createElement('td');
  cell.dataset.label = tableLabels[row.children.length] ?? '';
  cell.textContent = text;
  row.append(cell);
}

function renderProductCell(row: HTMLTableRowElement, product: ProductChoice): void {
  const cell = document.createElement('td');
  cell.dataset.label = tableLabels[row.children.length] ?? '';

  const link = document.createElement('a');
  link.href = product.url;
  link.textContent = product.name;
  link.target = '_blank';
  link.rel = 'noreferrer';

  const meta = document.createElement('div');
  meta.className = 'muted';
  meta.textContent = `${product.unitPriceLabel} · product ${product.id}`;
  cell.append(link, meta);

  if (product.nutritionNote) {
    const note = document.createElement('small');
    note.className = 'muted';
    note.textContent = product.nutritionNote;
    cell.append(document.createElement('br'), note);
  }
  row.append(cell);
}

function render(): void {
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
    renderCell(row, item.ingredient.label);
    renderCell(row, item.ingredient.sourceAmount);
    renderCell(row, formatQuantity(item.scaledMetric, item.ingredient.metricUnit));
    renderProductCell(row, item.product);
    renderCell(row, currency.format(item.scaledCost));
    renderCell(row, `${item.basket.packageCount} x ${item.product.name} · ${currency.format(item.basket.cost)}`);
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
}

elements.batchInput.addEventListener('input', () => {
  batches = normalizeBatchInput(elements.batchInput.value);
  render();
});

for (const toggle of elements.alternativeToggles) {
  toggle.addEventListener('change', () => {
    const key = toggle.dataset.alternativeKey;
    if (key) alternatives[key] = toggle.checked;
    render();
  });
}

render();
