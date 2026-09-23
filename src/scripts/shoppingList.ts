import type { AlternativeControl } from '../data/recipes';
import {
  calculateShoppingList,
  formatQuantity,
  normalizeBatchInput,
  type ShoppingBreakdown,
  type ShoppingCalculation,
  type ShoppingRecipe,
} from '../lib/calculations';
import { appendCell, productSummary } from './tableCells';

interface ShoppingData {
  recipes: readonly ShoppingRecipe[];
  alternativeControls: readonly AlternativeControl[];
}

const dataElement = document.getElementById('shopping-data');
if (!dataElement?.textContent) throw new Error('Missing shopping list data.');
const data = JSON.parse(dataElement.textContent) as ShoppingData;

const batchesBySlug: Record<string, number> = {};
for (const recipe of data.recipes) batchesBySlug[recipe.slug] = 1;
const alternatives: Record<string, boolean> = {};
for (const control of data.alternativeControls) alternatives[control.key] = control.defaultChecked;

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing shopping list element: ${id}`);
  return element as T;
}

const elements = {
  batchInputs: document.querySelectorAll<HTMLInputElement>('[data-recipe-batches]'),
  alternativeToggles: document.querySelectorAll<HTMLInputElement>('[data-alternative-key]'),
  shoppingRows: getElement<HTMLTableSectionElement>('shopping-rows'),
  usedCostOutput: getElement<HTMLOutputElement>('used-cost-output'),
  basketCostOutput: getElement<HTMLOutputElement>('basket-cost-output'),
  summary: getElement<HTMLElement>('shopping-summary-status'),
};

const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
const tableLabels = ['Woolworths item', 'Needed for recipes', 'Total needed', 'Packs to buy', 'Basket cost'];

function renderBreakdownCell(row: HTMLTableRowElement, breakdown: readonly ShoppingBreakdown[]): void {
  const list = document.createElement('ul');
  list.className = 'shopping-breakdown';
  for (const item of breakdown) {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.recipeTitle}: ${item.ingredientLabel} · ${formatQuantity(item.quantity, item.unit)}`;
    list.append(listItem);
  }
  appendCell(row, tableLabels, [list]);
}

function announce(calculation: ShoppingCalculation): void {
  const items = `${calculation.rows.length} ${calculation.rows.length === 1 ? 'item' : 'items'}`;
  elements.summary.textContent = `${items}, basket estimate ${currency.format(calculation.basketTotal)}.`;
}

function render(): ShoppingCalculation {
  const calculation = calculateShoppingList(data.recipes, batchesBySlug, alternatives);
  elements.shoppingRows.replaceChildren();

  for (const item of calculation.rows) {
    const row = document.createElement('tr');
    appendCell(row, tableLabels, [productSummary(item.product)]);
    renderBreakdownCell(row, item.breakdown);
    appendCell(row, tableLabels, formatQuantity(item.quantity, item.unit));
    appendCell(row, tableLabels, `${item.packageCount} x ${item.product.name}`);
    appendCell(row, tableLabels, currency.format(item.basketCost));
    elements.shoppingRows.append(row);
  }

  if (calculation.rows.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = tableLabels.length;
    cell.textContent = 'Enter at least one batch to generate a shopping list.';
    row.append(cell);
    elements.shoppingRows.append(row);
  }

  elements.usedCostOutput.textContent = currency.format(calculation.usedTotal);
  elements.basketCostOutput.textContent = currency.format(calculation.basketTotal);
  return calculation;
}

for (const input of elements.batchInputs) {
  input.addEventListener('input', () => {
    const slug = input.dataset.recipeBatches;
    if (slug) batchesBySlug[slug] = normalizeBatchInput(input.value);
    announce(render());
  });
}

for (const toggle of elements.alternativeToggles) {
  toggle.addEventListener('change', () => {
    const key = toggle.dataset.alternativeKey;
    if (key) alternatives[key] = toggle.checked;
    announce(render());
  });
}

render();
