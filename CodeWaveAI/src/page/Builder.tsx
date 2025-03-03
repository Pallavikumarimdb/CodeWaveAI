import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { TabView } from '../components/TabView';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import.meta.env.BACKEND_URL;
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
// import CodeWave from "../assets/CodeWaveAI-logo2.webp";
import { Loader } from '../components/Loader';
import { io } from 'socket.io-client';
import EditorMain from '../codeEditor/EditorMain';
// import { GradientLight } from '../components/design/Benefits';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CloudDownload, Rocket } from 'lucide-react';


interface ChatMessage {
  type: 'text' | 'steps';
  sender: string;
  content: string;
  timestamp: number;
  steps?: Step[];
}

export default function Builder() {
  const location = useLocation();
  const { prompt, project } = location.state as { prompt: string, project: any };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const { roomId } = useParams();
  const [chatFlow, setChatFlow] = useState<ChatMessage[]>([]);
  const socketRef = useRef<any>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);


  // Get all steps from chat flow for file processing
  const allSteps = chatFlow
    .filter(msg => msg.type === 'steps')
    .flatMap(msg => msg.steps || []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      query: { projectId: project?._id },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to the project chat');
      socketRef.current.emit('joinRoom', roomId);
    });

    socketRef.current.on('project-message', (data: any) => {
      const newMessage: ChatMessage = {
        type: 'text',
        sender: data.sender,
        content: data.message,
        timestamp: Date.now()
      };
      setChatFlow(prev => [...prev, newMessage]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('project-message');
        socketRef.current.disconnect();
      }
    };
  }, [roomId, project?._id]);


  // Function to handle file changes from EditorMain
  const handleFilesChange = (updatedFiles: FileItem[]) => {
    setFiles(updatedFiles);
  };


  // Handle file updates based on steps
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    let updatedFilePath = null; // Track which file was updated

    allSteps.filter(({ status }) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              });
              updatedFilePath = currentFolder; // Track newly created file
            } else {
              file.content = step.code;
              updatedFilePath = currentFolder; // Track updated file
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    });

    if (updateHappened) {
      setFiles(originalFiles);

      // Update selectedFile reference if it was modified
      if (selectedFile && updatedFilePath === selectedFile.path) {
        const updatedFile = findFileByPath(originalFiles, selectedFile.path);
        if (updatedFile) {
          setSelectedFile(updatedFile);
        }
      } else if (updatedFilePath && !selectedFile) {
        // Auto-select the first file if nothing is selected yet
        const firstFile = findFileByPath(originalFiles, updatedFilePath);
        if (firstFile) {
          setSelectedFile(firstFile);
        }
      }

      setChatFlow(flow => flow.map(msg => {
        if (msg.type === 'steps') {
          return {
            ...msg,
            steps: msg.steps?.map(step => ({
              ...step,
              status: "completed"
            }))
          };
        }
        return msg;
      }));
    }
  }, [chatFlow, files, selectedFile]);

  // Helper function to find a file by path in the file structure
  const findFileByPath = (files: FileItem[], path: string): FileItem | null => {
    for (const file of files) {
      if (file.path === path) {
        return file;
      }
      if (file.type === 'folder' && file.children) {
        const found = findFileByPath(file.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ?
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: { contents: file.content || '' }
            };
          } else {
            return {
              file: { contents: file.content || '' }
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach(file => processFile(file, true));
      return mountStructure;
    };


    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);


  async function init() {
    const response = await axios.post(`${process.env.BACKEND_URL}/auto/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    const initialSteps = parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending" as "pending"
    }));

    setChatFlow([{
      type: 'steps',
      sender: 'system',
      content: 'Initial template setup',
      timestamp: Date.now(),
      steps: initialSteps
    }]);

    setLoading(true);
    const stepsResponse = await axios.post(`${process.env.BACKEND_URL}/auto/ai-talk`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    });

    setLoading(false);

    const aiSteps = parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }));

    setChatFlow(prev => [...prev, {
      type: 'steps',
      sender: 'ai',
      content: stepsResponse.data.response,
      timestamp: Date.now(),
      steps: aiSteps
    }]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(prev => [...prev, {
      role: "assistant",
      content: stepsResponse.data.response
    }]);
  }

  useEffect(() => {
    init();
  }, []);

  const handleSendMessage = async () => {
    if (!userPrompt.trim()) return;

    const timestamp = Date.now();

    if (userPrompt.startsWith('@AI')) {
      setChatFlow(prev => [...prev, {
        type: 'text',
        sender: 'user',
        content: userPrompt,
        timestamp
      }]);

      const newMessage = {
        role: "user" as "user",
        content: userPrompt
      };

      setLoading(true);
      const stepsResponse = await axios.post(`${process.env.BACKEND_URL}/auto/ai-talk`, {
        messages: [...llmMessages, newMessage]
      });
      setLoading(false);

      setLlmMessages(prev => [...prev, newMessage, {
        role: "assistant",
        content: stepsResponse.data.response
      }]);

      const newSteps = parseXml(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as "pending"
      }));

      setChatFlow(prev => [...prev, {
        type: 'steps',
        sender: 'ai',
        content: stepsResponse.data.response,
        timestamp: Date.now(),
        steps: newSteps
      }]);
    } else {
      const token = localStorage.getItem('token');
      try {
        await axios.post(
          `${process.env.BACKEND_URL}/projects/send-message`,
          {
            projectId: roomId,
            messageContent: userPrompt,
            sender: '67948879191ff1a65bb7f492',
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setChatFlow(prev => [...prev, {
          type: 'text',
          sender: '67948879191ff1a65bb7f492',
          content: userPrompt,
          timestamp
        }]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    setPrompt("");
  };


  async function downloadProject() {
    const zip = new JSZip();
    function addFilesToZip(items: FileItem[], path = "") {
      for (const item of items) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        if (item.type === "file") {
          zip.file(fullPath, item.content || "");
        } else if (item.type === "folder" && item.children) {
          addFilesToZip(item.children, fullPath);
        }
      }
    }
    addFilesToZip(files);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "project.zip");
  }

  console.log("Files" + selectedFile?.content + selectedFile?.path);

  return (
    <div className="h-screen bg-[#0E161B] flex flex-col">
      <header className="flex h-16  justify-between items-center bg-gradient-to-r from-teal-900 to-slate-900 border-b border-gray-700 px-6 py-4">
        <div className='rounded-md text-center border border-gray-700 p-2 flex items-center justify-center'>
          <h2 className="text-md font-light w-96 overflow-hidden font-bold rounded-md">
            {prompt || project.name}
          </h2>
        </div>
        <div>
          <a className="block w-[13rem] xl:mr-8 text-xl font-bold font-[cursive]" href='#'>
            {/* <img className="rounded-full inline-block mr-[10px]" src={CodeWave} width={32} height={20} alt="CodeWaveAI" /> */}
            CodeWaveAI
          </a>

        </div>
      </header>

      <div className="flex-1 overflow-y-scroll scrollbar-hidden">
        <div className="h-full grid grid-cols-4 gap-4 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div className=" rounded-lg p-4 h-[87vh]">
              <div className="h-[calc(100%-60px)] overflow-y-scroll scrollbar-hidden">
                <div className="flex-1 overflow-y-auto ">
                  {chatFlow.map((msg, index) => (
                    <div key={index} className="mb-4 bg-[#171717] rounded-lg">
                      {msg.type === 'text' ? (
                        <div className="message flex flex-col p-2 bg-slate-900 w-fit rounded-md">
                          <div className="text-sm text-white">
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className=" p-2 rounded-md">
                          <StepsList
                            steps={msg.steps || []}
                            currentStep={currentStep}
                            onStepClick={setCurrentStep}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {(loading || !templateSet) ? (
                  <Loader />
                ) : (
                  <div className='flex focus:ring-2 focus:ring-blue-500 rounded-lg resize-none text-gray-900 rounded-lg group button-css hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'>
                    <input
                      placeholder="Type @AI to chat with LLM..."
                      value={userPrompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className='p-2 w-full bg-[#141414] rounded-lg focus:outline-none focus:ring-0 text-white'
                    />
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center justify-center p-2 text-white rounded-full"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path
                          d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-slate-700 col-span-3 pt-2 bg-[#171717] rounded-lg shadow-lg h-[calc(100vh-6rem)]">
            <div className="flex pr-6 justify-between items-center">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              <div className='flex gap-4 justify-between items-center'>
              <button
                onClick={downloadProject}
                className="bg-[#3B3B3B] px-3 py-1 mb-2 text-white rounded text-xs flex items-center gap-2"
              >
                <CloudDownload className='w-5 h-5'/>
                Export
              </button>
              <button
                onClick={downloadProject}
                className="bg-[#007ccc] px-3 py-1 mb-2 text-white rounded text-xs flex items-center gap-2"
              >
                <Rocket className='w-5 h-5'/>
                Deploy
              </button>
              </div>

            </div>

            <div className="h-[calc(100%-3rem)] overflow-hidden flex">
              {activeTab === 'code' ? (
                <EditorMain
                  files={files}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onFilesChange={handleFilesChange}
                  //@ts-ignore
                  webContainer={webcontainer}
                />
              ) : (
                <PreviewFrame
                  //@ts-ignore
                  webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
