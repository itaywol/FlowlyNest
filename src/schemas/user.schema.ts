import { Model, model, Schema, Query, Document } from 'mongoose';
import { uidSync } from 'uid-ts';
import * as bcrypt from 'bcrypt';
import { User } from 'user/interfaces/user.interface';

export interface UserDocument extends User, Document {
  checkPassword(password: string): Promise<boolean>;
}
export interface IUserModel extends Model<UserDocument> {
  validateEmail(email: string): boolean;
}
function GenerateStreamKey(length: number) {
  const enc: string = uidSync(length);
  return `${process.env.STREAM_KEYS_PREFIX || 'Flowly'}_${enc}`;
}

function validateEmail(email: string) {
  // tslint:disable-next-line:max-line-length
  const expression = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
}

export const defaultStreamSettings = {
  isActiveStreamer: { type: Boolean, require: true, default: false },
  title: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  crowdControl: {
    type: {
      freeForAll: {
        ticketPrice: { type: Number, default: 5 },
        limitViewers: { type: Number, default: 0 },
      },
      list: {
        whiteList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        blackList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      },
    },
    required: true,
  },
  ticketing: {
    type: {
      oneTime: { price: { type: Number, default: 5 } },
      plan: {
        interval: { type: Number, default: 1000 * 60 * 60 * 24 },
        price: { type: Number, default: 10 },
      },
      unlimited: {
        price: { type: Number, default: 50 },
      },
    },
    required: true,
  },
};

export const UserSchema = new Schema(
  {
    auth: {
      type: {
        authType: { type: String, required: true },
        facebook: { type: String, required: false, unique: true },
        password: { type: String, required: false },
      },
      required: true,
    },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    nickName: { type: String, required: true, unique: true },
    secretStreamKey: { type: String },
    streams: {
      activeStream: {
        type: Schema.Types.ObjectId,
        ref: 'Streams',
        default: null,
      },
      futureStreams: {
        type: Schema.Types.ObjectId,
        ref: 'Streams',
        default: null,
      },
      pastStreams: [{ type: Schema.Types.ObjectId, ref: 'Streams' }],
      defaultStreamSettings: defaultStreamSettings,
    },
    wallet: {
      chargedBalance: { type: Number, required: true, default: 0 },
      earnedBalance: { type: Number, required: true, default: 0 },
      transactions: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],
      ownedTickets: [{ type: Schema.Types.ObjectId, ref: 'Tickets' }],
      payouts: {
        method: {
          type: {
            paypal: { email: { type: String }, phoneNumber: { type: String } },
          },
          required: true,
        },
        requests: [
          { submittedAt: { type: Date, default: Date.now() }, amount: Number },
        ],
      },
    },
    lastSeenAt: { type: Date, default: Date.now() },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.pre<UserDocument>('save', function (next) {
  const user = this;
  const userAuth = user.auth;

  if (userAuth.authType === 'local' && user.isModified('auth.password')) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(userAuth.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        userAuth.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.pre<Query<UserDocument>>('findOneAndUpdate', function (next) {
  const updateFields = this.getUpdate();

  // Generate a salt and use it to hash the user's password
  if (updateFields.auth && updateFields.auth.password) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(updateFields.auth.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        updateFields.auth.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function (
  password: string,
): Promise<boolean> {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.auth.type.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};

UserSchema.methods.becomeStreamer = async function (): Promise<UserDocument> {
  const user: UserDocument = this;
  user.streams.isActiveStreamer = true;
  return await user.save();
};

UserSchema.statics.validateEmail = function (email: string): boolean {
  return validateEmail(email);
};
UserSchema.statics.GenerateStreamkey = function (length: number): string {
  return GenerateStreamKey(length);
};

export const UserModel: IUserModel = model<UserDocument, IUserModel>(
  'User',
  UserSchema,
);
