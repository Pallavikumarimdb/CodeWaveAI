import { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/user.context';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { io } from 'socket.io-client';

// Define the Message interface
interface Message {
    sender: string; // Assuming sender is a string (user ID)
    content: string; // The message content
}

const Chat = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const { project } = location.state; // Get project from state
    const { user } = useUserContext(); // Use the custom hook to access user context
    const [messages, setMessages] = useState<Message[]>([]); // Use the Message interface for messages
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token'); // Get the token from local storage
    const socketRef = useRef<any>(null); // Create a ref to store the socket instance

    const { setUser } = useUserContext();

    useEffect(() => {
        // Initialize the socket connection
        socketRef.current = io('http://localhost:3000', {
            auth: {
                token: token,
            },
            query: {
                projectId: project._id,
            },
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to the project chat');
            socketRef.current.emit('joinRoom', roomId); // Emit joinRoom event
        });

        //@ts-ignore
        socketRef.current.on('project-message', (data) => {
            console.log('Received message:', data);
            setMessages((prev) => [...prev, { sender: data.sender, content: data.message }]); // Update messages state
        });

        return () => {
            socketRef.current.off('project-message'); // Clean up the socket event listeners
            socketRef.current.disconnect(); // Disconnect the socket
        };
    }, [roomId, project._id, token]);


    const sendMessage = async () => {
        console.log('User context:', user); // Debug user context

        if (!user || !user._id) {
            console.error("User not logged in or missing `_id`");
            return;
        }

        if (message.trim()) {
            try {
                // Send message to the backend
                const response = await axios.post(
                    `${process.env.BACKEND_URL}/projects/send-message`,
                    {
                        projectId: roomId,
                        messageContent: message,
                        sender: user._id,
                    },
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                // Assuming the backend returns the updated chat room with messages
                const updatedChatRoom = response.data.chatRoom;

                // Update the state with the new messages list from the backend
                setMessages(updatedChatRoom.messages);

                // Clear the input field
                setMessage('');
            } catch (error) {
                //@ts-ignore
                console.error("Error sending message:", error.response?.data || error.message);
            }
        } else {
            console.log("Message is empty, not sending.");
        }
    };


    // useEffect(() => {
    //     // Fetch messages when the component mounts
    //     const fetchMessages = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `${process.env.BACKEND_URL}/projects/messages/${roomId}`,
    //                 {
    //                     headers: {
    //                         Authorization: token,
    //                     },
    //                 }
    //             );
    
    //             // Assuming the response contains the chat room data with messages
    //             const UserExist= localStorage.getItem("User");
    //             setUser(UserExist);
    //             const chatRoom = response.data.chatRoom;
    
    //             // Set the messages in state when fetched
    //             setMessages(chatRoom.messages);
    //         } catch (error) {
    //             console.error("Error fetching messages:", error.response?.data || error.message);
    //         }
    //     };
    
    //     fetchMessages();
    // }, [roomId, token]); // Fetch messages when roomId or token changes
    


    return (
        <div className="min-h-screen flex justify-between bg-gray-800 text-white ">
            <div className="w-[30%] bg-gray-950 h-screen p-4 ml-0  ">
                <h2 className="text-2xl bg-green-700 font-bold mb-6 p-2 rounded-md">Chat Room: {project.name}</h2>
                <div className="messages space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message p-2 flex bg-gray-200 rounded-md ${msg.sender === user.id ? 'ml-auto' : ''}`}>
                            <small className='opacity-65 text-xs'>{msg.sender === 'ai' ? 'AI' : user.email}</small>
                            <div className='text-sm text-black'>
                                <span>{user?._id}</span>
                                {msg.content}</div>
                        </div>
                    ))}
                </div>
                <div className="w-[28%] pb-4 flex absolute bottom-0">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-grow p-3 border border-gray-300 rounded-md"
                    />
                    <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white p-3 rounded-md">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat; 