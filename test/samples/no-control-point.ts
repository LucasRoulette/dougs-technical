import { ValidationDto } from 'src/model/validation.dto';

export const noControlPoint: ValidationDto = {
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
  ],
  balances: [],
};
