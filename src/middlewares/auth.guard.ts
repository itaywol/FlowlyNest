import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const personalized = this.reflector.get<boolean>(
      'personalized',
      context.getHandler(),
    );

    const id: string = request.params.id || request.body.id || request.query.id;

    const authenticatedFlag = request.session.user !== undefined;
    console.log(authenticatedFlag);
    if (!authenticatedFlag) return false;
    // If resource requires personalization then compare possible ids with req session id , if not then its ok continue
    console.log(typeof id);
    console.log(typeof request.session.user._id);
    const personalizedFlag =
      personalized && personalized === true
        ? id == request.session.user._id
        : true;

    return personalizedFlag;
  }
}
