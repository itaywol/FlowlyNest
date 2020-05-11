import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpException,
  Inject,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'winston';
import { UserDocument } from 'schemas/user.schema';
import { UserService } from 'user/user.service';
import { RequestWithAuth } from 'user/interfaces/user.interface';

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

/*
 * TODO: if streaming and has planned instance then make that instance and it settings the activeStream
 * TODO: if no planned instance then create instance out of a default settings
 * TODO: on stream done move activeInstance to pastStreams array
 * TODO: AFTER_MVP: support multiple streams per user (for tv providers... etc...) stream key per instance
 */

@Controller('stream')
export class StreamManagerController {
  constructor(
    @Inject('winston') private logger: Logger,
    private userService: UserService,
  ) {}

  @Post('start')
  public async streamStart(@Res() res: Response, @Body() data: RTMPData) {
    const name: string | undefined = data.name;

    const user: UserDocument = await this.userService.getUserByStreamSecret(
      name,
    );
    if (!user) return res.status(401).send();

    const redirectName: string | undefined = user.nickName;
    if (!redirectName) return res.status(401).send();

    user.performer.stream.live = true;
    await user.save();

    this.logger.info(`${redirectName} is streaming`);
    return res.redirect(process.env.RTMP_INNER_URL + redirectName);
  }

  // On Stream End Hook
  // No response needed
  @Post('end')
  public async streamEnd(@Body() data: RTMPData) {
    const name: string | undefined = data.name;
    const user:
      | UserDocument
      | undefined = await this.userService.getUserByStreamSecret(name);
    const redirectName: string | undefined = user.nickName;
    user.performer.stream.live = false;
    await user.save();
    this.logger.info(`${redirectName} has stopped streaming`);
  }

  // Get route to check if user is authenticated
  // For nginx auth_request purposes
  @Get('auth')
  public async auth(@Req() req: RequestWithAuth) {
    if (process.env.WATCHING_STREAM_REQUIRES_AUTH === 'false') return 'ok';
    if (req.user) return 'ok';
    throw new HttpException('Unauthorized', 401);
  }
}
