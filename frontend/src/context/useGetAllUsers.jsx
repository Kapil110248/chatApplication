import { useEffect, useState } from "react";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:4002/api/user/allusers", {
          withCredentials: true, // ✅ Send httpOnly cookie
        });

        console.log("All Users API response:", response.data);

        if (response.data && Array.isArray(response.data.users)) {
          setAllUsers(response.data.users);
        } else {
          setAllUsers([]);
          setError("Unexpected data format from server.");
        }
      } catch (err) {
        console.error("Error in useGetAllUsers:", err);
        setAllUsers([]);
        setError(err.response?.data?.message || err.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return [allUsers, loading, error];
}

export default useGetAllUsers;
