import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getChat } from "@/redux/features/chat/chat.selecters";
import { getChats } from "@/redux/features/chat/chat.thunk";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatSidebar from "./ChatSidebar";
import ChastList from "./ChastList";
import ChatWindow from "./ChatWindow";
import Templates from "./Templates";
import CreateBroadcast from "./CreateBroadcast";
import AutoReminders from "./AutoReminders";
import { getAllCoachesByAdminId } from "@/redux/features/admins/admin.thunk";
import { selectAllCoaches } from "@/redux/features/coach/coach.selector";

export default function Chats() {
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchAllExperts();
    socket.auth = {
      userId: user._id,
      token: localStorage.getItem("token"),
    };

    socket.connect();

    // Listen for online users updates
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    // Request current online users
    socket.emit("get_online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
      socket.disconnect();
    };
  }, [user?._id]);

  const [client, setChatClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const clients = useSelector(selectAllCoaches);

  const fetchAllExperts=()=>{
    dispatch(getAllCoachesByAdminId({adminId:user._id,page:1,limit:100}))
  }

  const chats = useSelector(getChat);
  const dispatch = useDispatch();

  const getPrivateRoomId = (u1, u2) => `private:${[u1, u2].sort().join("_")}`;


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
  }, [client, user?._id, dispatch]);

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
  }, [client, user?._id]);

  const messageHandlers = () => {
    if (!message.trim() || !client) return;

    const roomId = getPrivateRoomId(user._id, client._id);

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

  const [sideTab, setSideTab] = useState("Chats");
  const handleSideTabs = (tabName) => {
    setSideTab(tabName);
  };

  return (
    <div className="flex h-[calc(100vh-120px)]  gap-5">
      {/* Left Sidebar */}
      <ChatSidebar
        clients={clients}
        handleSideTabs={handleSideTabs}
        sideTab={sideTab}
      />

      {/* Right - Content based on tab */}
      {sideTab === "Templates" ? (
        <Templates />
      ) : sideTab === "Create Broadcast" ? (
        <CreateBroadcast onCancel={() => handleSideTabs("Chats")} />
      ) : sideTab === "Auto Reminders" ? (
        <AutoReminders />
      ) : (
        <>
          {/* Center - Chat List */}
          <ChastList
            clients={clients}
            chatClient={chatClient}
            client={client}
            onlineUsers={onlineUsers}
          />

          {/* Right - Chat Window */}
          <ChatWindow
            client={client}
            messages={messages}
            message={message}
            setMessage={setMessage}
            messageHandlers={messageHandlers}
            user={user}
            onlineUsers={onlineUsers}
          />
        </>
      )}
    </div>
  );
}
