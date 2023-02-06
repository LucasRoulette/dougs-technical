import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BankOperation } from './bank-operation.dto';
import { ControlPoint } from './control-point.dto';

export class ValidationDto {
  @ValidateNested({ each: true })
  @Type(() => BankOperation)
  movements: BankOperation[];

  @ValidateNested({ each: true })
  @Type(() => ControlPoint)
  balances: ControlPoint[];
}
