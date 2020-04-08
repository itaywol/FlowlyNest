import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'user/graphql/user.input';

@ObjectType()
export class Performance {
  @Field(type => String)
  id: string;

  //TODO: add array of performers field
  //HERE

  @Field(type => String, { nullable: false })
  duration: string;

  @Field(type => String, { nullable: false })
  date: string;

  @Field(type => [User], { nullable: true })
  attending: [User];
}
