import { BankOperation } from './bank-operation.dto';
import { ControlPoint } from './control-point.dto';

/**
 * Interface used to present errors
 */
export interface InvalidData {
  message:
    | 'Mismatch on control point'
    | 'Uncontrolled bank operations'
    | 'Duplicate bank operations';
  duplicateBankOperations?: BankOperation[];
  failedControlPoints?: ControlPoint[];
  uncontrolledOperations?: BankOperation[];
}
