
import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  X,
  Briefcase,
  Layers,
  Clock,
  Loader2,
  Copy
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "@/redux/features/chat/chat.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { toast } from "react-toastify";
import { ENV } from "../../utils/env";

const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "").replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};

// Helper functions kept same
const getPrivateRoomId = (u1, u2) =>
  `private:${[String(u1), String(u2)].sort().join("_")}`;

const getMessageType = (msg) => {
  if (msg?.messageType) return msg.messageType;
  if (!msg?.mediaUrl) return "text";

  const mimeType = msg?.mediaMeta?.mimeType || "";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "voice";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(msg.mediaUrl)) return "image";
  return "voice";
};

const ExpertLeftSide = ({ expert }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isChatMonitorOpen, setIsChatMonitorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [monitorMessages, setMonitorMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState("");

  const assignedClients = useMemo(
    () =>
      Array.isArray(expert?.assignedUsers)
        ? expert.assignedUsers.filter((client) => client?._id)
        : [],
    [expert?.assignedUsers],
  );

  useEffect(() => {
    if (!isChatMonitorOpen) return;
    if (!selectedClient && assignedClients.length > 0) {
      setSelectedClient(assignedClients[0]);
    }
  }, [isChatMonitorOpen, selectedClient, assignedClients]);

  useEffect(() => {
    if (!isChatMonitorOpen || !expert?._id || !selectedClient?._id) {
      setMonitorMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setChatError("");

      try {
        const roomId = getPrivateRoomId(expert?._id, selectedClient?._id);
        const response = await dispatch(
          getChats({ page: 1, limit: 300, chatId: roomId }),
        ).unwrap();

        if (!isMounted) return;
        setMonitorMessages(Array.isArray(response?.messages) ? response.messages : []);
      } catch (error) {
        if (!isMounted) return;
        setMonitorMessages([]);
        setChatError(
          typeof error === "string" ? error : "Failed to load chat messages",
        );
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isChatMonitorOpen, expert?._id, selectedClient?._id]);

  const closeMonitor = () => {
    setIsChatMonitorOpen(false);
    setSelectedClient(null);
    setMonitorMessages([]);
    setChatError("");
  };

  const handleCopy = (text) => {
    if (text && text !== "N/A") {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  const profileDetails = [
    { label: "Experience", value: `${expert?.experience || 0} Years`, icon: Clock },
    { label: "Clients", value: expert?.assignedUsers?.length || 0, icon: User },
    { label: "Rating", value: `${expert?.avgRating?.toFixed(1) || 0} / 5.0`, icon: Star },
    { label: "Category", value: expert?.specialization?.join(", ") || "N/A", icon: Layers },
  ];

  const contactDetails = [
    { label: "Email", value: expert?.email || "N/A", icon: Mail, copy: true },
    { label: "Phone", value: expert?.phone || "N/A", icon: Phone, copy: true },
    { label: "DOB", value: expert?.dob ? new Date(expert.dob).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Gender", value: expert?.gender || "N/A", icon: User },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] group relative">
      
      {/* Header Background */}
      <div className="relative h-28 bg-linear-to-r from-[#0A4F48] to-[#116D63] overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute top-4 right-4 text-white/10">
          <Briefcase size={80} />
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider backdrop-blur-md border shadow-sm ${
                expert?.isOnline 
                ? "bg-emerald-400/20 text-emerald-50 border-emerald-400/30" 
                : "bg-gray-400/20 text-gray-50 border-gray-400/30"
            }`}>
              {expert?.isOnline ? "Online" : "Offline"}
            </span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 flex flex-col relative shrink-0">
        <div className="-mt-12 mb-3 self-start">
             <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out rotate-3 group-hover:rotate-0">
                <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                    {expert?.image ? (
                        <img src={getFileUrl(expert.image)} alt={expert.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="text-gray-300 w-8 h-8" />
                    )}
                </div>
             </div>
        </div>
        
        <div className="flex flex-col mb-6">
           <h2 className="text-xl font-bold text-[#1E293B] tracking-tight break-words">{expert?.name}</h2>
           <p className="text-xs text-[#64748B] font-medium flex items-center gap-1.5 mt-1">
              <Briefcase size={12} className="text-[#0A4F48]" />
              {expert?.specialization?.join(", ") || "General Expert"}
          </p>
        </div>

        {/* Action Button */}
        {user?.role === "admin" && (
          <button
            onClick={() => setIsChatMonitorOpen(true)}
            className="w-full mb-6 py-2.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
          >
            <MessageSquare size={16} />
            <span>Monitor Chats</span>
          </button>
        )}
      </div>

       {/* Details List */}
       <div className="px-6 pb-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            
            {/* Stats Grid */}
            <div>
               <h3 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-wider mb-3">Professional Stats</h3>
               <div className="grid grid-cols-2 gap-3">
                  {profileDetails.map((item, i) => (
                    <div key={i} className="p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
                       <div className="flex items-center gap-2 mb-1">
                          <item.icon size={12} className="text-[#64748B]" />
                          <span className="text-[10px] text-[#64748B] font-medium">{item.label}</span>
                       </div>
                       <p className="text-sm font-bold text-[#334155]">{item.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Contact Details */}
            <div>
               <h3 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-wider mb-3">Contact Info</h3>
               <div className="space-y-3">
                  {contactDetails.map((item, i) => (
                     <div key={i} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                              <item.icon size={14} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] text-[#94A3B8] font-medium">{item.label}</span>
                              <span className="text-sm font-semibold text-[#334155] break-all line-clamp-1">{item.value}</span>
                           </div>
                        </div>
                        {item.copy && (
                           <button 
                             onClick={() => handleCopy(item.value)}
                             className="opacity-100 lg:opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"
                           >
                              <Copy size={14} className="rotate-90" /> {/* Using Layers as Copy icon replacement if Copy not imported, but keeping it simple */}
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </div>

          </div>
       </div>

      {/* Chat Monitor Modal/Overlay */}
      {isChatMonitorOpen && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
           <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between bg-[#FAFCFF] shrink-0">
              <div>
                 <h3 className="font-bold text-[#1E293B]">Chat Monitor</h3>
                 <p className="text-[11px] text-[#64748B]">View client interactions</p>
              </div>
              <button 
                onClick={closeMonitor}
                className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-red-500 hover:border-red-200 transition-all"
              >
                 <X size={16} />
              </button>
           </div>
           
           <div className="flex-1 flex overflow-hidden">
               {/* Client List */}
               <div className="w-1/3 border-r border-[#F1F5F9] overflow-y-auto bg-[#F8FAFC]">
                   {assignedClients.length === 0 ? (
                       <div className="p-4 text-center text-xs text-gray-400">No clients assigned</div>
                   ) : (
                       assignedClients.map((client) => (
                           <div 
                             key={client._id}
                             onClick={() => setSelectedClient(client)}
                             className={`p-3 border-b border-[#F1F5F9] cursor-pointer hover:bg-white transition-colors ${selectedClient?._id === client._id ? "bg-white border-l-4 border-l-[#0A4F48]" : "border-l-4 border-l-transparent"}`}
                           >
                               <div className="font-semibold text-xs text-[#334155] truncate">{client.name}</div>
                           </div>
                       ))
                   )}
               </div>

               {/* Messages Area */}
               <div className="flex-1 flex flex-col bg-white overflow-hidden">
                   {/* Messages Header */}
                    {selectedClient && (
                        <div className="p-2 border-b border-[#F1F5F9] text-xs font-bold text-center text-[#0A4F48] bg-emerald-50/50">
                            Chat with {selectedClient.name}
                        </div>
                    )}

                   <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]">
                       {isLoadingMessages ? (
                           <div className="flex justify-center items-center h-full">
                               <Loader2 className="animate-spin text-[#0A4F48]" size={24} />
                           </div>
                       ) : chatError ? (
                           <div className="text-center text-red-400 text-xs mt-10">{chatError}</div>
                       ) : monitorMessages.length === 0 ? (
                           <div className="text-center text-slate-300 text-xs mt-10">No messages found</div>
                       ) : (
                           monitorMessages.map((msg, idx) => {
                               const isExpert = msg.sender === expert._id;
                               const type = getMessageType(msg);
                               return (
                                   <div key={idx} className={`flex flex-col ${isExpert ? 'items-end' : 'items-start'} max-w-[85%] ${isExpert ? 'ml-auto' : 'mr-auto'}`}>
                                       <div className={`px-3 py-2 rounded-xl text-xs ${isExpert ? 'bg-[#0A4F48] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'}`}>
                                           {type === 'text' && <p>{msg.content}</p>}
                                           {type === 'image' && (
                                               <img src={getFileUrl(msg.mediaUrl)} alt="attachment" className="max-w-[150px] rounded-lg" />
                                           )}
                                           {type === 'voice' && <span className="italic opacity-80">🎤 Voice Message</span>}
                                       </div>
                                       <span className="text-[10px] text-gray-400 mt-1">
                                           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                       </span>
                                   </div>
                               )
                           })
                       )}
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpertLeftSide;
