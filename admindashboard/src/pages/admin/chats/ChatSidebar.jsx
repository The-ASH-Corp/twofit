import { MessageCircle, MessageSquare } from 'lucide-react'
import React from 'react'
import { LuSend } from 'react-icons/lu'
import { MdOutlineFindInPage } from 'react-icons/md'

const ChatSidebar = ({ clients, handleBroadcastChat, chatClient, client }) => {
  return (
    <div className="w-60 bg-white  flex flex-col rounded-lg ">
        <div className="p-4 ">
          <h2 className="text-gray-500 text-xs font-medium mb-4 px-2">
            Category
          </h2>

          {/* Sidebar Items */}
          <div className="space-y-1 ">
            <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-gray-600" />
                <span className="text-gray-800 text-sm font-medium">Chats</span>
              </div>
              <span className="bg-[#2D7A6D] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {clients.length}
              </span>
            </div>

            <div
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg"
              onClick={handleBroadcastChat}
            >
              <LuSend size={18} />
              <span className="text-sm font-medium">Broadcast</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Auto Reminders</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg">
              <MdOutlineFindInPage size={18} />
              <span className="text-sm font-medium">Delivery Logs</span>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ChatSidebar