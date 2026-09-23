import type { ProductChoice } from '../data/types';

/** Appends a cell labelled with its column header, which the stacked mobile table shows beside the value. */
export function appendCell(
  row: HTMLTableRowElement,
  labels: readonly string[],
  content: string | readonly Node[],
): void {
  const cell = document.createElement('td');
  cell.dataset.label = labels[row.children.length] ?? '';
  if (typeof content === 'string') cell.textContent = content;
  else cell.append(...content);
  row.append(cell);
}

/** Product link (opens Woolworths in a new tab) followed by its unit price and product id. */
export function productSummary(product: ProductChoice): HTMLDivElement {
  const wrapper = document.createElement('div');

  const link = document.createElement('a');
  link.href = product.url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  const newTabCue = document.createElement('span');
  newTabCue.className = 'sr-only';
  newTabCue.textContent = ' (opens in new tab)';
  link.append(product.name, newTabCue);

  const meta = document.createElement('div');
  meta.className = 'muted';
  meta.textContent = `${product.unitPriceLabel} · product ${product.id}`;

  wrapper.append(link, meta);
  return wrapper;
}
