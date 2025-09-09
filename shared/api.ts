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

export interface PinterestPin {
  title: string;
  description: string;
  link: string;
  image: string;
}

export interface PinterestResponse {
  pins: PinterestPin[];
}
