import { Search, Settings } from 'lucide-react'
import React from 'react'

const ChastList = ({ clients, chatClient, client, onlineUsers = [] }) => {
  return (
    <div className="w-80  flex flex-col rounded-lg">
        {/* Search and Filters */}
        <div className="p-4 space-y-4  rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              />
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg">
              <Settings size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto">
          {clients.map((chat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition rounded-lg ${client?._id === chat._id ? "bg-gray-200" : ""}`}
              onClick={() => chatClient(chat)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {chat?.name?.split(" ")?.[0]?.[0]}
                  {chat?.name?.split(" ")?.[1]?.[0]}
                </div>
                {onlineUsers.includes(chat._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#0A4F48] font-medium text-sm truncate"> 
                  {chat.name}
                </h3>
                <p className=" text-xs capitalize ">{chat?.role}</p>
              </div>
              <span className="text-gray-400 text-[10px] whitespace-nowrap">
                01:45 PM
              </span>
            </div>
          ))}
        </div>
      </div>
  )
}

export default ChastList