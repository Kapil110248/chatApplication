import React from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import { useSocketContext } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthProvider"; // ✅ import auth

function Users() {
  const [allUsers, loading, error] = useGetAllUsers();
  const { onlineUsers } = useSocketContext();
  const [authUser] = useAuth(); // ✅ get logged-in user

  return (
    <div>
      <h1 className="px-8 py-2 text-white font-semibold bg-slate-800 rounded-md">
        Messages
      </h1>
      <div
        className="py-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(84vh - 10vh)" }}
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : error ? (
          <p className="text-red-500 px-4">Error: {error}</p>
        ) : Array.isArray(allUsers) && allUsers.length > 0 ? (
          allUsers
            .filter((user) => user._id !== authUser?.user?._id) // ✅ exclude self
            .map((user, index) => (
              <User key={user._id || index} user={user} onlineUsers={onlineUsers} />
            ))
        ) : (
          <p className="text-gray-500 px-4">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Users;
