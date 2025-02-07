import { useState, useEffect } from "react";
import axios from "axios";
import CodeWave from "../assets/CodeWaveAI-logo2.webp";
import { useNavigate } from "react-router-dom";
import { Folder, Plus, Users, X, Wand2, ArrowUp, Camera, Package, Figma, Dribbble, Wand } from "lucide-react";
import Button from "../components/Button";
import.meta.env.BACKEND_URL;

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState<
        { _id: string; name: string; users: { length: number }[] }[]
    >([]);
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();

    // Create Project
    async function createProject() {
        try {
            const response = await axios.post(
                `${process.env.BACKEND_URL}/projects/create`,
                { name: projectName || prompt },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setIsModalOpen(false);
            alert("Project created successfully");
            refresh();
            return response.data; // Assuming response contains the created project
        } catch (error) {
            alert("Can't create Project");
            return null;
        }
    }

    // Fetch Projects
    async function refresh() {
        try {
            const response = await axios.get(`${process.env.BACKEND_URL}/projects/all`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            setProjects(response.data.projects);
        } catch (error) {
            alert("Can't find Projects");
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    // Handle AI Prompt Form
    const handlePromptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (prompt.trim()) {
            try {
                const createdProject = await createProject();
                if (createdProject) {
                    navigate(`/builder/${createdProject._id}`, { state: { project: createdProject } });
                }
            } catch (error) {
                alert("Error while creating the project or redirecting.");
            }
        }
    };

    return (
        <div className="min-h-screen  bg-[#0f0f10]">
            {/* Left: Projects List */}
            <div className=" p-8 border-r border-gray-200">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => setIsModalOpen(true)}
                    >
                        <a className="block w-[13rem] xl:mr-8 text-xl font-bold" href='#'>
                            <img className="rounded-full inline-block mr-[10px]" src={CodeWave} width={53} height={20} alt="CodeWaveAI" />
                            CodeWaveAI
                        </a>
                    </button>
                    <Button white
                        onClick={() => setIsModalOpen(true)}
                    >
                        New Project
                    </Button>
                </div>

                {/* Right: AI Prompt Section */}
                <div className="m-auto w-[50%] p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block mb-20   px-4 py-1 border border-slate-700  rounded-full text-white text-sm font-medium">
                            ✨ Invite friends, get free tokens! 🎉
                        </div>
                        <h1 className="text-4xl font-bold text-gray-100 mb-4">CodeWave AI</h1>
                        <p className="text-lg text-gray-300">
                            Describe your dream website, and we'll help you build it step by step.
                        </p>
                    </div>

                    <form onSubmit={handlePromptSubmit} className="p-0 m-0  rounded-lg shadow-lg bg-[#121212]">
                        <div className="relative m-0">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the website you want to build..."
                                className="w-full h-32 p-4 pr-20 focus:ring-2 focus:ring-blue-500 rounded-lg resize-none text-gray-900 rounded-lg group button-css hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                            />
                            <button
                                type="submit"
                                className="absolute bottom-2 right-2 bg-[#242425] border border-gray-300 text-gray-300 mr-2 mb-2 rounded-lg font-medium"
                            >
                                <ArrowUp />
                            </button>
                        </div>

                    </form>

                    <div className="ml-4 mt-6 flex flex-wrap items-start gap-2">
                        <button className="bg-[#121212] border flex border-gray-600 text-gray-300 rounded-3xl px-4 py-1 font-medium">
                            <Camera className="w-5 h-5" />
                            <span className="ml-2 text-sm font-light" >Components</span>
                        </button>
                        <button className="bg-[#121212] border flex border-gray-600 text-gray-300 rounded-3xl px-4 py-1 font-medium">
                            <Package className="w-5 h-5" />
                            <span className="ml-2 text-sm font-light" >Figma Designs</span>
                        </button>
                        <button className="bg-[#121212] border flex border-gray-600 text-gray-300 rounded-3xl px-4 py-1 font-medium">
                            <Figma className="w-5 h-5" />
                            <span className="ml-2 text-sm font-light" >Landing Page</span>
                        </button>
                        <button className="bg-[#121212] border flex border-gray-600 text-gray-300 rounded-3xl px-4 py-1 font-medium">
                            <Dribbble className="w-5 h-5" />
                            <span className="ml-2 text-sm font-light" >Dashboard</span>
                        </button>

                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <Folder className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                    </div>
                ) : (
                    <div className="mt-32 mx-[10%] grid grid-cols-4 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => navigate(`/builder/${project._id}`, { state: { project } })}
                                className="group bg-[#0e0c15] rounded-lg border border-gray-600 min-h-[100px]  cursor-pointer p-6 "
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-100 group-hover:text-blue-600">
                                        {project.name}
                                    </h2>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Users className="w-4 h-4 mr-1" />
                                        {project.users.length}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-100">Click to open project workspace</p>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={createProject} className="p-6">
                                <div className="mb-6">
                                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        id="projectName"
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter project name"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
