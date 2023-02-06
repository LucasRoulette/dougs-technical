import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class BankOperation {
  @IsNumber()
  id: number;

  @IsString()
  wording: string;

  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDate()
  date: Date;
}
