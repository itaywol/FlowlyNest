import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

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
  @Post('stream_start')
  public async streamStart(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: RTMPData,
  ) {
    return res.redirect('rtmp://127.0.0.1:1935/hls-live/itaywol');
  }

  @Post('stream_end')
  public async streamEnd(@Body() data: RTMPData) {
    console.log(JSON.stringify(data));
  }

  @Get('auth')
  public async auth(@Req() req: Request, @Res() res: Response) {
    console.log(JSON.stringify(req.session));
    if (req.session.user) return res.status(200).send();
    return res.status(401).send();
  }
}
