import React from "react";
import Search from "./Search";
import Users from "./Users";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

function Left() {
  const [authUser] = useAuth();
  const user = authUser?.user;

  return (
    <div className="w-[30%] bg-black text-gray-300">
      <h1 className="font-bold text-3xl p-2 px-11">Chats</h1>

      {/* User's own profile section */}
      <Link
        to="/profile"
        className="flex items-center space-x-4 p-4 border-b border-slate-700 hover:bg-slate-800 duration-200"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold">
            {user?.fullname?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{user?.fullname}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </Link>

      <Search />
      <div
        className="flex-1 overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
    </div>
  );
}

export default Left;
