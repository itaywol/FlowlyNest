import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PerformerDocument } from 'schemas/performer.schema';

@Injectable()
export class PerformerService {
  constructor(
    @InjectModel('Performer') private performerModel: Model<PerformerDocument>,
  ) {}

  // TODO: define performer type to return
  // TODO: find user id and create a new performer and assign one to one relation ids
  public async makeUserPerformer(userId: string): Promise<PerformerDocument> {
    const createdPerformer: PerformerDocument = new this.performerModel({
      user: userId,
    });

    try {
      createdPerformer.save();
    } catch (Error) {
      throw new HttpException("Couldn't make performer", 500);
    }

    return createdPerformer;
  }

  public async getPerformerBySecret(
    secret: string,
  ): Promise<PerformerDocument> {
    const performer: PerformerDocument = await this.performerModel
      .findOne({ 'stream.secretKey': secret })
      .populate('user');

    return performer;
  }
}
