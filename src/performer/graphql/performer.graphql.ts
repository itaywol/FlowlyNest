import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Performance } from 'performance/graphql/performance.graphql';

@ObjectType()
export class Performer {
  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: false })
  userId: string;

  @Field(type => Performance, { nullable: true })
  performances: [Performance];
}
