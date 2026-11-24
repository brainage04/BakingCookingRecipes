import { bolognese } from './bolognese';
import { butterChicken } from './butterChicken';
import { icedCoffee } from './icedCoffee';
import { proteinIceCream } from './proteinIceCream';
import type { MealRecipe } from './types';

export const meals: readonly MealRecipe[] = [proteinIceCream, icedCoffee, butterChicken, bolognese];
