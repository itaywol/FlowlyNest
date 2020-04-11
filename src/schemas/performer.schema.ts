import { Document, Schema, Types } from 'mongoose';
import { Performer } from 'performer/interfaces/performer.interface';
import { uidSync } from 'uid-ts';

export interface PerformerDocument extends Performer, Document {
  _id: any;
  live: boolean;
}

function GenerateStreamKey(length: number) {
  const enc: string = uidSync(length);
  return `${process.env.STREAM_KEYS_PREFIX || 'Performa'}_${enc}`;
}

export const PerformerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  stream: {
    title: { type: String, required: true, default: 'my stream' },
    secretKey: {
      type: String,
      required: true,
      default: GenerateStreamKey(48),
    },
    live: { type: Boolean, default: false },
  },
  performances: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Performance',
      required: false,
    },
  ],
});

PerformerSchema.statics.GenerateStreamKey = function(length: number): string {
  return GenerateStreamKey(length);
};
