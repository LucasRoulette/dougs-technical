import { Injectable } from '@nestjs/common';
import { BankOperation } from './model/bank-operation.dto';
import { ControlPoint } from './model/control-point.dto';
import { DatedOperation } from './model/dated-operation.model';
import { InvalidData } from './model/invalid-data.model';

@Injectable()
export class ValidationService {
  /**
   * Validates the banks operations sent
   * @param bankOperations array of bank operations
   * @param controlPoints arrray of control point
   * @returns an array containing all the errors found
   */
  public validateBankOperations(
    bankOperations: BankOperation[],
    controlPoints: ControlPoint[],
  ): InvalidData[] {
    // I make an array that will contain all the errors found
    const errorReport: InvalidData[] = [];

    // I remove the duplicates and store them
    const duplicates: BankOperation[] = [];
    bankOperations = bankOperations.filter((operation, index) => {
      // I look for the first index with the same ID
      // I assume the ID is the only field that proves it's a duplicate, but it could be another behavior (same date and amount perhaps ?)
      const firstIndex = bankOperations.findIndex((m) => m.id === operation.id);

      // If there is two operations with the same ID, we store the duplicate
      if (firstIndex !== index) {
        duplicates.push(operation);
      }

      return firstIndex === index;
    });

    // If there is some duplicates, I add them to the error report
    if (duplicates.length > 0) {
      errorReport.push({
        message: 'Duplicate bank operations',
        duplicateBankOperations: duplicates,
      });
    }

    // We create an array with both control points and operations
    const datedOperations: Array<DatedOperation> = [];
    datedOperations.push(
      ...bankOperations.map((bo) => {
        return {
          date: bo.date,
          bankOperation: bo,
        };
      }),
    );
    datedOperations.push(
      ...controlPoints.map((cp) => {
        return {
          date: cp.date,
          controlPoint: cp,
        };
      }),
    );
    // We order it by date to handle data it by chronological order
    datedOperations.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    // The idea here is to check if the last element is a control point
    // If not, we will miss a control point for some operations
    // I register the uncontrolled operations in the error report
    const lastElement: DatedOperation =
      datedOperations[datedOperations.length - 1];
    if (lastElement.bankOperation) {
      const lastControlPointIndex: number =
        this.findLastIndexOfControlPoint(datedOperations);
      errorReport.push({
        message: 'Uncontrolled bank operations',
        uncontrolledOperations: datedOperations
          .slice(lastControlPointIndex + 1, datedOperations.length)
          .map((dOp) => dOp.bankOperation),
      });
    }

    // We set the starting balance
    // If our oldest data is a control point, we take this value
    // If our oldest data is a operation, we start at 0 to handle new bank accounts
    let currentBalance = 0;
    if (datedOperations[0].controlPoint) {
      currentBalance = datedOperations[0].controlPoint.balance;
      datedOperations.shift();
    }

    // We go over every elements
    const invalidControlPoint: ControlPoint[] = [];
    for (const element of datedOperations) {
      // On a control point, we make sure the balance matches the control point
      // On a mismatch, we set the balance to this point's value and add the point to the invalid point list
      if (element.controlPoint) {
        if (currentBalance !== element.controlPoint.balance) {
          invalidControlPoint.push(element.controlPoint);
          currentBalance = element.controlPoint.balance;
        }
      }

      // On a bank operation, we add the amount to the balance
      if (element.bankOperation) {
        currentBalance += element.bankOperation.amount;
      }
    }

    if (invalidControlPoint.length) {
      errorReport.push({
        message: 'Mismatch on control point',
        failedControlPoints: invalidControlPoint,
      });
    }

    return errorReport;
  }

  /**
   * Used to find the last index of a control point in an array
   * @param datedOperations
   * @returns - The index of the last control point if there is one, -1 otherwise
   */
  private findLastIndexOfControlPoint(
    datedOperations: DatedOperation[],
  ): number {
    const reverseLastControlPointIndex: number = datedOperations
      .slice()
      .reverse()
      .findIndex((data) => {
        return !!data.controlPoint;
      });

    if (reverseLastControlPointIndex === -1) {
      return -1;
    }
    return datedOperations.length - 1 - reverseLastControlPointIndex;
  }
}
