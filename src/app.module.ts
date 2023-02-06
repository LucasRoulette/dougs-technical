import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

@Module({
  imports: [],
  controllers: [ValidationController],
  providers: [ValidationService],
})
export class AppModule {}
