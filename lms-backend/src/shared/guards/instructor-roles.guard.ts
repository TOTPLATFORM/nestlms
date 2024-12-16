import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { coreConstant } from '../helpers/coreConstant';
import { IS_INSTRUCTOR_KEY } from '../decorators/is-instructor.decorator';

@Injectable()
export class InstructorRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isInstructor = this.reflector.getAllAndOverride<boolean>(
      IS_INSTRUCTOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = user?.roles?.split(',').map((role) => Number(role)) || [];
    const Instructor = userRoles.includes(coreConstant.ROLES.INSTRUCTOR);
    if (isInstructor && Instructor) {
      return true;
    }

    return false;
  }
}
