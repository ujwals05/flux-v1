import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const ChatContainer = () => {
  const { getMessages, isMessageLoading, messages, selectedUser } =
    useChatStore();

  const { authUser } = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderID === authUser.message._id
                ? "chat-end"
                : "chat-start"
            }`}
          >
            <div className={`chat-image avatar`}>
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderID === authUser.message._id
                      ? authUser.message.profilePic || "/avatar-icon.png"
                      : selectedUser.profilePic || "/avatar-icon.png"
                  }
                  alt="profilePic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <div className="text-[10px] text-right opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="chat-bubble flex">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))} */}

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
                  {message.text && (
                    <p className="">{message.text}</p>
                  )}
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

              {/* Timestamp below the bubble, aligned to the same side as the bubble */}
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
