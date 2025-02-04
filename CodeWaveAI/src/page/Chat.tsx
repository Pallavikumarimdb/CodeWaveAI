import { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/user.context';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { io } from 'socket.io-client';

interface Message {
    sender: string;
    content: string; 
}

const Chat = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const { project } = location.state;
    const [messages, setMessages] = useState<Message[]>([]); 
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token'); 
    const socketRef = useRef<any>(null); 
    useEffect(() => {
        socketRef.current = io('http://localhost:3000', {
            auth: {
                token, 
            },
            query: {
                projectId: project?._id, 
            },
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to the project chat');
            socketRef.current.emit('joinRoom', roomId);
        });

        //@ts-ignore
        socketRef.current.on('project-message', (data) => {
            console.log('Received message:', data);
            setMessages((prev) => [...prev, { sender: data.sender, content: data.message }]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('project-message');
                socketRef.current.disconnect();
            }
        };
    }, [roomId, project?._id, token]); // Dependencies include roomId, project._id, and token


    const sendMessage = async () => {

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
    };



    return (
        <div className="min-h-screen flex justify-between bg-gray-800 text-white ">
            <div className="w-[30%] bg-gray-950 h-screen p-4 ml-0  ">
                <h2 className="text-2xl bg-slate-700 font-bold mb-2 p-2 rounded-md">Chat Room: {project.name}</h2>
                {/* <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-10">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message p-2 flex bg-gray-200 rounded-md  'ml-auto' : ''}`}>
                            <div className='text-sm text-black'>
                                {msg.content}</div>
                        </div>
                    ))}
                </div> */}

                <div className="conversation-area flex-grow flex flex-col h-[600px] rounded-lg overflow-hidden  relative">
                    <div
                        className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={` message flex flex-col p-2 bg-slate-900 w-fit rounded-md`}>
                                <div className='text-sm'>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[28%] pt-10 mb-4 flex absolute bottom-0">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                    />
                    <button onClick={sendMessage} className=" border-gray-300  w-8 text-white rounded-md">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#0d6fe8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat; 