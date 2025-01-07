import { Router } from 'express';
import {authMiddleware} from "../middleware/auth"
import { ProjectModel, UserModel } from '../db/user.db';

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

router.put('/update-file-tree',authMiddleware, async(req, res)=>{
    
})


export default router;