import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../../modules/session/session.service';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['authorization'];

    if (!sessionId) {
      throw new UnauthorizedException('Session ID not found');
    }

    const session = await this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const currentTime = new Date().getTime();
    const sessionTime = new Date(session.updatedAt).getTime();

    // Check if the session has expired (older than 15 minutes)
    if (currentTime - sessionTime > 15 * 60 * 1000) {
      // Remove the expired session
      await this.sessionService.deleteSession(sessionId);
      throw new UnauthorizedException('Session expired');
    }

    // Check if the session belongs to the user
    const userWithSession = await this.usersService.findBySessionId(session.id);
    if (!userWithSession) {
      throw new UnauthorizedException('Invalid session for the user');
    }

    // Update session's last activity time
    session.updatedAt = new Date();
    await this.sessionService.updateSession(session);

    return true;
  }
}
