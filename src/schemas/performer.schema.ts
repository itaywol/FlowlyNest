import { Document, Schema } from 'mongoose';
import { Performer } from 'performer/interfaces/performer.interface';
import { uidSync } from 'uid-ts';

export interface PerformerDocument extends Performer, Document {
  _id: any;
  paypal: {
    email: string;
    phoneNumber: string;
  };
  stream: {
    title: string;
    secretKey: string;
    live: boolean;
    settings: {
      pricing: number;
    };
  };
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
  paypal: {
    email: { type: String },
    phoneNumber: { type: String },
  },
  stream: {
    title: { type: String, required: true, default: 'my stream' },
    secretKey: {
      type: String,
      required: true,
      default: GenerateStreamKey(48),
    },
    live: { type: Boolean, default: false },
    settings: {
      public: { type: Boolean, default: false },
      pricing: { type: Number, default: 10 },
      maxViewers: {
        enabled: { type: Boolean, default: true },
        amount: { type: Number, default: 8 },
      },
    },
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
