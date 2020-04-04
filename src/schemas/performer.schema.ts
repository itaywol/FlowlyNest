import * as mongoose from 'mongoose';
export const PerformerSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Performance',
      required: false,
    },
  ],
});
