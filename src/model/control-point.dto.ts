import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class ControlPoint {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  balance: number;
}
