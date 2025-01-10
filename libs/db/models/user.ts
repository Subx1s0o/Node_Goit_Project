import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatarURL: string;
  weight: number;
  activeTime: number;
  gender: 'male' | 'female' | 'other';
  dailyNorm: number;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatarURL: {
      type: String,
      required: false,
      default:
        'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
    },
    weight: {
      type: Number,
      required: false
    },
    activeTime: {
      type: Number,
      required: false
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female']
    },
    dailyNorm: {
      type: Number,
      required: false,
      default: 1500
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = model<IUser>('users', userSchema);