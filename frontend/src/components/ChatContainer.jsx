import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const ChatContainer = () => {
  const {
    getMessages,
    isMessageLoading,
    messages,
    selectedUser,
    SubscribeToMessage,
    unSubscribeToMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();

  // 🧩 Ref to the messages container
  const messageContainerRef = useRef(null);

  // Fetch messages & subscribe to socket
  useEffect(() => {
    getMessages(selectedUser._id);
    SubscribeToMessage();
    return () => unSubscribeToMessage();
  }, [selectedUser._id, getMessages, SubscribeToMessage, unSubscribeToMessage]);

  // 🔥 Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isMessageLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* ✅ Added ref here */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => {
          const isSent = message.senderID === authUser.message._id;
          const time = new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const senderName = isSent
            ? authUser.message.fullname
            : selectedUser.fullname;
          const avatarSrc = isSent
            ? authUser.message.profilePic || "/avatar-icon.png"
            : selectedUser.profilePic || "/avatar-icon.png";

          return (
            <div
              key={message._id}
              className={`flex flex-col ${
                isSent ? "items-end" : "items-start"
              } mb-4`}
            >
              {/* Sender full name */}
              <span className="text-xs font-medium mb-1 text-gray-500">
                {senderName}
              </span>

              <div className="flex items-end">
                {/* Avatar for received messages */}
                {!isSent && (
                  <div className="mr-2">
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-base-300"
                    />
                  </div>
                )}

                {/* Chat bubble */}
                <div
                  className={`flex flex-col max-w-xs sm:max-w-sm p-2 sm:p-3 rounded-lg shadow-md 
            ${
              isSent
                ? "bg-primary text-primary-content rounded-tr-none"
                : "bg-base-200 text-base-content rounded-tl-none"
            }`}
                >
                  {message.text && <p className="">{message.text}</p>}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="attachment"
                      className="mt-2 rounded-lg max-w-[200px] object-cover"
                    />
                  )}
                </div>

                {/* Avatar for sent messages */}
                {isSent && (
                  <div className="ml-2">
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-base-300"
                    />
                  </div>
                )}
              </div>

              {/* Timestamp below the bubble */}
              <span
                className={`text-[10px] opacity-70 mt-1 ${
                  isSent ? "self-end" : "self-start"
                }`}
              >
                {time}
              </span>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
