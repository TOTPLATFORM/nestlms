import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_ADMIN_KEY } from '../decorators/is-admin.decorator';
import { coreConstant } from '../helpers/coreConstant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = user?.roles?.split(',').map((role) => Number(role)) || [];
    const hasAdminRole = userRoles.includes(coreConstant.ROLES.ADMIN);
    const hasSuperAdminRole = userRoles.includes(
      coreConstant.ROLES.SUPER_ADMIN,
    );
    if (isAdmin && (hasAdminRole || hasSuperAdminRole)) {
      return true;
    }

    return false;
  }
}
