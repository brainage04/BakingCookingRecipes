import type { MealProduct } from './types';

/**
 * Every figure below was read from the product's Australian nutrition panel on 2026-11-24, either on the
 * Woolworths product page (the page carries the panel as structured data) or on the maker's own site.
 * A panel value written "<1.0g" is counted as 0.
 */
const woolworths = 'https://www.woolworths.com.au/shop/productdetails';

function panelText(energyKj: number, protein: number, fat: number, carbohydrate: number, per: string): string {
  return `Energy ${energyKj}kJ, protein ${protein}g, fat ${fat}g, carbohydrate ${carbohydrate}g per ${per}`;
}

export const skimMilk: MealProduct = {
  key: 'skimMilk',
  name: 'Woolworths Skim Milk 1L',
  id: '51379',
  basis: 'ml',
  energyKj: 150,
  protein: 3.6,
  carbohydrate: 5,
  fat: 0.1,
  url: `${woolworths}/51379/woolworths-skim-milk`,
  panel: panelText(150, 3.6, 0.1, 5, '100mL'),
};

export const stevia: MealProduct = {
  key: 'stevia',
  name: 'Whole Earth Stevia Sugar Replacement 600g',
  id: '251041',
  basis: 'g',
  energyKj: 104,
  protein: 0,
  carbohydrate: 0,
  fat: 0.2,
  url: `${woolworths}/251041/whole-earth-stevia-sugar-replacement`,
  panel: panelText(104, 0, 0.2, 0, '100g'),
  note: 'Ingredients: erythritol and organic steviol glycosides. The panel serve is 4g.',
};

export const pb2: MealProduct = {
  key: 'pb2',
  name: 'PB2 Powdered Peanut Butter 184g',
  id: '117715',
  basis: 'g',
  energyKj: 1760,
  protein: 44,
  carbohydrate: 27,
  fat: 12.9,
  url: `${woolworths}/117715/pb2-powdered-peanut-butter`,
  panel: panelText(1760, 44, 12.9, 27, '100g (panel marks every figure "Approx.", serve 13g)'),
};

export const cotteesVanillaPudding: MealProduct = {
  key: 'cotteesVanillaPudding',
  name: "Cottee's Instant Vanilla Pudding 100g",
  id: '137364',
  basis: 'g',
  energyKj: 1610,
  protein: 0.1,
  carbohydrate: 94.6,
  fat: 0.1,
  url: `${woolworths}/137364/cottee-s-instant-vanilla-pudding-vanilla`,
  panel: panelText(1610, 0.1, 0.1, 94.6, '100g'),
};

export const custardCasein: MealProduct = {
  key: 'custardCasein',
  name: 'Muscle Nation Custard Casein Protein Powder Vanilla 400g',
  id: '79369',
  basis: 'g',
  energyKj: 1490,
  protein: 61.1,
  carbohydrate: 14.7,
  fat: 4,
  url: `${woolworths}/79369/muscle-nation-custard-casein-protein-powder-vanilla-flavour`,
  panel: panelText(1490, 61.1, 4, 14.7, '100g (serve 40g: 596kJ, 24.4g protein)'),
};

export const dailyShakeVanilla: MealProduct = {
  key: 'dailyShakeVanilla',
  name: 'Muscle Nation Protein Daily Shake Vanilla Ice Cream 300g',
  id: '919594',
  basis: 'g',
  energyKj: 1610,
  protein: 73,
  carbohydrate: 16.6,
  fat: 3,
  url: `${woolworths}/919594/muscle-nation-protein-daily-shake-powder-vanilla-ice-cream-flavour`,
  panel: panelText(1610, 73, 3, 16.6, '100g (serve 30g: 483kJ, 21.9g protein)'),
};

export const strawberries: MealProduct = {
  key: 'strawberries',
  name: 'Woolworths Strawberries Punnet 250g',
  id: '144607',
  basis: 'g',
  energyKj: 108,
  protein: 0.7,
  carbohydrate: 3.9,
  fat: 0.2,
  url: `${woolworths}/144607/strawberries-punnet`,
  panel: panelText(108, 0.7, 0.2, 3.9, '100g'),
};

export const instantCoffee: MealProduct = {
  key: 'instantCoffee',
  name: 'Nescafe Blend 43 Instant Coffee 300g',
  id: '199136',
  basis: 'g',
  energyKj: 692,
  protein: 16.1,
  carbohydrate: 11.2,
  fat: 0.6,
  url: `${woolworths}/199136/nescafe-blend-43-instant-coffee`,
  panel: panelText(692, 16.1, 0.6, 11.2, '100g'),
  note: 'Example brand. Any plain instant coffee lands within a few kcal.',
};

export const spiceTailorClassicButterChicken: MealProduct = {
  key: 'spiceTailorClassicButterChicken',
  name: 'The Spice Tailor Classic Butter Chicken 300g',
  id: '452266',
  basis: 'g',
  energyKj: 506,
  protein: 3.3,
  carbohydrate: 10.6,
  fat: 7.7,
  url: `${woolworths}/452266/the-spice-tailor-classic-butter-chicken`,
  panel: panelText(506, 3.3, 7.7, 10.6, '100g'),
  note: 'Maker page: https://au.thespicetailor.com/products/classic-butter-chicken/ (same panel). Woolworths also sells a 480g Classic Butter Chicken (product 6091199) with a different panel.',
};

export const spiceTailorSpicyButterChicken: MealProduct = {
  key: 'spiceTailorSpicyButterChicken',
  name: 'The Spice Tailor Spicy Butter Chicken 300g',
  id: '909453',
  basis: 'g',
  energyKj: 667,
  protein: 3.4,
  carbohydrate: 10.6,
  fat: 10.7,
  url: `${woolworths}/909453`,
  panel: panelText(667, 3.4, 10.7, 10.6, '100g'),
  note: 'Maker page: https://au.thespicetailor.com/products/spicy-butter-chicken/ (same panel).',
};

export const spiceTailorOriginalTikkaMasala: MealProduct = {
  key: 'spiceTailorOriginalTikkaMasala',
  name: 'The Spice Tailor Original Tikka Masala 300g',
  id: '452267',
  basis: 'g',
  energyKj: 540,
  protein: 2.2,
  carbohydrate: 11.5,
  fat: 8.7,
  url: `${woolworths}/452267/the-spice-tailor-original-tikka-masala`,
  panel: panelText(540, 2.2, 8.7, 11.5, '100g'),
  note: 'Maker page: https://au.thespicetailor.com/products/original-tikka-masala/ (same panel).',
};

export const chickenBreast: MealProduct = {
  key: 'chickenBreast',
  name: 'Woolworths RSPCA Approved Chicken Breast Fillet 1.4kg - 2.3kg (raw)',
  id: '121944',
  basis: 'g',
  energyKj: 438,
  protein: 22.3,
  carbohydrate: 0,
  fat: 1.6,
  url: `${woolworths}/121944/woolworths-rspca-approved-chicken-breast-fillet`,
  panel: panelText(438, 22.3, 1.6, 0, '100g, raw (carbohydrate printed "<1.0g")'),
};

export const chickenThigh: MealProduct = {
  key: 'chickenThigh',
  name: 'Woolworths RSPCA Approved Chicken Thigh Fillets Skinless 1.1kg - 1.8kg (raw)',
  id: '121947',
  basis: 'g',
  energyKj: 496,
  protein: 18.3,
  carbohydrate: 0,
  fat: 5,
  url: `${woolworths}/121947/woolworths-rspca-approved-chicken-thigh-fillets-skinless`,
  panel: panelText(496, 18.3, 5, 0, '100g, raw (carbohydrate printed "<1.0g")'),
};

export const whiteRice: MealProduct = {
  key: 'whiteRice',
  name: 'Sunrice White Rice Premium Long Grain 1kg (uncooked)',
  id: '36493',
  basis: 'g',
  energyKj: 1490,
  protein: 8,
  carbohydrate: 77.4,
  fat: 1,
  url: `${woolworths}/36493/sunrice-white-rice-premium-long-grain`,
  panel: panelText(1490, 8, 1, 77.4, '100g, uncooked'),
  note: 'The Sunrice Medium Grain 1kg (product 33183) panel is within 1.2g protein and 1.7g carbohydrate per 100g of this one.',
};

export const sunflowerOil: MealProduct = {
  key: 'sunflowerOil',
  name: 'Woolworths Sunflower Oil 750mL',
  id: '62000',
  basis: 'ml',
  energyKj: 3390,
  protein: 0,
  carbohydrate: 0,
  fat: 91.5,
  url: `${woolworths}/62000/woolworths-sunflower-oil`,
  panel: panelText(3390, 0, 91.5, 0, '100mL (protein and carbohydrate printed "<0.2g" per 15mL serve)'),
};

export const beefMinceExtraLean: MealProduct = {
  key: 'beefMinceExtraLean',
  name: 'Woolworths Heart Smart Extra Lean Beef Mince 500g (5% fat)',
  id: '577860',
  basis: 'g',
  energyKj: 545,
  protein: 21.2,
  carbohydrate: 1,
  fat: 5,
  url: `${woolworths}/577860/woolworths-heart-smart-extra-lean-beef-mince`,
  panel: panelText(545, 21.2, 5, 1, '100g, raw'),
};

export const beefMinceLean: MealProduct = {
  key: 'beefMinceLean',
  name: 'Woolworths Lean Beef Mince 1kg (10% fat)',
  id: '577862',
  basis: 'g',
  energyKj: 710,
  protein: 20,
  carbohydrate: 1,
  fat: 10,
  url: `${woolworths}/577862/woolworths-lean-beef-mince`,
  panel: panelText(710, 20, 10, 1, '100g, raw'),
};

export const donShortCutBacon: MealProduct = {
  key: 'donShortCutBacon',
  name: 'Don Short Cut Rindless Bacon (Woolworths 500g twin pack)',
  id: '216733',
  basis: 'g',
  energyKj: 700,
  protein: 15.6,
  carbohydrate: 3.4,
  fat: 10.2,
  url: `${woolworths}/216733/don-short-cut-rindless-bacon-twin-pack`,
  panel: panelText(700, 15.6, 10.2, 3.4, '100g, raw'),
  note: "Same panel on Don's own 500g page: https://isdonisgood.com.au/product/don-short-cut-bacon-500g/. Don lists no 1kg Short Cut pack, so the 1kg pack's panel is assumed to match.",
};

export const dolmioExtraTomatoOnionRoastGarlic: MealProduct = {
  key: 'dolmioExtraTomatoOnionRoastGarlic',
  name: 'Dolmio Extra Tomato Onion & Roast Garlic Pasta Sauce 500g',
  id: '758342',
  basis: 'g',
  energyKj: 208,
  protein: 1.8,
  carbohydrate: 10,
  fat: 0.1,
  url: `${woolworths}/758342/dolmio-extra-tomato-onion-roast-garlic-pasta-sauce`,
  panel: panelText(208, 1.8, 0.1, 10, '100g'),
};

export const dolmioExtraBolognese: MealProduct = {
  key: 'dolmioExtraBolognese',
  name: 'Dolmio Extra Bolognese Tomato Pasta Sauce 500g',
  id: '758286',
  basis: 'g',
  energyKj: 180,
  protein: 1.4,
  carbohydrate: 8.2,
  fat: 0.2,
  url: `${woolworths}/758286/dolmio-extra-bolognese-tomato-pasta-sauce`,
  panel: panelText(180, 1.4, 0.2, 8.2, '100g'),
};

export const dolmioClassicTomatoBasil: MealProduct = {
  key: 'dolmioClassicTomatoBasil',
  name: 'Dolmio Classic Tomato With Basil Pasta Sauce 500g',
  id: '758377',
  basis: 'g',
  energyKj: 160,
  protein: 1,
  carbohydrate: 7.2,
  fat: 0.2,
  url: `${woolworths}/758377/dolmio-classic-tomato-with-basil-pasta-sauce`,
  panel: panelText(160, 1, 0.2, 7.2, '100g'),
};

export const dolmioTraditionalClassicTomato: MealProduct = {
  key: 'dolmioTraditionalClassicTomato',
  name: 'Dolmio Traditional Recipe Classic Tomato Pasta Sauce 500g',
  id: '758444',
  basis: 'g',
  energyKj: 160,
  protein: 1.1,
  carbohydrate: 7.3,
  fat: 0.2,
  url: `${woolworths}/758444/dolmio-traditional-recipe-classic-tomato-pasta-sauce`,
  panel: panelText(160, 1.1, 0.2, 7.3, '100g'),
};

export const dolmioExtraTomatoOnionGarlicSaltReduced: MealProduct = {
  key: 'dolmioExtraTomatoOnionGarlicSaltReduced',
  name: 'Dolmio Extra Tomato, Onion & Garlic Salt Reduced Pasta Sauce 500g',
  id: '758316',
  basis: 'g',
  energyKj: 190,
  protein: 1.4,
  carbohydrate: 8.3,
  fat: 0.2,
  url: `${woolworths}/758316/dolmio-extra-tomato-onion-garlic-salt-reduced-pasta-sauce`,
  panel: panelText(190, 1.4, 0.2, 8.3, '100g'),
};

export const spaghetti: MealProduct = {
  key: 'spaghetti',
  name: 'San Remo Spaghetti Pasta No 5 500g (dry)',
  id: '43974',
  basis: 'g',
  energyKj: 1530,
  protein: 12.5,
  carbohydrate: 72,
  fat: 2,
  url: `${woolworths}/43974/san-remo-spaghetti-pasta-no-5`,
  panel: panelText(1530, 12.5, 2, 72, '100g, dry'),
};
