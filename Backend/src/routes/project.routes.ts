import { Router, Request, Response } from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth';
import { ProjectModel, UserModel, ChatRoom } from '../db/schema.db';
import mongoose from 'mongoose';
import { IUser } from '../db/types';

const router = Router();

interface AuthenticatedRequest extends Request {
  userId: mongoose.Types.ObjectId;
}

router.post('/create', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    const loggedInUser = await UserModel.findById(req.userId);
    if (!loggedInUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newProject = await ProjectModel.create({
      name,
      users: [req.userId],
      admin: req.userId,
      createdAt: new Date(),
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
});


router.get('/all', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allUserProjects = await ProjectModel.find({
      users: req.userId,
    }).populate('users', 'username email');

    res.status(200).json({ projects: allUserProjects });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Admin only
router.post('/addUserToProject', async (req: Request, res: Response) => {
  try {
    const { projectId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid project or user ID' });
      return;
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const userToAdd = await mongoose.model<IUser>('User').findById(userId);
    if (!userToAdd) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Use Mongoose `equals()` method for ObjectId comparison
    const userAlreadyInProject = project.users.some((user) => {
      if (user instanceof mongoose.Types.ObjectId) {
        return user.equals(userToAdd.username);
      }
      return false;
    });


    if (userAlreadyInProject) {
      res.status(400).json({ error: 'User is already in the project' });
      return;
    }

    // Add user to project
    //@ts-ignore
    project.users.push(userToAdd._id as mongoose.Types.ObjectId); 




    await project.save();

    res.status(200).json({ message: 'User added to project successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding user to project' });
  }
});


// Get project details
router.get('/get-project/:projectId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      users: req.userId,
    }).populate('users', 'username email');

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project details' });
  }
});


router.post('/send-message', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { messageContent, projectId } = req.body;

    if (!messageContent || !projectId) {
      res.status(400).json({ error: 'Message content and project ID are required' });
      return;
    }

    // Verify user is part of the project
    const project = await ProjectModel.findOne({
      _id: projectId,
      users: req.userId,
    });

    if (!project) {
      res.status(403).json({ error: 'Not authorized to send messages in this project' });
      return;
    }

    let chatRoom = await ChatRoom.findOne({ projectId });
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        projectId,
        messages: [{
          sender: req.userId,
          content: messageContent,
        }],
      });
    } else {
      chatRoom.messages.push({
        sender: req.userId,
        content: messageContent,
        timestamp: new Date(),
      });
    }

    chatRoom.lastUpdated = new Date();
    await chatRoom.save();

    res.status(200).json({ message: 'Message sent successfully', chatRoom });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Get project messages
router.get('/messages/:projectId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    // Verify user is part of the project
    const project = await ProjectModel.findOne({
      _id: projectId,
      users: req.userId,
    });

    if (!project) {
      res.status(403).json({ error: 'Not authorized to view messages' });
      return;
    }

    const chatRoom = await ChatRoom.findOne({ projectId })
      .populate('messages.sender', 'username');

    if (!chatRoom) {
      res.status(200).json({ messages: [] });
      return;
    }

    res.status(200).json({ messages: chatRoom.messages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

export default router;