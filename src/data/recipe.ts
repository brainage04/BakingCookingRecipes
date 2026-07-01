export const recipeMeta = {
  title: "Chewy Chocolate Chip Cookies",
  sourceName: "Sally's Baking Addiction",
  sourceUrl: 'https://sallysbakingaddiction.com/chewy-chocolate-chip-cookies/',
  sourceYield: '16 XL cookies or 20 medium/large cookies',
  prepTime: '15 minutes',
  cookTime: '13 minutes',
  totalTime: '2 hours 45 minutes',
  chillTime: 'At least 2 hours, up to 3 days; Sally recommends overnight.',
  cookiesPerBatch: 20,
  doughBallGrams: 50,
  sourceDoughBallNote:
    'Recipe card says 2 heaping Tablespoons, about 1.75 oz / 50g, but this calculator treats one batch as 20 cookies regardless of dough weight.',
  localStore: 'Selected Woolworths store',
  priceDate: '2026-07-01',
} as const;

export const sourceIngredients = [
  '2 and 1/4 cups (281g) all-purpose flour (spooned & leveled)',
  '1 teaspoon baking soda',
  '1 and 1/2 teaspoons cornstarch',
  '1/2 teaspoon salt',
  '3/4 cup (170g / 12 Tbsp) unsalted butter, melted & cooled for 5 minutes',
  '3/4 cup (150g) packed light or dark brown sugar',
  '1/2 cup (100g) granulated sugar',
  '1 large egg + 1 egg yolk, at room temperature',
  '2 teaspoons pure vanilla extract',
  '200g semi-sweet chocolate chips or chocolate chunks',
] as const;

export const sourceInstructions = [
  'In a large bowl, whisk the flour, baking soda, cornstarch, and salt together. Set aside.',
  'In a medium bowl, whisk the melted butter, brown sugar, and granulated sugar together until no lumps remain. Whisk in the egg and egg yolk until combined, then whisk in the vanilla extract. The mixture will be thin. Pour into dry ingredients and mix together with a large spoon or spatula. The dough will be very soft, thick, and shiny. Fold in the chocolate chips. The chocolate chips may not stick to the dough because of the melted butter, but do your best to combine them.',
  'Cover the dough tightly and refrigerate for 12–24 hours.',
  'Preheat oven to 150°C fan-forced. Line large baking sheets with parchment paper or silicone baking mats. Leave the chilled dough out at room temperature for 2–4 hours before preparing.',
  'Roll the dough into 50g balls, then shape each ball taller rather than wide, almost like a cylinder. Arrange cookies 3 inches apart.',
  'Bake for 25 minutes. If using two trays, swap their oven positions halfway through baking. Leave cookies at room temperature for 20 minutes to set; optional: press extra chocolate chips into the tops while warm.',
  'Store tightly covered at room temperature for up to 1 week. Fridge storage is also fine.',
] as const;


export const experimentTodos = [
  'Try Vetta Smart Protein Plain Flour 1kg instead of regular plain flour.',
  'Try browning the butter instead of melting it in the microwave.',
] as const;

export type Unit = 'g' | 'ml' | 'egg';

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

export interface IngredientChoice {
  key: string;
  label: string;
  sourceAmount: string;
  metricQuantity: number;
  metricUnit: Unit;
  costQuantity: number;
  costUnit: Unit;
  nutritionQuantity: number;
  nutritionUnit: 'g' | 'ml';
  products: {
    default: ProductChoice;
    stevia?: ProductChoice;
    brownMonkfruit?: ProductChoice;
    proteinFlour?: ProductChoice;
  };
}

const woolworthsSearchSource =
  'Woolworths online search result observed for the selected shopping target; final in-store pricing can differ until the store is selected in Woolworths.';
const woolworthsProductSource =
  'Woolworths product page for identity/nutrition plus Woolworths search result for current price.';

export const ingredients: IngredientChoice[] = [
  {
    key: 'flour',
    label: 'All-purpose / plain flour',
    sourceAmount: '2 1/4 cups (281g)',
    metricQuantity: 281,
    metricUnit: 'g',
    costQuantity: 281,
    costUnit: 'g',
    nutritionQuantity: 281,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '33282',
        name: 'Essentials Plain Flour 1kg',
        packageQuantity: 1000,
        packageUnit: 'g',
        priceAud: 1.3,
        unitPriceLabel: '$1.30 / 1kg',
        url: 'https://www.woolworths.com.au/shop/productdetails/33282/essentials-plain-flour',
        source: woolworthsProductSource,
        kcalPer100g: 1480 / 4.184,
        macrosPer100g: { protein: 10.9, carbohydrates: 73.6, fat: 1.4 },
      },
      proteinFlour: {
        id: '142314',
        name: 'Vetta Smart Protein Plain Flour 1kg',
        packageQuantity: 1000,
        packageUnit: 'g',
        priceAud: 4.5,
        unitPriceLabel: '$4.50 / 1kg',
        url: 'https://www.woolworths.com.au/shop/productdetails/142314/vetta-smart-protein-plain-flour',
        source: woolworthsProductSource,
        kcalPer100g: 1420 / 4.184,
        macrosPer100g: { protein: 22.4, carbohydrates: 55.8, fat: 1.8 },
      },
    },
  },
  {
    key: 'baking-soda',
    label: 'Baking soda / bicarbonate soda',
    sourceAmount: '1 tsp',
    metricQuantity: 4.6,
    metricUnit: 'g',
    costQuantity: 4.6,
    costUnit: 'g',
    nutritionQuantity: 0,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '251189',
        name: 'Essentials Bicarbonate Soda 500g',
        packageQuantity: 500,
        packageUnit: 'g',
        priceAud: 2.45,
        unitPriceLabel: '$0.49 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/251189/essentials-bicarbonate-soda',
        source: woolworthsProductSource,
        kcalPer100g: 0,
        macrosPer100g: { protein: 0, carbohydrates: 0, fat: 0 },
        nutritionNote: 'Leavening agent; calories treated as zero.',
      },
    },
  },
  {
    key: 'cornstarch',
    label: 'Cornstarch / cornflour',
    sourceAmount: '1 1/2 tsp',
    metricQuantity: 4,
    metricUnit: 'g',
    costQuantity: 4,
    costUnit: 'g',
    nutritionQuantity: 4,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '39128',
        name: 'Essentials Cornflour 500g',
        packageQuantity: 500,
        packageUnit: 'g',
        priceAud: 2.25,
        unitPriceLabel: '$4.50 / 1kg',
        url: 'https://www.woolworths.com.au/shop/productdetails/39128/essentials-cornflour',
        source: woolworthsProductSource,
        kcalPer100g: 1550 / 4.184,
        macrosPer100g: { protein: 0.3, carbohydrates: 91.3, fat: 0.1 },
      },
    },
  },
  {
    key: 'salt',
    label: 'Salt',
    sourceAmount: '1/2 tsp',
    metricQuantity: 3,
    metricUnit: 'g',
    costQuantity: 3,
    costUnit: 'g',
    nutritionQuantity: 0,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '37687',
        name: 'Essentials Table Salt 1kg',
        packageQuantity: 1000,
        packageUnit: 'g',
        priceAud: 2,
        unitPriceLabel: '$0.02 / 10g',
        url: 'https://www.woolworths.com.au/shop/productdetails/37687/essentials-table-salt',
        source: woolworthsProductSource,
        kcalPer100g: 0,
        macrosPer100g: { protein: 0, carbohydrates: 0, fat: 0 },
        nutritionNote: 'Calories treated as zero.',
      },
    },
  },
  {
    key: 'butter',
    label: 'Unsalted butter',
    sourceAmount: '3/4 cup (170g / 12 Tbsp)',
    metricQuantity: 170,
    metricUnit: 'g',
    costQuantity: 170,
    costUnit: 'g',
    nutritionQuantity: 170,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '450346',
        name: 'Essentials Unsalted Butter 500g',
        packageQuantity: 500,
        packageUnit: 'g',
        priceAud: 7,
        unitPriceLabel: '$1.40 / 100g',
        url: 'https://www.woolworths.com.au/shop/search/products?searchTerm=unsalted%20butter',
        source: woolworthsSearchSource,
        kcalPer100g: 3110 / 4.184,
        macrosPer100g: { protein: 0.6, carbohydrates: 0.6, fat: 82.9 },
        nutritionNote: 'Nutrition uses Essentials Unsalted Butter 250g label because the 500g search result page did not expose nutrition.',
      },
    },
  },
  {
    key: 'brown-sugar',
    label: 'Packed brown sugar',
    sourceAmount: '3/4 cup (150g)',
    metricQuantity: 150,
    metricUnit: 'g',
    costQuantity: 150,
    costUnit: 'g',
    nutritionQuantity: 150,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '720342',
        name: 'Essentials Brown Sugar 1kg',
        packageQuantity: 1000,
        packageUnit: 'g',
        priceAud: 3.3,
        unitPriceLabel: '$0.33 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/720342/essentials-brown-sugar',
        source: woolworthsProductSource,
        kcalPer100g: 1650 / 4.184,
        macrosPer100g: { protein: 0, carbohydrates: 97.4, fat: 0 },
      },
      brownMonkfruit: {
        id: '280760',
        name: 'Lakanto Monkfruit Sweetener Brown 450g',
        packageQuantity: 450,
        packageUnit: 'g',
        priceAud: 12,
        unitPriceLabel: '$2.67 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/280760/lakanto-monkfruit-sweetener-brown',
        source: woolworthsProductSource,
        kcalPer100g: 121 / 4.184,
        macrosPer100g: { protein: 0, carbohydrates: 8.1, fat: 0 },
      },
    },
  },
  {
    key: 'white-sugar',
    label: 'Granulated white sugar',
    sourceAmount: '1/2 cup (100g)',
    metricQuantity: 100,
    metricUnit: 'g',
    costQuantity: 100,
    costUnit: 'g',
    nutritionQuantity: 100,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '58537',
        name: 'Essentials White Sugar 1kg',
        packageQuantity: 1000,
        packageUnit: 'g',
        priceAud: 1.8,
        unitPriceLabel: '$0.18 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/58537/essentials-white-sugar',
        source: woolworthsProductSource,
        kcalPer100g: 1700 / 4.184,
        macrosPer100g: { protein: 0, carbohydrates: 100, fat: 0 },
      },
      stevia: {
        id: '251041',
        name: 'Whole Earth Stevia Sugar Replacement 600g',
        packageQuantity: 600,
        packageUnit: 'g',
        priceAud: 10.8,
        unitPriceLabel: '$1.80 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/251041/whole-earth-stevia-sugar-replacement',
        source: woolworthsProductSource,
        kcalPer100g: 104 / 4.184,
        macrosPer100g: { protein: 0, carbohydrates: 5.9, fat: 0 },
      },
    },
  },
  {
    key: 'eggs',
    label: 'Egg + egg yolk',
    sourceAmount: '1 large egg + 1 egg yolk',
    metricQuantity: 1.5,
    metricUnit: 'egg',
    costQuantity: 1.5,
    costUnit: 'egg',
    nutritionQuantity: 68,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '165367',
        name: 'Woolworths 12 Extra Large Barn Laid Cage Free Eggs 700g',
        packageQuantity: 12,
        packageUnit: 'egg',
        priceAud: 5,
        unitPriceLabel: '$0.71 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/165367/woolworths-12-extra-large-cage-free-eggs',
        source: woolworthsProductSource,
        kcalPer100g: 596 / 4.184,
        macrosPer100g: { protein: 12.7, carbohydrates: 0.7, fat: 9.9 },
        nutritionNote: 'Calories use about 68g edible egg for one large egg plus one yolk.',
      },
    },
  },
  {
    key: 'vanilla',
    label: 'Pure vanilla extract',
    sourceAmount: '2 tsp',
    metricQuantity: 10,
    metricUnit: 'ml',
    costQuantity: 10,
    costUnit: 'ml',
    nutritionQuantity: 10,
    nutritionUnit: 'ml',
    products: {
      default: {
        id: '37419',
        name: 'Queen Organic Vanilla Extract 50mL',
        packageQuantity: 50,
        packageUnit: 'ml',
        priceAud: 4,
        unitPriceLabel: '$0.80 / 10mL',
        url: 'https://www.woolworths.com.au/shop/productdetails/37419/queen-organic-vanilla-extract',
        source: woolworthsProductSource,
        kcalPer100g: null,
        macrosPer100g: null,
        nutritionNote: 'Woolworths lists nutrition as unavailable; calories are excluded from totals.',
      },
    },
  },
  {
    key: 'chocolate',
    label: 'Semi-sweet chocolate chips/chunks',
    sourceAmount: '200g',
    metricQuantity: 200,
    metricUnit: 'g',
    costQuantity: 200,
    costUnit: 'g',
    nutritionQuantity: 200,
    nutritionUnit: 'g',
    products: {
      default: {
        id: '6036943',
        name: 'Woolworths Dark Chocolate Chips 200g',
        packageQuantity: 200,
        packageUnit: 'g',
        priceAud: 4.5,
        unitPriceLabel: '$2.25 / 100g',
        url: 'https://www.woolworths.com.au/shop/productdetails/6036943/woolworths-dark-chocolate-chips',
        source: woolworthsProductSource,
        kcalPer100g: 2110 / 4.184,
        macrosPer100g: { protein: 5.3, carbohydrates: 56.4, fat: 28.4 },
      },
    },
  },
] as const satisfies IngredientChoice[];
