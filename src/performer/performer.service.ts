import { Injectable } from '@nestjs/common';
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
  public async makeUserPerformer(userId: string): Promise<string> {
    return '';
  }
}
