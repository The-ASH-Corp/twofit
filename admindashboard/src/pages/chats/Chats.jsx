import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getChat } from "@/redux/features/chat/chat.selecters";
import { getChats } from "@/redux/features/chat/chat.thunk";
import { selectAllClients } from "@/redux/features/client/client.selectors";
import { socket } from "@/utils/socket";
import {
  MessageSquare,
  Send,
  Search,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Chats() {
  const [client, setChatClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = useSelector(selectUser);
  const clients = useSelector(selectAllClients);
  const chats = useSelector(getChat);
  const dispatch = useDispatch();

  const getPrivateRoomId = (u1, u2) => `private:${[u1, u2].sort().join("_")}`;

  useEffect(() => {
    socket.auth = {
      userId: user._id,
      token: localStorage.getItem("token"),
    };

    socket.connect();

    return () => socket.disconnect();
  }, [user._id]);

  const chatClient = (selectedClient) => {
    if (client) {
      const prevRoom = getPrivateRoomId(user._id, client._id);
      socket.emit("leave_room", { roomId: prevRoom });
    }

    const roomId = getPrivateRoomId(user._id, selectedClient._id);

    socket.emit("join_room", { roomId });
    setChatClient(selectedClient);
  };

  const handleBroadcastChat = () => {
    socket.emit("broadcast", {
      roomId: `broadcast_${user._id}`,
    });
  };

  useEffect(() => {
    if (!client) return;

    dispatch(
      getChats({
        page: 1,
        limit: 30,
        chatId: getPrivateRoomId(user._id, client._id),
      })
    );
  }, [client, user._id, dispatch]);

  useEffect(() => {
    if (chats?.messages) {
      setMessages(chats.messages);
    }
  }, [chats]);

  useEffect(() => {
    const onNewMessage = (msg) => {
      if (!client) return;

      const currentRoom = getPrivateRoomId(user._id, client._id);
      if (msg.roomId !== currentRoom) return;

      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", onNewMessage);
    return () => socket.off("new_message", onNewMessage);
  }, [client, user._id]);

  const messageHandlers = () => {
    if (!message.trim() || !client) return;

    const roomId = getPrivateRoomId(user._id, client._id);

    const localMsg = {
      roomId,
      sender: user._id,
      reciever: client._id,
      message,
      time: new Date(),
    };

    // Optimistic UI
    setMessages((prev) => [...prev, localMsg]);

    socket.emit(
      "send_message",
      {
        roomId,
        text: message,
        reciever: client._id,
      },
      (ack) => {
        if (!ack?.ok) console.error("Message failed");
      }
    );

    setMessage("");
  };

  useEffect(() => {
    setMessages([]);
  }, [client]);

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-[#E0E0E0] flex flex-col rounded-xl ">
        <div className="p-6">
          <h2 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-4">
            Category
          </h2>

          {/* Sidebar Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg cursor-pointer hover:bg-[#EFEFEF]">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-gray-400" />
                <span className="text-gray-800 font-medium">Chats</span>
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-3 text-gray-600 cursor-pointer hover:bg-[#FAFAFA]"
              onClick={handleBroadcastChat}
            >
              <MessageCircle size={20} />
              <span className="font-medium">Broadcast</span>
            </div>

            <div className="flex items-center gap-3 p-3 text-gray-600 cursor-pointer hover:bg-[#FAFAFA]">
              <MessageCircle size={20} />
              <span className="font-medium">Auto Reminders</span>
            </div>

            <div className="flex items-center gap-3 p-3 text-gray-600 cursor-pointer hover:bg-[#FAFAFA]">
              <MessageCircle size={20} />
              <span className="font-medium">Delivery Logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Chat List */}
      <div className="w-80 bg-white border-r border-[#E0E0E0] flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 flex items-center bg-[#F5F5F5] rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              />
            </div>
            <button className="p-2 hover:bg-[#F5F5F5] rounded-lg">
              <Settings size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-4 border-b border-[#E0E0E0] pb-2">
            <button className="text-sm font-medium text-white bg-[#2D7A6D] px-3 py-1 rounded">
              All
            </button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
              Clients
            </button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
              Experts
            </button>
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto">
          {clients.map((chat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 border-b border-[#F0F0F0] hover:bg-[#FAFAFA] cursor-pointer transition"
              onClick={() => chatClient(chat)}
            >
              <div className="w-12 h-12 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white font-semibold shrink-0">
                {chat?.name?.split(" ")?.[0]?.[0]}
                {chat?.name?.split(" ")?.[1]?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-gray-800 font-semibold text-sm">
                    {chat.name}
                  </h3>
                </div>
                <p className="text-gray-500 text-xs">{chat.role}</p>
              </div>
              <span className="text-gray-400 text-xs whitespace-nowrap">
                {chat.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Chat Window */}
      {client ? (
        <div className="flex-1 bg-[#F5F5F5] flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
                {client?.name?.split(" ")?.[0]?.[0]}
              </div>
              <div>
                <h1 className="text-gray-800 font-semibold">{client.name}</h1>
                <p className="text-gray-500 text-sm">{client.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Incoming Message and outgoing messages */}
            
            {messages.map((msg, index) => {
              const isMe = msg.sender === user._id;

              return (
                <div
                  key={index}
                  className={`flex w-full mb-3 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* LEFT SIDE (Other user avatar) */}
                  {!isMe && (
                    <div className="w-10 h-10 mr-3 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white font-semibold">
                      {client?.name?.split(" ")?.[0]?.[0]}
                    </div>
                  )}

                  {/* MESSAGE BUBBLE */}
                  <div className="max-w-xs">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        isMe
                          ? "bg-[#E8F5E9] text-gray-800 rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <div
                      className={`mt-1 text-xs text-gray-500 ${
                        isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(msg.time).toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </div>
                  </div>

                  {/* RIGHT SIDE (My avatar) */}
                  {isMe && (
                    <div className="w-10 h-10 ml-3 rounded-full bg-[#2D7A6D] flex items-center justify-center text-white font-semibold">
                      {user?.name?.split(" ")?.[0]?.[0]}
                    </div>
                  )}
                </div>
              );
            })}

           
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-[#E0E0E0] px-6 py-4 flex items-center gap-3">
            {/* <button className="text-gray-600 hover:text-gray-800">
            <Paperclip size={20} />
          </button> */}
            <input
              type="text"
              placeholder="Type something..."
              value={message}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-800 outline-none placeholder-gray-500 focus:bg-white focus:ring-1 focus:ring-[#2D7A6D]"
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* <button className="text-gray-600 hover:text-gray-800">
            <Mic size={20} />
          </button> */}
            {message ? (
              <button
                type="submit"
                className="bg-[#2D7A6D] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2"
                onClick={() => messageHandlers(message)}
              >
                <Send size={16} />
                Send
              </button>
            ) : (
              <button className="bg-[#2D7A6D] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2 cursor-not-allowed">
                <Send size={16} />
                Send
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center w-full h-full">
          select one chat
        </p>
      )}
    </div>
  );
}
