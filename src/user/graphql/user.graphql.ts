import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => String)
  _id: string;

  @Field(type => String, { nullable: false })
  email: string;

  @Field(type => String, { nullable: false })
  password: string;

  @Field(type => String, { nullable: true })
  firstName?: string;

  @Field(type => String, { nullable: true })
  lastName?: string;

  @Field(type => String, { nullable: true })
  phoneNumber?: string;

  //TODO: change to performer object
  @Field(type => String, { nullable: true })
  performer?: string;

  //TODO: create wallet object
  @Field(type => String, { nullable: true })
  wallet: string;

  //TODO: create performance object
  @Field(type => String, { nullable: true })
  tickets: string;
}