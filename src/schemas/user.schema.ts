import { Model, model, Schema, Query, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'user/interfaces/user.interface';
import { Performer } from 'performer/interfaces/performer.interface';

export interface UserDocument extends User, Document {
  performer: Performer;

  checkPassword(password: string): Promise<boolean>;
}
export interface IUserModel extends Model<UserDocument> {
  validateEmail(email: string): boolean;
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
    phoneNumber: { type: String, required: false },
    performer: {
      type: Schema.Types.ObjectId,
      ref: 'Performer',
      required: false,
    },
    balance: {
      currentBalance: { type: Number, required: true, default: 0 },
      transactions: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],
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

UserSchema.pre<Query<UserDocument>>('findOneAndUpdate', function(next) {
  const updateFields = this.getUpdate();

  // Generate a salt and use it to hash the user's password
  if (updateFields.auth.password) {
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

UserSchema.methods.checkPassword = function(
  password: string,
): Promise<boolean> {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.auth.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};

UserSchema.statics.validateEmail = function(email: string): boolean {
  return validateEmail(email);
};

export const UserModel: IUserModel = model<UserDocument, IUserModel>(
  'User',
  UserSchema,
);
