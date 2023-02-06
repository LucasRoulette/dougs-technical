import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { duplicatedBody } from './samples/duplicated-operation';
import { missingControlPoint } from './samples/missing-control-point';
import { validBody } from './samples/valid-body';
import { wrongControlPoint } from './samples/wrong-control-point';

// Basic e2e tests of the route
describe('ValidationController (e2e)', () => {
  let app: INestApplication;

  // Create a test server
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  // Tests with a correct set of data
  it('Accepts a correct body', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(validBody)
      .expect(202, { message: 'Accepted' });
  });

  // Tests with a bank operation that have duplicated
  it('Throws duplicate error on duplicate', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(duplicatedBody)
      .expect(418, {
        message: 'Duplicate bank operations',
        duplicateBankOperations: [
          {
            id: 2,
            date: '2012-04-03T18:25:43.511Z',
            wording: 'Wording',
            amount: 10,
          },
        ],
      });
  });

  // Error on a control point
  it('Throws mismatch error on bad control point', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(wrongControlPoint)
      .expect(418, {
        message: 'Mismatch on control point',
        failedControlPoint: { date: '2012-04-04T18:25:43.511Z', balance: 150 },
      });
  });

  // Missing control point for one or more bank movements
  it('Throws a missing control error', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(missingControlPoint)
      .expect(418, {
        message: 'Uncontrolled bank operation',
        uncontrolledOperation: {
          id: 4,
          date: '2012-04-06T18:25:43.511Z',
          wording: 'Wording',
          amount: 90,
        },
      });
  });
});
