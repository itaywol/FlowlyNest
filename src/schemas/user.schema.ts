import { Model, model, Schema, Query, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'user/interfaces/user.interface';
import { Performer } from 'performer/interfaces/performer.interface';

export interface UserDocument extends User, Document {
  performer: Performer;
  password: string;
  lowercaseEmail: string;
  passwordReset?: {
    token: string;
    expiration: Date;
  };

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
    email: {
      type: String,
      required: true,
      unqiue: true,
      validate: validateEmail,
    },
    lowercaseEmail: {
      type: String,
      unique: true,
    },
    password: { type: String, required: true },
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

  user.lowercaseEmail = user.email.toLowerCase();

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre<Query<UserDocument>>('findOneAndUpdate', function(next) {
  const updateFields = this.getUpdate();

  if (updateFields.email) {
    this.update(
      {},
      { $set: { lowercaseEmail: updateFields.email.toLowerCase() } },
    );
  }

  // Generate a salt and use it to hash the user's password
  if (updateFields.password) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(updateFields.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        updateFields.password = hash;
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
    bcrypt.compare(password, user.password, (error, isMatch) => {
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
