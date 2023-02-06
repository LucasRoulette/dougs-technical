import { Injectable } from '@nestjs/common';
import { BankValidationException } from './exception/bank-validation.exception';
import { BankOperation } from './model/bank-operation.dto';
import { ControlPoint } from './model/control-point.dto';

@Injectable()
export class ValidationService {
  /**
   * Validates the banks operations sent
   * Throws an ValidationException if an irregularity is found
   * @param bankOperations array of bank operations
   * @param controlPoints arrray of control point
   */
  public validateBankOperations(
    bankOperations: BankOperation[],
    controlPoints: ControlPoint[],
  ): void {
    // I check if there is any duplicate in the bank operations
    const duplicates: BankOperation[] = [];
    bankOperations.forEach((operation, index) => {
      // I look for the first index with the same ID
      // I assume the ID is the only field that proves it's a duplicate, but it could be another behavior (same date and amount perhaps ?)
      const firstIndex = bankOperations.findIndex((m) => m.id === operation.id);

      // If there is two operations with the same ID, we store the duplicate
      if (firstIndex !== index) {
        duplicates.push(operation);
      }
    });

    // If we have duplicates, we throw an error
    // I store every duplicate to send them all back to the client, making it easier to clean up the import
    if (duplicates.length > 0) {
      throw new BankValidationException(duplicates);
    }

    // We create an array with both control points and operations
    const operationsAndControlPoints: Array<BankOperation | ControlPoint> = [];
    operationsAndControlPoints.push(...bankOperations);
    operationsAndControlPoints.push(...controlPoints);
    // We order it by date to handle data it by chronological order
    operationsAndControlPoints.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    // The idea here is to check if the last element is a control point
    // If not, we will miss a control point for some operations
    // I throw an error but It could be ignored depending on the expected behavior
    const lastElement: BankOperation | ControlPoint =
      operationsAndControlPoints[operationsAndControlPoints.length - 1];
    if (!(lastElement instanceof ControlPoint)) {
      throw new BankValidationException(lastElement);
    }

    // We set the starting balance
    // If our oldest data is a control point, we take this value
    // If our oldest data is a operation, we start at 0 to handle new bank accounts
    let currentBalance = 0;
    if (operationsAndControlPoints[0] instanceof ControlPoint) {
      currentBalance = operationsAndControlPoints[0].balance;
      operationsAndControlPoints.shift();
    }

    // We go over every elements
    for (const element of operationsAndControlPoints) {
      // On a control point, we make sure the balance matches the control point
      if (element instanceof ControlPoint) {
        if (currentBalance !== element.balance) {
          throw new BankValidationException(element);
        }
      }

      // On a bank operation, we add the amount to the balance
      if (element instanceof BankOperation) {
        currentBalance += element.amount;
      }
    }
  }
}
