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
    performer: {
      stream: {
        title: { type: String },
        secretKey: {
          type: String,
        },
        live: { type: Boolean },
        chat: {
          type: Schema.Types.ObjectId,
          ref: 'Chat',
        },
        settings: {
          public: { type: Boolean },
          pricing: { type: Number },
          maxViewers: {
            enabled: { type: Boolean },
            amount: { type: Number },
          },
        },
      },
    },
    balance: {
      chargedBalance: { type: Number, required: true, default: 0 },
      earnedBalance: { type: Number, required: true, default: 0 },
      transactions: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],
    },
    paypal: {
      email: { type: String },
      phoneNumber: { type: String },
    },
    tickets: { type: Schema.Types.ObjectId, ref: 'Performance' },
    lastSeenAt: { type: Date, default: Date.now() },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.pre<UserDocument>('save', function(next) {
  const user = this;
  const userAuth = user.auth;

  if (userAuth.authType === 'local' && user.isModified('auth.type.password')) {
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

UserSchema.pre<Query<UserDocument>>('findOneAndUpdate', function(next) {
  const updateFields = this.getUpdate();

  // Generate a salt and use it to hash the user's password
  if (updateFields.auth.type.password) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(updateFields.auth.type.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        updateFields.auth.type.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function(
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
UserSchema.methods.becomePerformer = async function(): Promise<UserDocument> {
  const user: UserDocument = this;
  user.performer.stream.secretKey = GenerateStreamKey(48);
  user.performer.stream.title = 'My Stream';
  user.performer.stream.settings.public = false;
  return await user.save();
};

UserSchema.statics.validateEmail = function(email: string): boolean {
  return validateEmail(email);
};
UserSchema.statics.GenerateStreamkey = function(length: number): string {
  return GenerateStreamKey(length);
};

export const UserModel: IUserModel = model<UserDocument, IUserModel>(
  'User',
  UserSchema,
);
