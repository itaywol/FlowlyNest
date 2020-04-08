import { Field, Int, ObjectType, Scalar, InputType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => String)
  _id: any;

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

  @Field(type => Number, { nullable: false })
  lastSeenAt: number;

  @Field(type => Boolean, { nullable: false })
  enabled: boolean;
}

@InputType()
export class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

