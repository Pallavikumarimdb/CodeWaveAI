import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface IProject extends Document {
  name: string;
  admin: mongoose.Types.ObjectId;
  users: Types.ObjectId[] | IUser[];
  fileTree: Record<string, any>;
}

export interface IMessage {
  sender: Types.ObjectId | IUser;
  content: string;
  timestamp: Date;
}

export interface IChatRoom extends Document {
  projectId: Types.ObjectId | IProject;
  messages: IMessage[];
  lastUpdated: Date;
}


declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
    }
  }
}
