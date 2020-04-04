import { Resolver } from '@nestjs/graphql';
import { PerformerService } from './performer.service';
import { Performer } from 'src/performer/graphql/performer.graphql';

@Resolver(of => Performer)
export class PerformerResolver {
  constructor(private performerService: PerformerService) {}
}
