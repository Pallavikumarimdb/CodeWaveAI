import 'dotenv/config'
import mongoose, {model, Schema} from "mongoose";


console.log('Environment Variables:', process.env.Mongo_DB);

const mongoDB = process.env.Mongo_DB;

if (!mongoDB) {
  throw new Error('Mongo_DB environment variable is not set');
}


mongoose.connect(mongoDB);


const UserSchema=new Schema({
    username: {type:String, unique:true},
    password: String
})



const projectSchema = new mongoose.Schema({
  name: {
      type: String,
      // lowercase: true,
      required: true,
      trim: true,
      unique: [ true, 'Project name must be unique' ],
  },

  users: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      }
  ],
  fileTree: {
      type: Object,
      default: {}
  },

})



const chatRoomSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', unique: true },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export const UserModel=model("User", UserSchema);
export const ProjectModel = model('Project', projectSchema)