import { BankOperation } from './bank-operation.dto';
import { ControlPoint } from './control-point.dto';

/**
 * Used to store the two objects and their date
 */
export interface DatedOperation {
  date: Date;
  controlPoint?: ControlPoint;
  bankOperation?: BankOperation;
}
