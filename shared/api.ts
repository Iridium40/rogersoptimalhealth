/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface HealthAssessmentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  date?: string;
  dob?: string;
  howHeard?: string;
  goalsCurrentState: string;
  goalsWhy?: string;
  pregnant?: boolean;
  nursing?: boolean;
  babyAgeMonths?: string;
  diabetesType1?: boolean;
  diabetesType2?: boolean;
  highBloodPressure?: boolean;
  highCholesterol?: boolean;
  gout?: boolean;
  ibs?: boolean;
  otherConditions?: string;
  onMedications?: boolean;
  medications?: string;
  sleepQuality?: number;
  energyLevel?: number;
  mealsPerDay?: number;
  snacksPerDay?: number;
  waterIntakeOz?: number;
  caffeinePerDay?: number;
  alcoholPerWeek?: number;
  exerciseDaysPerWeek?: number;
  exerciseTypes?: string;
  wakeTime?: string;
  bedTime?: string;
  commitment?: number;
  additionalNotes?: string;
}

export interface HealthAssessmentResponse {
  ok: true;
}

export type RecipeCategory =
  | "Chicken"
  | "Seafood"
  | "Beef"
  | "Turkey"
  | "Pork"
  | "Vegetarian"
  | "Breakfast";

/** Lean & Green plan exchange counts for a single serving. */
export interface RecipeCounts {
  lean: number;
  green: number;
  fat: number;
  condiment: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: RecipeCategory;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  counts: RecipeCounts;
  ingredients: string[];
  instructions: string[];
  favoriteCount?: number;
}

export interface RecipesResponse {
  recipes: Recipe[];
}
