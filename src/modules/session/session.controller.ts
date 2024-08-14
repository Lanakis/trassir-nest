import { Controller, Post, Body, Ip, Headers, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { AuthorizeDto } from './dto/session.dto';

@Controller('authorize')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async authorize(
    @Body() authorizeDto: AuthorizeDto,
    @Ip() ip: string,
    @Headers('x-forwarded-for') forwardedFor: string,
    @Headers('x-real-ip') realIp: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const clientIp =
      forwardedFor?.split(',').pop() || realIp || req.connection.remoteAddress || req.socket.remoteAddress;
    const result = await this.sessionService.handleAuthorization(authorizeDto, clientIp);

    if (result.error) {
      return res.status(result.status).json(result.response);
    }

    return res.status(200).json(result.response);
  }
}
