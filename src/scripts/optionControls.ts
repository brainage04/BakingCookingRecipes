import type { OptionState, OptionValue, RecipeOption } from '../data/types';
import { optionDefaults } from '../lib/calculations';

function readValue(input: HTMLInputElement | HTMLSelectElement): OptionValue | undefined {
  const kind = input.dataset.optionKind;
  if (kind === 'toggle' && input instanceof HTMLInputElement) return input.checked;
  if (kind === 'choice') {
    if (input instanceof HTMLInputElement && input.type === 'radio' && !input.checked) return undefined;
    return input.value;
  }
  if (kind === 'amount') {
    const amount = Number.parseFloat(input.value);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }
  return undefined;
}

/**
 * Starts from each option's default, then keeps the state in step with the controls inside `root`.
 * Returns the live state object; `onChange` runs after every change.
 */
export function bindOptionControls(
  root: ParentNode,
  options: readonly RecipeOption[],
  onChange: () => void,
): Record<string, OptionValue> {
  const state: Record<string, OptionValue> = { ...optionDefaults(options) } as Record<string, OptionValue>;
  const controls = root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-option-key]');
  for (const control of controls) {
    const handler = () => {
      const key = control.dataset.optionKey;
      const value = readValue(control);
      if (key && value !== undefined) state[key] = value;
      onChange();
    };
    control.addEventListener(control.dataset.optionKind === 'amount' ? 'input' : 'change', handler);
  }
  return state;
}

export type { OptionState };
