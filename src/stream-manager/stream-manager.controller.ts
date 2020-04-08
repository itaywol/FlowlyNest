import { Controller, Post, Body, Res, Req } from '@nestjs/common';
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
    console.log(JSON.stringify(data));

    return res.redirect('itaywol');
  }

  @Post('stream_end')
  public async streamEnd(@Body() data: RTMPData) {
    console.log(JSON.stringify(data));
  }
}
