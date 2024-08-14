import { applyDecorators, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../guard/session.guard'; // Adjust the path as needed

export function UseSessionGuard() {
  return applyDecorators(UseGuards(SessionGuard));
}
