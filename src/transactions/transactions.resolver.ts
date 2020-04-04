import { Resolver } from '@nestjs/graphql';
import { Transaction } from './graphql/transaction.graphql';

@Resolver(of => Transaction)
export class TransactionsResolver {}
