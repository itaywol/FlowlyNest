import { Document, Schema, Types } from 'mongoose';

export interface PerformerDocument extends Document {
  password: string;
  lowercaseUsername: string;
  lowercaseEmail: string;
  passwordReset?: {
    token: string;
    expiration: Date;
  };
}

const generateStreamKey = (length: number) => {
  return (
    'perform_' +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, length)
  );
};
export const PerformerSchema = new Schema({
  _id: Types.ObjectId,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stream: {
    title: { type: String, required: true, default: 'my stream' },
    secretKey: {
      type: String,
      required: true,
      default: () => generateStreamKey(32),
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
