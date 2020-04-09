import { ObjectType, InputType, Field } from '@nestjs/graphql';

@InputType()
export class CredentialsInput {
  @Field(type => String)
  email: string;
  @Field(type => String)
  password: string;
}
