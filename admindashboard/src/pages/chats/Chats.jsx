import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectAllClients } from "@/redux/features/client/client.selectors";
import { getAllClients } from "@/redux/features/client/client.thunk";
import { socket } from "@/utils/socket";
import {
  MessageSquare,
  Send,
  Paperclip,
  Mic,
  Search,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Chats() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();
    dispatch(getAllClients());
    return () => socket.disconnect();
  }, []);

  const clients = useSelector(selectAllClients);
  const user =useSelector(selectUser)
  console.log(user)
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
              <span className="bg-[#2D7A6D] text-white text-xs font-bold px-2 py-1 rounded-full">
                7
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 text-gray-600 cursor-pointer hover:bg-[#FAFAFA]">
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
          {
          clients.map((chat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 border-b border-[#F0F0F0] hover:bg-[#FAFAFA] cursor-pointer transition" 
            >
              <div className="w-12 h-12 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white font-semibold flex-shrink-0">
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
      <div className="flex-1 bg-[#F5F5F5] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
              RS
            </div>
            <div>
              <h1 className="text-gray-800 font-semibold">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.role}</p>
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
          {/* Incoming Message with Audio */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A5A0] flex-shrink-0"></div>
            <div>
              <div className="bg-white rounded-2xl px-4 py-3 max-w-xs">
                <div className="flex items-center gap-3">
                  <button className="text-[#2D7A6D] hover:opacity-70">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <span className="text-gray-500 text-xs">11:14 AM</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-gray-500">
                <span>0:20</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#2D7A6D] text-white flex items-center justify-center flex-shrink-0 hover:opacity-90">
              ↓
            </button>
          </div>



          {/* Outgoing Message */}
          <div className="flex gap-3 justify-end">
            <div className="bg-[#E8F5E9] rounded-2xl px-4 py-3 max-w-sm">
              <p className="text-gray-800">This is the body of the message.</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-[#E0E0E0] px-6 py-4 flex items-center gap-3">
          <button className="text-gray-600 hover:text-gray-800">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type something..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-800 outline-none placeholder-gray-500 focus:bg-white focus:ring-1 focus:ring-[#2D7A6D]"
          />
          <button className="text-gray-600 hover:text-gray-800">
            <Mic size={20} />
          </button>
          <button className="bg-[#2D7A6D] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2">
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
