// NotificationToast.jsx
import { useEffect } from "react";
import useNotification from "../../zustand/useNotification";
import { toast } from "react-hot-toast";

function NotificationToast() {
  const { notifications } = useNotification();

 useEffect(() => {
  if (notifications.length > 0) {
    notifications.forEach((n) =>
      toast.success(`📩 New message from ${n.senderFullname || "Someone"}`)
    );
  }
}, [notifications]);


  return null;
}

export default NotificationToast;
