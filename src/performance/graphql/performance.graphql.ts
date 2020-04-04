import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Auth } from 'src/auth/graphql/auth.graphql';

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

  @Field(type => [Auth], { nullable: true })
  attending: [Auth];
}
