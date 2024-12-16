import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { InstructorRolesGuard } from '../guards/instructor-roles.guard';

export const IS_INSTRUCTOR_KEY = 'isInstructor';

export function IsInstructor(): <TFunction>(
  target: object | TFunction,
  propertyKey?: string | symbol,
) => void {
  return applyDecorators(
    SetMetadata(IS_INSTRUCTOR_KEY, true),
    UseGuards(InstructorRolesGuard),
  );
}
