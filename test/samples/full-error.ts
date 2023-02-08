import { ValidationDto } from 'src/model/validation.dto';

export const allError: ValidationDto = {
  movements: [
    {
      id: 1,
      date: new Date('2012-04-02T18:25:43.511Z'),
      wording: 'Wording',
      amount: 50,
    },
    {
      id: 4,
      date: new Date('2012-04-06T18:25:43.511Z'),
      wording: 'Wording',
      amount: 90,
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
  balances: [
    {
      date: new Date('2012-04-01T18:25:43.511Z'),
      balance: 110,
    },
    {
      date: new Date('2012-04-04T18:25:43.511Z'),
      balance: 190,
    },
    {
      date: new Date('2012-04-07T18:25:43.511Z'),
      balance: 260,
    },
  ],
};
