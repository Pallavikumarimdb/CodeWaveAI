import {useState, useEffect} from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import.meta.env.BACKEND_URL;

export default function Home() {

    const [ismodelOpen, setIsModelOpen] = useState(false);
    const [projectName, setProjectName] = useState("")
    const [project, setProject] = useState([])

    const navigate = useNavigate();



    //@ts-ignore
   async function createProject(e) {
        e.preventDefault()

       try {
        console.log(projectName)
        await axios.post(process.env.BACKEND_URL+"/projects/create" ,
            {
                name: projectName,
            },
            {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
        })
        setIsModelOpen(false)
        alert("Project created successfully")        
       } catch (error) {
        alert("Can't create Project")
       }
        
    }


    async function refresh() {
        try {
            const response = await axios.get(`${process.env.BACKEND_URL}/projects/all`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            console.log(response);
            setProject(response.data.projects);
        } catch (error) {
            console.error("Can't find Projects", error);
            alert("Can't find Projects");
        }
    }

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 10 * 1000); // Refresh content every 10 seconds

        return () => {
            clearInterval(interval);
        };
    }, []);

     




  return (
    <main className='p-4'>
        <div className="projects gap-3">

            <div className='max-w-96 m-auto '>
            <button
                onClick={() => setIsModelOpen(true)}
                className="project p-4 border border-slate-300 rounded-md">
                New Project
                <i className="ri-link ml-2"></i>
            </button>
            </div>


            <div className='max-w-96 m-auto'>
            {
                project.map((project) => (
                        //@ts-ignore
                    <div key={project._id}
                        onClick={() => {
                            navigate(`/project`, {
                                state: { project }
                            })
                        }}
                        className="project flex flex-col gap-2 mt-10 cursor-pointer p-4 border border-slate-300 rounded-md hover:bg-slate-200">
                        <h2
                            className='font-semibold'
                                //@ts-ignore
                        >{project.name}</h2>
{/* 
                        <div className="flex gap-2">
                            <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                            {project.users.length}
                        </div> */}

                    </div>
                ))
            }
            </div>


        </div>

        {ismodelOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                    <h2 className="text-xl mb-4">Create New Project</h2>
                    <form onSubmit={createProject}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Project Name</label>
                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModelOpen(false)}>Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )}


    </main>
)
}
