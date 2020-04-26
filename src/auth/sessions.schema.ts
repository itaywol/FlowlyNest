import { Schema, Document, SchemaTypes } from 'mongoose';

export interface SessionDocument extends Document {
  _id: string;
  expires: Date;
  session: {
    cookie: string;
    passport: {
      userId: string;
    };
  };
}

export const SessionSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
  session: {
    type: {
      cookie: Object,
      passport: {
        userId: SchemaTypes.ObjectId,
      },
    },
    required: true,
  },
});
