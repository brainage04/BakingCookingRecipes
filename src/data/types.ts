export type Unit = 'g' | 'ml' | 'egg';

/** Units for the scaled recipe amount; `yolk` counts egg yolks, which are still bought as whole eggs. */
export type MetricUnit = Unit | 'yolk';

export interface MacroBreakdown {
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface ProductChoice {
  id: string;
  name: string;
  packageQuantity: number;
  packageUnit: Unit;
  priceAud: number;
  unitPriceLabel: string;
  url: string;
  source: string;
  kcalPer100g: number | null;
  macrosPer100g: MacroBreakdown | null;
  nutritionNote?: string;
}

export type OptionValue = string | number | boolean;
export type OptionState = Readonly<Record<string, OptionValue>>;

interface OptionBase {
  key: string;
  label: string;
  hint?: string;
}

/** A checkbox that includes or leaves out the ingredients that name it in `when`. */
export interface ToggleOption extends OptionBase {
  kind: 'toggle';
  defaultValue: boolean;
}

/** Exactly one of `choices` is always selected, shown as radio buttons or a dropdown. */
export interface ChoiceOption extends OptionBase {
  kind: 'choice';
  control: 'radio' | 'select';
  choices: readonly { value: string; label: string }[];
  defaultValue: string;
}

/** A number the user types. Ingredients that name it in `perUnitOf` scale by it; 0 leaves them out. */
export interface AmountOption extends OptionBase {
  kind: 'amount';
  unit: string;
  defaultValue: number;
  min: number;
  max?: number;
}

export type RecipeOption = ToggleOption | ChoiceOption | AmountOption;

export interface IngredientChoice {
  key: string;
  label: string;
  sourceAmount: string;
  metricQuantity: number;
  metricUnit: MetricUnit;
  costQuantity: number;
  costUnit: Unit;
  /**
   * Weight of one batch's worth of this ingredient in grams. Product nutrition is per 100g, so this drives calories
   * and macros as well as the batch mass estimate. Volume ingredients convert millilitres to grams here and state
   * the density they assume in the product's `nutritionNote`.
   */
  batchGrams: number;
  /** The row appears only while this option holds this value (`true` for a checked toggle). */
  when?: { option: string; equals: string | boolean };
  /** Amount option whose value multiplies this row: the quantities above are for one unit of it. */
  perUnitOf?: string;
  products: {
    default: ProductChoice;
    stevia?: ProductChoice;
    brownMonkfruit?: ProductChoice;
    proteinFlour?: ProductChoice;
  };
}
