import { Injectable } from '@nestjs/common';
import { AuthorizeDto } from './dto/session.dto';
import * as crypto from 'crypto';
import { SessionRepository } from './repository/session.repository';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { Session } from './entities/session.entity';
@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository, private readonly usersService: UsersService) {}

  async handleAuthorization(authorizeDto: AuthorizeDto, ipAddr: string) {
    if (authorizeDto.login && authorizeDto.password) {
      return this.checkCredentials(authorizeDto, ipAddr);
    } else {
      return {
        error: true,
        status: 401,
        response: {
          success: 0,
          code: 2,
          message: 'Session or authorization not found. Please execute /authorize.',
        },
      };
    }
  }

  private async checkSid(sid: string) {
    const session = await this.sessionRepository.findOne({ sid });

    if (!session) {
      return {
        error: true,
        status: 401,
        response: {
          success: 0,
          error_code: 2,
          description: 'Session expired. Please re-authorize.',
        },
      };
    }

    // Обновление времени последнего использования сессии
    session.updatedAt = new Date();
    await this.sessionRepository.persistAndFlush(session);

    return {
      error: false,
      response: {
        success: 1,
        sid,
      },
    };
  }

  private async checkCredentials(authorizeDto: AuthorizeDto, ipAddr: string) {
    const user = await this.usersService.findByLogin(authorizeDto.login);
    const passwordMatches = await argon2.verify(user.password, authorizeDto.password);
    if (!passwordMatches) {
      return {
        error: true,
        status: 401,
        response: {
          success: 0,
          error_code: 1,
          description: 'Invalid login or password. Please execute /authorize.',
        },
      };
    }

    if (user.session) {
      await this.sessionRepository.remove(user.session);
    }
    // Генерация нового SID
    const newSid = crypto.randomBytes(16).toString('hex');
    const newSession = this.sessionRepository.create({
      sid: newSid,
      ipAddress: ipAddr,
    });

    newSession.user = user;

    try {
      // Попытка сохранения сессии
      await this.sessionRepository.persistAndFlush(newSession);
    } catch (error) {
      console.error('Ошибка при сохранении сессии:', error);
      return {
        error: true,
        status: 500,
        response: {
          success: 0,
          error_code: 3,
          description: 'Internal server error. Please try again later.',
        },
      };
    }
    return {
      error: false,
      response: {
        success: 1,
        sid: newSid,
      },
    };
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.sessionRepository.findOne({ sid: sessionId });
    if (session) {
      session.updatedAt = new Date();
      await this.sessionRepository.persistAndFlush(session);
      return true;
    }
    return false;
  }

  async getSession(sessionId: string) {
    return this.sessionRepository.findOne({ sid: sessionId });
  }

  async deleteSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({ sid: sessionId });
    return this.sessionRepository.remove(session);
  }

  async updateSession(session: Session) {
    return this.sessionRepository.update(session.id, session);
  }
}
