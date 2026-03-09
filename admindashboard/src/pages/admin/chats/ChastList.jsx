import { Search } from "lucide-react";
import React, { useState } from "react";

const ChastList = ({
  clients,
  chatClient,
  client,
  onlineUsers = [],
  unreadCounts = {},
}) => {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-[#0A4F48] font-bold text-lg">Messages</h2>
        <div className="mt-3 flex items-center gap-2 bg-[#F0F4F8] rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search experts"
            className="ml-1 bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        {filteredClients.map((chat, idx) => {
          const unreadCount = unreadCounts[chat?._id] || 0;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 py-3 hover:bg-[#F0F4F8] cursor-pointer transition rounded-xl ${
                client?._id === chat?._id ? "bg-[#EBF3F2]" : ""
              }`}
              onClick={() => chatClient(chat)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#EBF3F2] flex items-center justify-center text-[#0A4F48] text-sm font-bold shrink-0">
                  {chat?.name?.split(" ")?.[0]?.[0]}
                  {chat?.name?.split(" ")?.[1]?.[0]}
                </div>
                {onlineUsers.includes(chat?._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[#0A4F48] font-medium text-sm truncate">
                  {chat.name}
                </h3>
                <p className="text-xs capitalize">{chat?.role}</p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="bg-[#0A4F48] text-white text-[10px] font-semibold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChastList;
