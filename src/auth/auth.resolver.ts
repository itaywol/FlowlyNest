import { Resolver, Query, Int, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './graphql/auth.graphql';

@Resolver(of => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(returns => Auth)
  async Auth(@Args('id', { type: () => Int }) id: number): Promise<Auth> {
    return { id: 1, username: 'itay', password: 'secret' };
  }
}
