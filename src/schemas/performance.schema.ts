import * as mongoose from 'mongoose';
export const PerformanceSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  performers: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Performer', required: true },
  ],
  duration: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null,
  },
  date: { type: mongoose.Schema.Types.Date, required: false, default: null },
  attending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
