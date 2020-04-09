import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

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

@Controller('sm')
export class StreamManagerController {
  // On Stream Begin Hook
  // Rewrites stream names and update current live streams
  // TODO: check /stat route and xml parse to get current active live streams checkout nginx-> local.conf -> /stat
  // TODO: find that name(secretStream key in the from performers)
  // TODO: get the performer id of that stream key owner
  // TODO: redirect to the stream url + performer mongoId
  // TODO: if authentication failed should return response 401 to prevent user from streaming
  @Post('stream_start')
  public async streamStart(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: RTMPData,
  ) {
    const name: string | undefined = data.name;
    const redirectName: string | undefined = 'itaywol';

    // if havent found key in the database then unauthorized to stream
    if (name !== 'itay') return res.status(401).send();

    console.log(`${name} has started to stream redirecting to ${redirectName}`);
    return res.redirect(process.env.RTMP_INNER_URL + redirectName);
  }

  // On Stream End Hook
  // No response needed
  @Post('stream_end')
  public async streamEnd(@Body() data: RTMPData) {
    const name: string | undefined = data.name;
    console.log(`${name} has stopped streaming`);
  }

  // Get route to check if user is authenticated
  // For nginx auth_request purposes
  @Get('auth')
  public async auth(@Req() req: Request, @Res() res: Response) {
    if (req.session.user) return res.status(200).send();
    return res.status(401).send();
  }
}
