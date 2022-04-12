import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Add } from "@material-ui/icons";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AddNewChatDialogBox from "../../components/dailog box/AddNewChatDialogBox";
import DialogBox from "../../components/dailog box/DialogBox";

export default function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [isColor, setColor] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [addChat, setAddChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setIsErrorMessage] = useState("");
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    const noError = () => {
        setIsError(false);
    }

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                user.followings.filter((f) => users.some((u) => u.userId === f))
            );
        });
    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const closeAddChat=async(anotherUserUsername,startingMessage)=>{

        try {
            //closing this first so if error occurs error dialogue box do not overlap with this dialogue box
            setAddChat(false);
            const res1 = await axios.get(`/users?username=${anotherUserUsername}`);
            const conversationDetails = {
                senderId: user._id,
                receiverId: res1.data._id
            }
            const res2 = await axios.post("/conversations", conversationDetails);
            setConversations([res2.data,...conversations]);
            setCurrentChat(res2.data);

            //sending the starting message
            const message = {
                sender: user._id,
                text: startingMessage,
                conversationId: res2.data._id,
            };
            socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId:res1.data._id,
                text: startingMessage,
            });

            try {
                const res = await axios.post("/messages", message);
                setMessages([res.data]);
                setNewMessage("");
            } catch (err) {
                console.log(err);
            }
        }catch(err){
            setIsErrorMessage("No user with the entered username");
            setIsError(true);
            // console.log(err);
        }

    }
    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        <h5 className="addNewChat" onClick={()=>{setAddChat(true)}}>
                            Start a new conversation <AddCircleOutlineOutlinedIcon />
                        </h5>
                        
                        {conversations.map((c) => (
                            <div style={{ backgroundColor: isColor === c ? "#f5f3f3" : "white" }} onClick={() => {
                                    setColor(c); 
                                    setCurrentChat(c);
                                }}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
            <AddNewChatDialogBox open={addChat} closeAddChats={closeAddChat} />
            <DialogBox open={isError} setIsError={noError}
                text={errorMessage} />
        </>
    );
}