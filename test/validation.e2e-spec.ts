import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidationResponse } from 'src/model/validation.response';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { duplicatedBody } from './samples/duplicated-operation';
import { allError } from './samples/full-error';
import { missingControlPoint } from './samples/missing-control-point';
import { noControlPoint } from './samples/no-control-point';
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
    const response: ValidationResponse = {
      message: 'accepted',
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(validBody)
      .expect(202, response);
  });

  // Tests with a bank operation that have duplicated
  it('Returns a duplicate error on duplicate', () => {
    const response: ValidationResponse = {
      message: 'refused',
      errorReport: [
        {
          message: 'Duplicate bank operations',
          duplicateBankOperations: [
            {
              id: 2,
              date: new Date('2012-04-03T18:25:43.511Z'),
              wording: 'Wording',
              amount: 10,
            },
          ],
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(duplicatedBody)
      .expect(418, JSON.stringify(response));
  });

  // Error on a control point
  it('Returns mismatch error on bad control point', () => {
    const response: ValidationResponse = {
      message: 'refused',
      errorReport: [
        {
          message: 'Mismatch on control point',
          failedControlPoints: [
            {
              date: new Date('2012-04-04T18:25:43.511Z'),
              balance: 150,
            },
          ],
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(wrongControlPoint)
      .expect(418, JSON.stringify(response));
  });

  // Missing control point for one or more bank movements
  it('Returns a missing control point error', () => {
    const response: ValidationResponse = {
      message: 'refused',
      errorReport: [
        {
          message: 'Uncontrolled bank operations',
          uncontrolledOperations: [
            {
              id: 3,
              date: new Date('2012-04-05T18:25:43.511Z'),
              wording: 'Wording',
              amount: 10,
            },
            {
              id: 4,
              date: new Date('2012-04-06T18:25:43.511Z'),
              wording: 'Wording',
              amount: 90,
            },
          ],
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(missingControlPoint)
      .expect(418, JSON.stringify(response));
  });

  it('Returns error when there is no control point', () => {
    const response: ValidationResponse = {
      message: 'refused',
      errorReport: [
        {
          message: 'Uncontrolled bank operations',
          uncontrolledOperations: [
            {
              id: 1,
              date: new Date('2012-04-02T18:25:43.511Z'),
              wording: 'Wording',
              amount: 50,
            },
            {
              id: 2,
              date: new Date('2012-04-03T18:25:43.511Z'),
              wording: 'Wording',
              amount: 10,
            },
          ],
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(noControlPoint)
      .expect(418, JSON.stringify(response));
  });

  it('Can return multiple errors at once', () => {
    const response: ValidationResponse = {
      message: 'refused',
      errorReport: [
        {
          message: 'Duplicate bank operations',
          duplicateBankOperations: [
            {
              id: 2,
              date: new Date('2012-04-03T18:25:43.511Z'),
              wording: 'Wording',
              amount: 10,
            },
            {
              id: 4,
              date: new Date('2012-04-06T18:25:43.511Z'),
              wording: 'Wording',
              amount: 90,
            },
          ],
        },
        {
          message: 'Uncontrolled bank operations',
          uncontrolledOperations: [
            {
              id: 5,
              date: new Date('2012-04-11T18:25:43.511Z'),
              wording: 'Wording',
              amount: 90,
            },
            {
              id: 6,
              date: new Date('2012-04-12T18:25:43.511Z'),
              wording: 'Wording',
              amount: 90,
            },
          ],
        },
        {
          message: 'Mismatch on control point',
          failedControlPoints: [
            {
              date: new Date('2012-04-04T18:25:43.511Z'),
              balance: 190,
            },
            {
              date: new Date('2012-04-07T18:25:43.511Z'),
              balance: 260,
            },
          ],
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send(allError)
      .expect(418, JSON.stringify(response));
  });
});
