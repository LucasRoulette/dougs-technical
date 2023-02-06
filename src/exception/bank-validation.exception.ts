import { HttpException } from '@nestjs/common';
import { isArray } from 'class-validator';
import { BankOperation } from '../model/bank-operation.dto';
import { ControlPoint } from '../model/control-point.dto';

/**
 * A custom exception that handles the errors on bank validation
 */
export class BankValidationException extends HttpException {
  private duplicateBankOperations: BankOperation[];
  private failedControlPoint: ControlPoint;
  private uncontrolledOperation: BankOperation;

  // I overload the constructor to simplify the error creation in the validation process
  // The status code can be changed depending on the expected behavior, but 418 is always nice
  constructor(duplicateOperations: BankOperation[]);
  constructor(failedControlPoint: ControlPoint);
  constructor(uncontrolledOperation: BankOperation);
  constructor(arg: any) {
    if (arg instanceof ControlPoint) {
      super('Mismatch on control point', 418);
      this.failedControlPoint = arg;
      return;
    }
    if (arg instanceof BankOperation) {
      super('Uncontrolled bank operation', 418);
      this.uncontrolledOperation = arg;
      return;
    }
    if (isArray(arg)) {
      super('Duplicate bank operations', 418);
      this.duplicateBankOperations = arg;
      return;
    }
    super('Unknown error', 500);
  }

  // Overload the response to add pertinent data to the response
  getResponse(): string | object {
    return {
      message: this.message,
      duplicateBankOperations: this.duplicateBankOperations,
      failedControlPoint: this.failedControlPoint,
      uncontrolledOperation: this.uncontrolledOperation,
    };
  }
}
