import React, { useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import Profile from "../../home/Leftpart/Profile.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";

function User({ user }) {
  if (!user) return null;

  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [authUser] = useAuth();
  const isSelected = selectedConversation?._id === user._id;

  const isOnline = onlineUsers?.includes(user._id);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const isOwnProfile = authUser?.user?._id === user?._id;

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    isOwnProfile ? setShowProfileModal(true) : setShowImageModal(true);
  };

  return (
    <div className="relative">
      <div
        className={`hover:bg-slate-600 duration-300 ${isSelected ? "bg-slate-700" : ""}`}
        onClick={() => setSelectedConversation(user)}
      >
        <div className="flex items-center justify-between space-x-4 px-8 py-3 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10" onClick={handleAvatarClick}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage || undefined}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer">
                  {user.fullname?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full" />
              )}
            </div>
            <div>
              <h1 className="text-white font-semibold">{user.fullname}</h1>
              <span className="text-gray-300 text-sm">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 👤 Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-slate-800 p-6 rounded-lg shadow-xl w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Profile user={user} onClose={() => setShowProfileModal(false)} />
          </div>
        </div>
      )}

      {/* 🖼️ Full Image Modal */}
      {showImageModal && !isOwnProfile && user?.profileImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-slate-900 p-4 rounded-lg shadow-xl max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={user.profileImage}
              alt="Full View"
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
