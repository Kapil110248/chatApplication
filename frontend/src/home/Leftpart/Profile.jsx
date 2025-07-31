import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

const Profile = ({ user, onClose = null }) => {
  const [authUser, setAuthUser] = useAuth();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user.fullname,
    email: user.email,
    password: "",
  });
  const [editing, setEditing] = useState(false);

  const isOwnProfile = authUser?.user?._id === user?._id;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/upload-profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const updatedUser = res.data.user;

      setAuthUser((prev) => {
        const updated = { ...prev, user: updatedUser };
        localStorage.setItem("ChatApp", JSON.stringify(updated));
        return updated;
      });

      if (onClose) onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload profile image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
        formData,
        { withCredentials: true }
      );

      const updatedUser = res.data.user;
      setAuthUser((prev) => {
        const updated = { ...prev, user: updatedUser };
        localStorage.setItem("ChatApp", JSON.stringify(updated));
        return updated;
      });
      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Profile update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">Your Profile</h2>

        <div className="flex justify-center">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-blue-600 shadow-md">
              {user.fullname?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {isOwnProfile && (
          <>
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Change Photo"}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New Password (optional)"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold">{user.fullname}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg font-semibold"
                >
                  Edit Profile
                </button>
              </>
            )}
          </>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
