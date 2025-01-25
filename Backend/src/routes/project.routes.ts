import { Router } from 'express';
import {authMiddleware} from "../middleware/auth"
import { ProjectModel, UserModel, ChatRoom } from '../db/user.db';
const io = require('socket.io'); 

const router = Router();


router.post('/create', authMiddleware, async(req, res)=>{

    const name=req.body.name;
    console.log(name);
    const loogedInUser=await UserModel.findOne({
        //@ts-ignore
        _id: req.userId
    })

    //@ts-ignore
    const userId = loogedInUser._id;

    try {
        console.log(typeof  name);
        console.log(typeof  userId);
        const newProject = await ProjectModel.create({
            name,
            users: [userId]
        })
        console.log("loogedInUser  "+newProject);

        res.status(201).json(newProject);

    } catch (error) {
        throw new Error('An error occured while creating project');
    }
})

//@ts-ignore
router.get('/all',authMiddleware, async(req, res)=>{
    try {

        const loggedInUser = await UserModel.findOne({
            //@ts-ignore
            _id: req.userId
        })
        console.log(loggedInUser);

        const allUserProjects =  await ProjectModel.find({
            //@ts-ignore
            users: req.userId
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        //@ts-ignore
        res.status(400).json({ error: err.message })
    }
    
})


//@ts-ignore
router.put('/add-user', authMiddleware, async (req, res) => {
    try {
        const { projectId, username } = req.body;

        if (!projectId || !username) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Find the logged-in user
        //@ts-ignore
        const loggedInUser = await UserModel.findById(req.userId);
        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the project and check if the logged-in user is the creator or part of the project
        const project = await ProjectModel.findOne({
            _id: projectId,
            $or: [
                { userId: loggedInUser._id }, // Project creator
                { users: loggedInUser._id }   // Existing project member
            ]
        });

        if (!project) {
            return res.status(403).json({ error: 'User is not authorized to add users to this project' });
        }

        // Find the user to be added by username
        const userToAdd = await UserModel.findOne({ username });
        if (!userToAdd) {
            return res.status(404).json({ error: 'User to be added not found' });
        }

        // Add the user to the project
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            {
                $addToSet: {
                    users: userToAdd._id
                }
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({
            message: 'User added successfully',
            project: updatedProject
        });

    } catch (err) {
        console.log(err);
        //@ts-ignore
        res.status(500).json({ error: err.message });
    }
});



router.get('/get-project/:projectId',authMiddleware, async(req, res)=>{
    const { projectId } = req.params;

    try {

        const project = await ProjectModel.findOne({
            _id: projectId
        }).populate('users')

    } catch (err) {
        console.log(err)
        //@ts-ignore
        res.status(400).json({ error: err.message })
    }

    
})

// @ts-ignore
router.post('/send-message', async (req, res) => {
    const { messageContent, sender, projectId } = req.body;
  
    if (!messageContent || !sender || !projectId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      // Check if a chat room for this project exists
      let chatRoom = await ChatRoom.findOne({ projectId });
  
      if (!chatRoom) {
        // If no chat room exists, create a new one
        chatRoom = new ChatRoom({
          projectId,
          messages: [
            {
              sender,
              content: messageContent,
            },
          ],
        });
      } else {
        // If chat room exists, update it by adding the new message
        chatRoom.messages.push({
          sender,
          content: messageContent,
        });
      }
  
      // Update the lastUpdated timestamp
      chatRoom.lastUpdated = new Date();
  
      await chatRoom.save(); // Save the updated or new chat room
  
      // Emit the new message to all connected clients
    //   io.emit('project-message', {
    //     message: messageContent,
    //     sender,
    //     projectId,
    //   });
  
      res.status(200).json({ message: 'Message sent successfully', chatRoom });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ message: 'Error saving message' });
    }
  });




// @ts-ignore
// routes/projects.js (or routes/messages.js)
router.get('/messages:projectId', async (req, res) => {
    const { projectId } = req.query;
  
    try {
      const chatRoom = await ChatRoom.findOne({ projectId }).populate('messages.sender');
      if (!chatRoom) {
        return res.status(404).json({ message: 'Chat room not found' });
      }
      res.status(200).json({ chatRoom });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  });




router.put('/update-file-tree',authMiddleware, async(req, res)=>{
    
})


export default router;