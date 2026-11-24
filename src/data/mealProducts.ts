import type { ProductChoice, Unit } from './types';

/**
 * Meal products. Nutrition is copied from each product's Australian panel and prices from the Woolworths product
 * page, both read on 2026-11-24. A panel value printed "<1.0g" counts as 0. The panel line is kept in
 * `nutritionNote` so the page shows what the numbers came from.
 */
export const mealPriceDate = '2026-11-24';

const woolworths = 'https://www.woolworths.com.au/shop/productdetails';
const woolworthsSource = 'Woolworths product page for the panel and price, read 24 November 2026.';

interface PanelProduct {
  id: string;
  slug?: string;
  name: string;
  packageQuantity: number;
  packageUnit: Unit;
  priceAud: number;
  unitPriceLabel: string;
  kj: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  /** Which quantity the panel figures are per. */
  per: string;
  url?: string;
  source?: string;
  note?: string;
}

function product(item: PanelProduct): ProductChoice {
  const panel = `Panel per ${item.per}: ${item.kj}kJ, protein ${item.protein}g, fat ${item.fat}g, carbohydrate ${item.carbohydrates}g.`;
  return {
    id: item.id,
    name: item.name,
    packageQuantity: item.packageQuantity,
    packageUnit: item.packageUnit,
    priceAud: item.priceAud,
    unitPriceLabel: item.unitPriceLabel,
    url: item.url ?? `${woolworths}/${item.id}${item.slug ? `/${item.slug}` : ''}`,
    source: item.source ?? woolworthsSource,
    kcalPer100g: item.kj / 4.184,
    macrosPer100g: { protein: item.protein, carbohydrates: item.carbohydrates, fat: item.fat },
    nutritionNote: item.note ? `${panel} ${item.note}` : panel,
  };
}

const per100g = '100g';
const per100ml = '100mL, so millilitres are used as the quantity';

export const skimMilk = product({
  id: '51379',
  slug: 'woolworths-skim-milk',
  name: 'Woolworths Skim Milk 1L',
  packageQuantity: 1000,
  packageUnit: 'ml',
  priceAud: 1.75,
  unitPriceLabel: '$1.75 / 1L',
  kj: 150,
  protein: 3.6,
  carbohydrates: 5,
  fat: 0.1,
  per: per100ml,
});

export const stevia = product({
  id: '251041',
  slug: 'whole-earth-stevia-sugar-replacement',
  name: 'Whole Earth Stevia Sugar Replacement 600g',
  packageQuantity: 600,
  packageUnit: 'g',
  priceAud: 10.8,
  unitPriceLabel: '$1.80 / 100g',
  kj: 104,
  protein: 0,
  carbohydrates: 0,
  fat: 0.2,
  per: per100g,
  note: 'The panel serve is 4g, taken as 1 teaspoon.',
});

export const pb2 = product({
  id: '117715',
  slug: 'pb2-powdered-peanut-butter',
  name: 'PB2 Powdered Peanut Butter 184g',
  packageQuantity: 184,
  packageUnit: 'g',
  priceAud: 9,
  unitPriceLabel: '$4.89 / 100g (special, was $10.00)',
  kj: 1760,
  protein: 44,
  carbohydrates: 27,
  fat: 12.9,
  per: `${per100g} (the panel marks every figure "Approx.")`,
  note: 'The panel serve is 13g, taken as 2 tbsp, so 1 tbsp is 6.5g.',
});

export const cotteesVanillaPudding = product({
  id: '137364',
  slug: 'cottee-s-instant-vanilla-pudding-vanilla',
  name: "Cottee's Instant Vanilla Pudding 100g",
  packageQuantity: 100,
  packageUnit: 'g',
  priceAud: 2.3,
  unitPriceLabel: '$2.30 / 100g',
  kj: 1610,
  protein: 0.1,
  carbohydrates: 94.6,
  fat: 0.1,
  per: per100g,
});

export const xanthanGum = product({
  id: '1122716619',
  slug: 'lotus-xanthan-gum-100g',
  name: 'Lotus Xanthan Gum 100g',
  packageQuantity: 100,
  packageUnit: 'g',
  priceAud: 6.99,
  unitPriceLabel: '$6.99 / 100g',
  kj: 703,
  protein: 7,
  carbohydrates: 1,
  fat: 1,
  per: per100g,
  note: "The Lotus page shows no panel, so the figures are the panel on Woolworths' Macro Xanthan Gum 100g (product 689518), which was out of stock when read. 1 teaspoon is taken as 3g (FAO density 0.64 g/mL).",
});

export const custardCasein = product({
  id: '79369',
  slug: 'muscle-nation-custard-casein-protein-powder-vanilla-flavour',
  name: 'Muscle Nation Custard Casein Protein Powder Vanilla 400g',
  packageQuantity: 400,
  packageUnit: 'g',
  priceAud: 35,
  unitPriceLabel: '$8.75 / 100g',
  kj: 1490,
  protein: 61.1,
  carbohydrates: 14.7,
  fat: 4,
  per: per100g,
  note: 'The panel serve is 40g (2 scoops): 596kJ and 24.4g protein. Other flavours have their own panels.',
});

export const dailyShakeVanilla = product({
  id: '919594',
  slug: 'muscle-nation-protein-daily-shake-powder-vanilla-ice-cream-flavour',
  name: 'Muscle Nation Protein Daily Shake Vanilla Ice Cream 300g',
  packageQuantity: 300,
  packageUnit: 'g',
  priceAud: 35,
  unitPriceLabel: '$11.67 / 100g',
  kj: 1610,
  protein: 73,
  carbohydrates: 16.6,
  fat: 3,
  per: per100g,
  note: 'The panel serve is 30g (1 scoop): 483kJ and 21.9g protein.',
});

export const strawberries = product({
  id: '144607',
  slug: 'strawberries-punnet',
  name: 'Woolworths Strawberries Punnet 250g',
  packageQuantity: 250,
  packageUnit: 'g',
  priceAud: 3.5,
  unitPriceLabel: '$14.00 / 1kg',
  kj: 108,
  protein: 0.7,
  carbohydrates: 3.9,
  fat: 0.2,
  per: per100g,
});

export const banana = product({
  id: '133211',
  slug: 'cavendish-bananas',
  name: 'Cavendish Bananas (about 150g each)',
  packageQuantity: 150,
  packageUnit: 'g',
  priceAud: 0.72,
  unitPriceLabel: '$0.72 each',
  kj: 399,
  protein: 1.4,
  carbohydrates: 19.9,
  fat: 0.2,
  per: `${per100g} of peeled raw banana, from the totality360.com.au page for Cavendish banana (https://totality360.com.au/foods/banana-cavendish.html), which lists values from the Australian Food Composition Database, because the Woolworths page has no panel`,
  note: 'The price is per banana; about 150g of mashed banana is taken as one banana.',
});

export const instantCoffee = product({
  id: '199136',
  slug: 'nescafe-blend-43-instant-coffee',
  name: 'Nescafe Blend 43 Instant Coffee 300g',
  packageQuantity: 300,
  packageUnit: 'g',
  priceAud: 19.2,
  unitPriceLabel: '$6.40 / 100g',
  kj: 692,
  protein: 16.1,
  carbohydrates: 11.2,
  fat: 0.6,
  per: per100g,
  note: 'Example brand. Any plain instant coffee lands within a few kcal. 1 teaspoon is taken as 2g (4 to 6g for 2 to 3 teaspoons, from the original notes).',
});

export const spiceTailorClassicButterChicken = product({
  id: '452266',
  slug: 'the-spice-tailor-classic-butter-chicken',
  name: 'The Spice Tailor Classic Butter Chicken 300g',
  packageQuantity: 300,
  packageUnit: 'g',
  priceAud: 6.7,
  unitPriceLabel: '$2.23 / 100g',
  kj: 506,
  protein: 3.3,
  carbohydrates: 10.6,
  fat: 7.7,
  per: per100g,
  note: "The maker's Australian page shows the same panel: https://au.thespicetailor.com/products/classic-butter-chicken/. Woolworths also sells a 480g Classic Butter Chicken (product 6091199) with a different panel.",
});

export const spiceTailorSpicyButterChicken = product({
  id: '909453',
  name: 'The Spice Tailor Spicy Butter Chicken 300g',
  packageQuantity: 300,
  packageUnit: 'g',
  priceAud: 6.7,
  unitPriceLabel: '$2.23 / 100g',
  kj: 667,
  protein: 3.4,
  carbohydrates: 10.6,
  fat: 10.7,
  per: per100g,
  note: "The maker's page shows the same panel: https://au.thespicetailor.com/products/spicy-butter-chicken/.",
});

export const spiceTailorOriginalTikkaMasala = product({
  id: '452267',
  slug: 'the-spice-tailor-original-tikka-masala',
  name: 'The Spice Tailor Original Tikka Masala 300g',
  packageQuantity: 300,
  packageUnit: 'g',
  priceAud: 6.7,
  unitPriceLabel: '$2.23 / 100g',
  kj: 540,
  protein: 2.2,
  carbohydrates: 11.5,
  fat: 8.7,
  per: per100g,
  note: "The maker's page shows the same panel: https://au.thespicetailor.com/products/original-tikka-masala/.",
});

export const chickenBreast = product({
  id: '969723',
  slug: 'woolworths-rspca-approved-chicken-breast-fillet',
  name: 'Woolworths RSPCA Approved Chicken Breast Fillet 1.5kg - 2.2kg',
  packageQuantity: 1000,
  packageUnit: 'g',
  priceAud: 11,
  unitPriceLabel: '$11.00 / 1kg',
  kj: 438,
  protein: 22.3,
  carbohydrates: 0,
  fat: 1.6,
  per: `${per100g}, raw (carbohydrate printed "<1.0g")`,
  source:
    'Price from this pack. The panel is the one on Woolworths RSPCA Approved Chicken Breast Fillet 1.4kg - 2.3kg (product 121944, https://www.woolworths.com.au/shop/productdetails/121944/woolworths-rspca-approved-chicken-breast-fillet).',
  note: 'Sold by weight, so the pack is priced per kilogram.',
});

export const chickenThigh = product({
  id: '727622',
  slug: 'woolworths-rspca-approved-chicken-thigh-fillets-skinless',
  name: 'Woolworths RSPCA Approved Chicken Thigh Fillets Skinless 1.2kg - 1.8kg',
  packageQuantity: 1000,
  packageUnit: 'g',
  priceAud: 14.5,
  unitPriceLabel: '$14.50 / 1kg',
  kj: 496,
  protein: 18.3,
  carbohydrates: 0,
  fat: 5,
  per: `${per100g}, raw (carbohydrate printed "<1.0g")`,
  source:
    'Price from this pack. The panel is the one on Woolworths RSPCA Approved Chicken Thigh Fillets Skinless 1.1kg - 1.8kg (product 121947, https://www.woolworths.com.au/shop/productdetails/121947/woolworths-rspca-approved-chicken-thigh-fillets-skinless).',
  note: 'Sold by weight, so the pack is priced per kilogram.',
});

export const whiteRice = product({
  id: '36493',
  slug: 'sunrice-white-rice-premium-long-grain',
  name: 'Sunrice White Rice Premium Long Grain 1kg',
  packageQuantity: 1000,
  packageUnit: 'g',
  priceAud: 2.25,
  unitPriceLabel: '$0.23 / 100g (special, was $3.00)',
  kj: 1490,
  protein: 8,
  carbohydrates: 77.4,
  fat: 1,
  per: `${per100g}, uncooked`,
  note: 'Uncooked long grain white rice weighs about 0.78g per mL (one US cup is 185g in 237mL, USDA FoodData Central via https://cookingcalculator.app/ingredients/white-rice).',
});

export const sunflowerOil = product({
  id: '62000',
  slug: 'woolworths-sunflower-oil',
  name: 'Woolworths Sunflower Oil 750mL',
  packageQuantity: 750,
  packageUnit: 'ml',
  priceAud: 4,
  unitPriceLabel: '$0.53 / 100mL',
  kj: 3390,
  protein: 0,
  carbohydrates: 0,
  fat: 91.5,
  per: '100mL, so millilitres are used as the quantity (protein and carbohydrate printed "<0.2g" per 15mL)',
  note: 'A tablespoon is 15mL, the serve size on the panel.',
});

export const beefMinceExtraLean = product({
  id: '577860',
  slug: 'woolworths-heart-smart-extra-lean-beef-mince',
  name: 'Woolworths Heart Smart Extra Lean Beef Mince 500g (5% fat)',
  packageQuantity: 500,
  packageUnit: 'g',
  priceAud: 10,
  unitPriceLabel: '$20.00 / 1kg',
  kj: 545,
  protein: 21.2,
  carbohydrates: 1,
  fat: 5,
  per: `${per100g}, raw`,
});

export const beefMinceLean = product({
  id: '577862',
  slug: 'woolworths-lean-beef-mince',
  name: 'Woolworths Lean Beef Mince 1kg (10% fat)',
  packageQuantity: 1000,
  packageUnit: 'g',
  priceAud: 19,
  unitPriceLabel: '$19.00 / 1kg',
  kj: 710,
  protein: 20,
  carbohydrates: 1,
  fat: 10,
  per: `${per100g}, raw`,
});

export const donShortCutBacon = product({
  id: '220824',
  slug: 'don-short-cut-rindless-bacon',
  name: 'Don Short Cut Rindless Bacon 200g',
  packageQuantity: 200,
  packageUnit: 'g',
  priceAud: 5.5,
  unitPriceLabel: '$27.50 / 1kg',
  kj: 700,
  protein: 15.6,
  carbohydrates: 3.4,
  fat: 10.2,
  per: `${per100g}, raw`,
  note: 'The 500g pack (https://isdonisgood.com.au/product/don-short-cut-bacon-500g/) has the same panel. Don lists no 1kg Short Cut pack and the Woolworths 500g twin pack had no price on 24 November, so the 200g pack sets the price.',
});

function dolmio(
  item: Pick<PanelProduct, 'id' | 'slug' | 'name' | 'kj' | 'protein' | 'carbohydrates' | 'fat'> & Partial<PanelProduct>,
) {
  return product({
    packageQuantity: 500,
    packageUnit: 'g',
    priceAud: 0,
    unitPriceLabel: 'Price unavailable, not in stock on 24 November',
    per: per100g,
    ...item,
  });
}

export const dolmioTomatoOnionRoastGarlic = dolmio({
  id: '758342',
  slug: 'dolmio-extra-tomato-onion-roast-garlic-pasta-sauce',
  name: 'Dolmio Extra Tomato Onion & Roast Garlic Pasta Sauce 500g',
  priceAud: 3.6,
  unitPriceLabel: '$0.72 / 100g (special, was $4.60)',
  kj: 208,
  protein: 1.8,
  carbohydrates: 10,
  fat: 0.1,
});

export const dolmioExtraBolognese = dolmio({
  id: '758286',
  slug: 'dolmio-extra-bolognese-tomato-pasta-sauce',
  name: 'Dolmio Extra Bolognese Tomato Pasta Sauce 500g',
  priceAud: 3.6,
  unitPriceLabel: '$0.72 / 100g (special, was $4.60)',
  kj: 180,
  protein: 1.4,
  carbohydrates: 8.2,
  fat: 0.2,
});

export const dolmioClassicTomatoBasil = dolmio({
  id: '758377',
  slug: 'dolmio-classic-tomato-with-basil-pasta-sauce',
  name: 'Dolmio Classic Tomato With Basil Pasta Sauce 500g',
  priceAud: 2.5,
  unitPriceLabel: '$0.50 / 100g',
  kj: 160,
  protein: 1,
  carbohydrates: 7.2,
  fat: 0.2,
});

export const dolmioTraditionalClassicTomato = dolmio({
  id: '758444',
  slug: 'dolmio-traditional-recipe-classic-tomato-pasta-sauce',
  name: 'Dolmio Traditional Recipe Classic Tomato Pasta Sauce 500g',
  kj: 160,
  protein: 1.1,
  carbohydrates: 7.3,
  fat: 0.2,
});

export const dolmioSaltReduced = dolmio({
  id: '758316',
  slug: 'dolmio-extra-tomato-onion-garlic-salt-reduced-pasta-sauce',
  name: 'Dolmio Extra Tomato, Onion & Garlic Salt Reduced Pasta Sauce 500g',
  kj: 190,
  protein: 1.4,
  carbohydrates: 8.3,
  fat: 0.2,
});

export const spaghetti = product({
  id: '43974',
  slug: 'san-remo-spaghetti-pasta-no-5',
  name: 'San Remo Spaghetti Pasta No 5 500g',
  packageQuantity: 500,
  packageUnit: 'g',
  priceAud: 2.95,
  unitPriceLabel: '$0.59 / 100g',
  kj: 1530,
  protein: 12.5,
  carbohydrates: 72,
  fat: 2,
  per: `${per100g}, dry`,
});
