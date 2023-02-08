import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidData } from './model/invalid-data.model';
import { ValidationDto } from './model/validation.dto';
import { ValidationResponse } from './model/validation.response';
import { ValidationService } from './validation.service';

/**
 * Controller that handles the requests to /movements/validation
 */
@Controller('movements')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  /**
   * API route that sends back a 201 when the data is valid
   * Sends back a 418 and an array of InvalidData otherwise
   * @param body bank movements and control points
   */
  @Post('/validation')
  public postValidation(
    @Body() body: ValidationDto,
    @Res() res: Response,
  ): void {
    const errorReport: InvalidData[] =
      this.validationService.validateBankOperations(
        body.movements,
        body.balances,
      );

    if (errorReport.length) {
      const result: ValidationResponse = {
        message: 'refused',
        errorReport,
      };
      res.status(418).json(result);
    } else {
      const result: ValidationResponse = {
        message: 'accepted',
      };
      res.status(202).json(result);
    }
  }
}
