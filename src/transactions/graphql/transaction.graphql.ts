import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(type => String)
  id: string;
}
