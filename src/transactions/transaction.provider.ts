import { TRANSACTION_MODEL, DATABASE_PROVIDER } from 'src/constants';
import { Connection } from 'mongoose';
import { TransactionSchema } from 'src/schemas/transaction.schema';

export const transactionProvider = [
  {
    provide: TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Transactions', TransactionSchema),
    inject: [DATABASE_PROVIDER],
  },
];
