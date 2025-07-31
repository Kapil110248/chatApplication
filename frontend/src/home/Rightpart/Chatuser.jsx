import React, { useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

function Chatuser() {
  const {
    selectedConversation,
    setSelectedConversation,
    setMessagesForConversation,
  } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedConversation) return null;

  const isOnline = (onlineUsers || []).includes(selectedConversation._id);

  const userName =
    selectedConversation.fullname ||
    selectedConversation.name ||
    selectedConversation.email;

  const profileImage = selectedConversation.profileImage;
  const firstChar = userName?.charAt(0).toUpperCase() || "U";

  const handleAvatarClick = () => {
    if (profileImage) setShowImageModal(true);
  };

  // 🔥 Handle Delete Chat (only for current user)
  const handleDeleteChat = async () => {
    try {
      const res = await axios.delete(
  `${import.meta.env.VITE_BACKEND_URL}/api/message/delete/${selectedConversation._id}`,
  { withCredentials: true }
);


      toast.success("Chat deleted successfully");
      setMessagesForConversation(selectedConversation._id, []);
      setSelectedConversation(null);
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete chat");
    }
  };

  return (
    <>
      <div className="pl-5 pr-5 pt-5 h-[12vh] flex items-center justify-between bg-gray-700 hover:bg-gray-600 duration-300">
        <div className="flex items-center space-x-4">
          <div onClick={handleAvatarClick} className="cursor-pointer">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User"
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-xl">
                {firstChar}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{userName}</h1>
            <span
              className={`text-sm ${isOnline ? "text-green-400" : "text-gray-400"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* 🗑 Delete Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-500 hover:text-red-700 font-bold text-xl"
          title="Delete chat"
        >
          🗑
        </button>
      </div>

      {/* 📸 Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-slate-900 p-4 rounded-lg shadow-xl max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={profileImage}
              alt="Full View"
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      {/* 🧨 Confirm Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-slate-800 p-6 rounded-xl w-[90%] max-w-sm space-y-4 text-white">
            <h2 className="text-lg font-semibold">Delete this chat?</h2>
            <p className="text-sm text-gray-300">
              This will remove the chat only from your side. You won’t be able to see any messages.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatuser;
