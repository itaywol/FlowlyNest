import { ObjectType, InputType, Field } from '@nestjs/graphql';

@ObjectType() 
export class UserDto {
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;

  //TODO: change to performer object
  performer?: string;

  //TODO: create wallet object
  wallet: string;

  //TODO: create performance object
  tickets: string;
}

@ObjectType()
export class User extends UserDto {
  @Field(type => String)
  _id: any;
  
  password: string;
  lastSeenAt: number;
  enabled: boolean;
}

@InputType()
export class CredentialsInput {
  email: string;
  password: string;
}

