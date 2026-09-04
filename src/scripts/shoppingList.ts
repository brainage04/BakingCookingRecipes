import type { AlternativeControl } from '../data/recipes';
import type { ProductChoice } from '../data/types';
import {
  calculateShoppingList,
  formatQuantity,
  normalizeBatchInput,
  type ShoppingBreakdown,
  type ShoppingRecipe,
} from '../lib/calculations';

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
};

const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
const tableLabels = ['Woolworths item', 'Needed for recipes', 'Total needed', 'Packs to buy', 'Basket cost'];

function appendCell(row: HTMLTableRowElement, content: string | HTMLElement): void {
  const cell = document.createElement('td');
  cell.dataset.label = tableLabels[row.children.length] ?? '';
  if (typeof content === 'string') cell.textContent = content;
  else cell.append(content);
  row.append(cell);
}

function renderProductCell(row: HTMLTableRowElement, product: ProductChoice): void {
  const wrapper = document.createElement('div');
  const link = document.createElement('a');
  link.href = product.url;
  link.textContent = product.name;
  link.target = '_blank';
  link.rel = 'noreferrer';
  const meta = document.createElement('div');
  meta.className = 'muted';
  meta.textContent = `${product.unitPriceLabel} · product ${product.id}`;
  wrapper.append(link, meta);
  appendCell(row, wrapper);
}

function renderBreakdownCell(row: HTMLTableRowElement, breakdown: readonly ShoppingBreakdown[]): void {
  const list = document.createElement('ul');
  list.className = 'shopping-breakdown';
  for (const item of breakdown) {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.recipeTitle}: ${item.ingredientLabel} · ${formatQuantity(item.quantity, item.unit)}`;
    list.append(listItem);
  }
  appendCell(row, list);
}

function render(): void {
  const calculation = calculateShoppingList(data.recipes, batchesBySlug, alternatives);
  elements.shoppingRows.replaceChildren();

  for (const item of calculation.rows) {
    const row = document.createElement('tr');
    renderProductCell(row, item.product);
    renderBreakdownCell(row, item.breakdown);
    appendCell(row, formatQuantity(item.quantity, item.unit));
    appendCell(row, `${item.packageCount} x ${item.product.name}`);
    appendCell(row, currency.format(item.basketCost));
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
}

for (const input of elements.batchInputs) {
  input.addEventListener('input', () => {
    const slug = input.dataset.recipeBatches;
    if (slug) batchesBySlug[slug] = normalizeBatchInput(input.value);
    render();
  });
}

for (const toggle of elements.alternativeToggles) {
  toggle.addEventListener('change', () => {
    const key = toggle.dataset.alternativeKey;
    if (key) alternatives[key] = toggle.checked;
    render();
  });
}

render();
