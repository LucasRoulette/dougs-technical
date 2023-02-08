import { InvalidData } from './invalid-data.model';

/**
 * Response of the validation route
 */
export interface ValidationResponse {
  message: 'accepted' | 'refused';
  errorReport?: InvalidData[];
}
