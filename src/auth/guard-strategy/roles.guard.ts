import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log({metadatA:this.reflector,roles})
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}

function matchRoles(roles: string[], userRoles: any): boolean {
  let isMatchRole = false
  for (let i = 0; i < roles.length; i++) {
    if (roles.includes(userRoles[i])) {
      isMatchRole = true
      break
    }
  }
  return isMatchRole
}
