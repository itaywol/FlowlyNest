import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  Session,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PerformerService } from 'performer/performer.service';
import { PerformerDocument } from 'schemas/performer.schema';
import { Logger } from 'winston';

// POST data interface for requests from rtmp server
export interface RTMPData {
  addr: string;
  clientid: string;
  app: string;
  flashVer: string;
  swfUrl: string;
  tcUrl: string;
  pageUrl: string;
  name: string;
}

@Controller('stream')
export class StreamManagerController {
  constructor(
    private performerService: PerformerService,
    @Inject('winston') private logger: Logger,
  ) {}

  @Post('start')
  public async streamStart(@Res() res: Response, @Body() data: RTMPData) {
    const name: string | undefined = data.name;

    const performer: PerformerDocument = await this.performerService.getPerformerBySecret(
      name,
    );
    if (!performer) return res.status(401).send();

    const redirectName: string | undefined = performer.user.nickName;
    if (!redirectName) return res.status(401).send();

    performer.stream.live = true;
    await performer.save();

    this.logger.info(`${redirectName} is streaming`);
    return res.redirect(process.env.RTMP_INNER_URL + redirectName);
  }

  // On Stream End Hook
  // No response needed
  @Post('end')
  public async streamEnd(@Body() data: RTMPData) {
    const name: string | undefined = data.name;
    const performer:
      | PerformerDocument
      | undefined = await this.performerService.getPerformerBySecret(name);
    const redirectName: string | undefined = performer.user.nickName;
    performer.stream.live = false;
    await performer.save();
    this.logger.info(`${redirectName} has stopped streaming`);
  }

  // Get route to check if user is authenticated
  // For nginx auth_request purposes
  @Get('auth')
  public async auth(@Session() session: any) {
    if (process.env.WATCHING_STREAM_REQUIRES_AUTH === 'false') return 'ok';
    if (session.user) return 'ok';
    throw new HttpException('Unauthorized', 401);
  }
}
