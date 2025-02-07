import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import CodeWave from "../assets/CodeWaveAI-logo2.webp";
import { io } from 'socket.io-client';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';

interface Message {
  sender: string;
  content: string;
}

interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

const Builder = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { project, prompt } = location.state;


  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  // const [userInput, setUserInput] = useState('');
  const socketRef = useRef<any>(null);

  // LLM states
  const [llmMessages, setLlmMessages] = useState<LLMMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  // Builder states
  const webcontainer = useWebContainer();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);

  const token = localStorage.getItem('token');

  // Socket connection setup
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      query: { projectId: project?._id },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to the project chat');
      socketRef.current.emit('joinRoom', roomId);
    });

    socketRef.current.on('project-message', (data: any) => {
      setMessages(prev => [...prev, { sender: data.sender, content: data.message }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('project-message');
        socketRef.current.disconnect();
      }
    };
  }, [roomId, project?._id, token]);

  // Initialize template and first LLM response
  useEffect(() => {
    const init = async () => {
      const response = await axios.post(`${process.env.BACKEND_URL}/template`, {
        prompt: prompt.trim()
      });
      setTemplateSet(true);

      const { prompts, uiPrompts } = response.data;
      setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending"
      })));

      setLoading(true);
      const stepsResponse = await axios.post(`${process.env.BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      });
      setLoading(false);

      const initialLLMMessages = [...prompts, prompt].map(content => ({
        role: "user" as const,
        content
      }));

      setLlmMessages([
        ...initialLLMMessages,
        { role: "assistant", content: stepsResponse.data.response }
      ]);

      setSteps(s => [
        ...s,
        ...parseXml(stepsResponse.data.response).map(x => ({
          ...x,
          status: "pending" as const
        }))
      ]);
    };

    init();
  }, [prompt]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (message.startsWith('@AI')) {
      // Handle LLM message
      setLoading(true);
      try {
        const newMessage = { role: "user" as const, content: message.slice(1) };
        const stepsResponse = await axios.post(`${process.env.BACKEND_URL}/chat`, {
          messages: [...llmMessages, newMessage]
        });

        setLlmMessages(prev => [
          ...prev,
          newMessage,
          { role: "assistant", content: stepsResponse.data.response }
        ]);

        setSteps(prev => [
          ...prev,
          ...parseXml(stepsResponse.data.response).map(x => ({
            ...x,
            status: "pending" as const
          }))
        ]);
      } catch (error) {
        console.error('Error processing LLM request:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle regular chat message
      const token = localStorage.getItem('token');
      if (message.trim()) {
        try {
          const response = await axios.post(
            `${process.env.BACKEND_URL}/projects/send-message`,
            {
              projectId: roomId,
              messageContent: message,
              sender: '67948879191ff1a65bb7f492',
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          // Assuming the backend returns the updated chat room with messages
          const updatedChatRoom = response.data.chatRoom;

          setMessages(updatedChatRoom.messages);
          setMessage('');
        } catch (error) {
          //@ts-ignore
          console.error("Error sending message:", error.response?.data || error.message);
        }
      } else {
        console.log("Message is empty, not sending.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f10]  flex flex-col">
      <header className="flex justify-between items-center bg-[#0e0c15]  border-b border-gray-700 px-6 py-4">
        <div>
        <h2 className="text-2xl w-96 overflow-hidden font-bold rounded-md">{prompt || project.name}</h2>
        </div>
        <div>
        <a className="block w-[13rem] xl:mr-8 text-xl font-bold" href='#'>
          <img className="rounded-full inline-block mr-[10px]" src={CodeWave} width={32} height={20} alt="CodeWaveAI" />
          CodeWaveAI
        </a>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-4 p-6">
          {/* Chat and Steps Section */}
          <div className="col-span-1 space-y-6 overflow-auto">
            <div className="bg-[#0e0c15] rounded-lg p-4 h-[87vh]">
              <div className="h-[calc(100%-60px)] overflow-hidden flex flex-col">

                <div className="max-h-[30vh] overflow-y-auto mt-2">
                  <StepsList
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                  />
                </div>


                <div className="flex-1 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="message flex flex-col p-2 bg-slate-900 w-fit rounded-md mb-2"
                    >
                      <div className="text-sm text-white">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="flex gap-2 mt-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type @AI to use LLM, or just chat"
                  className="flex-grow p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="p-2 bg-blue-600 text-white rounded-md"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* File Explorer */}
          <div className="rounded-lg border border-slate-700 col-span-1">
            <FileExplorer
              files={files}
              onFileSelect={setSelectedFile}
            />
          </div>
          {/* Code Editor/Preview */}
          <div className="border border-slate-700 col-span-2 bg-[#0f0f10] rounded-lg shadow-lg p-4 h-[calc(100vh-6rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                //@ts-ignore
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;