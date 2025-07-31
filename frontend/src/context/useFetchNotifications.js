// useFetchNotifications.js
import { useEffect } from "react";
import axios from "axios";
import useNotification from "./useNotification";

const useFetchNotifications = () => {
  const setNotifications = useNotification((state) => state.setNotifications);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:4002/api/notifications", {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetch();
  }, []);
};

export default useFetchNotifications;
