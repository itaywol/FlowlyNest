import { Resolver, Query } from '@nestjs/graphql';
import { PerformanceService } from './performance.service';
import { Performance } from 'performance/graphql/performance.graphql';

@Resolver(of => Performance)
export class PerformanceResolver {
  constructor(private performanceService: PerformanceService) {}

  @Query(returns => Performance)
  async Performance(): Promise<Performance> {
    return {
      id: 'xxx',
      date: 'xxx',
      duration: 'xxx',
      attending: null,
    };
  }
}
