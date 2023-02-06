import { ValidationDto } from 'src/model/validation.dto';

export const wrongControlPoint: ValidationDto = {
  movements: [
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
  balances: [
    {
      date: new Date('2012-04-01T18:25:43.511Z'),
      balance: 100,
    },
    {
      date: new Date('2012-04-04T18:25:43.511Z'),
      balance: 150,
    },
    {
      date: new Date('2012-04-07T18:25:43.511Z'),
      balance: 260,
    },
  ],
};
