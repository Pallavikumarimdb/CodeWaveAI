import mongoose, { Schema } from 'mongoose';
import { IUser, IProject, IChatRoom } from './types';
import 'dotenv/config'



console.log('Environment Variables:', process.env.Mongo_DB);
const mongoDB = process.env.Mongo_DB;
if (!mongoDB) {
  throw new Error('Mongo_DB environment variable is not set');
}


mongoose.connect(mongoDB);


const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    unique: true,
    required: true 
  },
  password: { 
    type: String,
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
});

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  admin: { type:Schema.Types.ObjectId, ref: 'User' },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  fileTree: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const ChatRoomSchema = new Schema<IChatRoom>({
  projectId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    unique: true 
  },
  messages: [{
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    content: String,
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  }],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
