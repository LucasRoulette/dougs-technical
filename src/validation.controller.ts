import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ValidationDto } from './model/validation.dto';
import { ValidationService } from './validation.service';

/**
 * Controller that handles the requests to /movements/validation
 */
@Controller('movements')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  /**
   * API route that sends back a 201 when the data is valid
   * @param body bank movements and control points
   * @returns "Accepted" if the data is correct
   */
  @Post('/validation')
  @HttpCode(202)
  public postValidation(@Body() body: ValidationDto): { message: string } {
    this.validationService.validateBankOperations(
      body.movements,
      body.balances,
    );
    return { message: 'Accepted' };
  }
}
