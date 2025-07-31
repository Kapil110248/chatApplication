import React from "react";

function Message({ message }) {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  const userId = authUser?.user?._id;
  const isMe = message?.senderId === userId;

  const createdAt = message?.createdAt ? new Date(message.createdAt) : null;
  const formattedTime = createdAt
    ? createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const renderTick = () => {
    if (!isMe) return null;
    if (message?.status === "sent") {
      return <span className="ml-1 text-gray-400">✔</span>;
    } else if (message?.status === "delivered") {
      return <span className="ml-1 text-gray-400">✔✔</span>;
    } else if (message?.status === "seen") {
      return <span className="ml-1 text-blue-500">✔✔</span>;
    }
    return null;
  };

  return (
    <div
      className={`w-full px-4 py-1 flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div className="relative max-w-xs">
        <div
          className={`rounded-2xl px-4 py-2 break-words ${
            isMe ? "bg-blue-600 text-white ml-2" : "bg-gray-700 text-white mr-2"
          }`}
        >
          {/* ✅ Show image if available */}
          {message.image && (
            <img
              src={message.image}
              alt="sent media"
              className="rounded-md mb-2 max-h-64"
            />
          )}

          {/* ✅ Show text message if available */}
          {message.message && <p>{message.message}</p>}
        </div>

        <div
          className={`text-xs mt-1 flex items-center gap-1 ${
            isMe
              ? "text-right text-gray-300 justify-end pr-2"
              : "text-left text-gray-400 pl-2"
          }`}
        >
          {formattedTime}
          {renderTick()}
        </div>
      </div>
    </div>
  );
}

export default Message;
