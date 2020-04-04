import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(type => Int)
  id: number;

  @Field({ nullable: false })
  username?: string;

  @Field({ nullable: false })
  password?: string;

  @Field(type => String)
  performerId?: string;
}
