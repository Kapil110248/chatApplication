import React, { useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function Logout() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4002/api/user/logout", // ✅ Fixed: full URL
        {},
        {
          withCredentials: true, // ✅ include cookies
        }
      );

      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");

      setLoading(false);
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error("Error in logging out");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-[4%] bg-slate-950 text-white flex flex-col justify-end">
        <div className="p-3 align-bottom">
          <button disabled={loading}>
            <TbLogout2
              className={`text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleLogout}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default Logout;

