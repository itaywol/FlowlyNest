import * as mongoose from 'mongoose';

const generateStreamKey = (length: number) => {
  return (
    'perform_' +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, length)
  );
};
export const PerformerSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Performance',
      required: false,
    },
  ],
});
