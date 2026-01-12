import { Mic, Paperclip } from "lucide-react";
import React from "react";

const ChatWindow = ({
  client,
  messages,
  message,
  setMessage,
  messageHandlers,
  user,
  onlineUsers = [],
}) => {
  const isClientOnline = client && onlineUsers.includes(client._id);
  return (
    <div className="flex-1  flex flex-col">
      {client ? (
        <div className="flex-1  flex flex-col">
          {/* Chat Header */}
          <div className="bg-white rounded-t-lg  px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
                {client?.name?.split(" ")?.[0]?.[0]}
              </div>
              <div>
                <h1 className="text-[#0A4F48] font-semibold">{client.name}</h1>
                <p className=" text-sm">{client?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className={`w-2 h-2 rounded-full ${
                  isClientOnline ? "bg-green-500" : "bg-gray-400"
                }`}></div>
                <span>{isClientOnline ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 border-20 border-white rounded-b-lg">
            {messages.map((msg, index) => {
              const isMe = msg.sender === user._id;

              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} `}
                >
                  {/* LEFT SIDE (Other user avatar) */}
                  {!isMe && (
                    <div className="w-10 h-10 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {client?.name?.split(" ")?.[0]?.[0]}
                      {client?.name?.split(" ")?.[1]?.[0]}
                    </div>
                  )}

                  {/* MESSAGE CONTENT */}
                  <div className={`max-w-md ${!isMe ? "ml-3" : ""}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-[#E8F5E9] text-gray-800"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <div
                      className={`mt-1 text-[11px] text-gray-500 ${
                        isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(msg.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-b-lg px-6 py-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
              <button className="text-gray-400 hover:text-gray-600 transition">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type something..."
                value={message}
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    messageHandlers();
                  }
                }}
              />
              <button className="text-gray-400 hover:text-gray-600 transition">
                <Mic size={20} />
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className={`bg-[#2D7A6D] text-white px-5 py-2 rounded-lg font-medium transition ${
                  message.trim()
                    ? "hover:bg-[#1f5a4f]"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => messageHandlers()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center w-full h-full">
          select one chat
        </p>
      )}
    </div>
  );
};

export default ChatWindow;
