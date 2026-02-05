import { ArrowLeft, Bell, Menu, Mic, Paperclip } from "lucide-react";
import React from "react";
import Lottie from "lottie-react";
import chatShimmer from "../../../assets/ChatShimmer.json";

const ChatWindow = ({
  client,
  messages,
  message,
  setMessage,
  messageHandlers,
  user,
  onlineUsers = [],
  onBack,
}) => {
  const isClientOnline = client && onlineUsers.includes(client._id);

  return (
    <div className="flex-1 flex flex-col h-full">
      {client ? (
        <div className="flex-1 flex flex-col">
          {/* Mobile Top Bar - Only visible on mobile */}
          <div className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 border-b">
            <button onClick={onBack} className="p-1">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-[#0A4F48] text-lg font-semibold">twofit</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2">
                <Bell size={20} className="text-gray-700" />
              </button>
              <button className="p-2">
                <Menu size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile User Info - Only visible on mobile */}
          <div className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 border-b">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
                {client?.name?.split(" ")?.[0]?.[0]}
                {client?.name?.split(" ")?.[1]?.[0]}
              </div>
              {isClientOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-[#0A4F48] font-semibold text-[15px]">
                {client.name}
              </h2>
              <p className="text-gray-600 text-xs capitalize">{client?.role}</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  isClientOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-green-600 font-medium">
                {isClientOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Desktop Chat Header - Only visible on desktop */}
          <div className="hidden lg:flex bg-white rounded-t-lg px-6 py-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
                {client?.name?.split(" ")?.[0]?.[0]}
              </div>
              <div>
                <h1 className="text-[#0A4F48] font-semibold">{client.name}</h1>
                <p className="text-sm">{client?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isClientOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span>{isClientOnline ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-white lg:bg-gray-50 lg:border-20 lg:border-white lg:rounded-b-lg">
            {messages.map((msg, index) => {
              const isMe = msg.sender === user._id;

              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {/* LEFT SIDE (Other user avatar) - Desktop only */}
                  {!isMe && (
                    <div className="hidden lg:flex w-10 h-10 rounded-full bg-[#D4A5A0] items-center justify-center text-white text-sm font-semibold shrink-0">
                      {client?.name?.split(" ")?.[0]?.[0]}
                      {client?.name?.split(" ")?.[1]?.[0]}
                    </div>
                  )}

                  {/* MESSAGE CONTENT */}
                  <div className={`max-w-[75%] lg:max-w-md ${!isMe ? "lg:ml-3" : ""}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-[#E8F5F3] text-gray-800"
                          : "bg-gray-100 lg:bg-white text-gray-800"
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
          <div className="bg-white lg:rounded-b-lg px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center gap-2 lg:gap-3 bg-gray-50 rounded-xl lg:rounded-lg p-2">
              <button className="text-gray-400 hover:text-gray-600 transition">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type something.."
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
                <Mic size={20} className="lg:text-gray-400 text-white bg-[#0A4F48] rounded-full p-1 w-7 h-7 lg:w-5 lg:h-5 lg:bg-transparent lg:p-0" />
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className={`bg-[#2D7A6D] text-white px-4 lg:px-5 py-2 rounded-xl lg:rounded-lg font-medium transition text-sm ${
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
         <Lottie animationData={chatShimmer}  loop  style={{ width: 600, height: 600 }} autoPlay />
        </p>
      )}
    </div>
  );
};

export default ChatWindow;
