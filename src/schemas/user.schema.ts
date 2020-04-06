import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  performerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performer',
    required: false,
  },
  balance: {
    currentBalance: { type: Number, required: true, default: 0 },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' },
    ],
  },
  tickets: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance' },
});
