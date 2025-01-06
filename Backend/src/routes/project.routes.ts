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

router.put('/add-user',authMiddleware, async(req, res)=>{
    
})

router.get('/get-project/:projectId',authMiddleware, async(req, res)=>{
    
})

router.put('/update-file-tree',authMiddleware, async(req, res)=>{
    
})


export default router;