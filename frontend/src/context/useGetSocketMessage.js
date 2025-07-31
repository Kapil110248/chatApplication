import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../zustand/useConversation";
import useNotification from "../zustand/useNotification"; // ✅ optional toast

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const {
    selectedConversation,
    addMessage,
  } = useConversation();

  const { addNotification } = useNotification(); // ✅ for toast

  useEffect(() => {
    const handleNewMessage = (message) => {
      const isSelectedConversation =
        selectedConversation?._id === message.senderId ||
        selectedConversation?._id === message.receiverId;
   console.log("📥 Received message from socket:", message);

      // ✅ Always add to correct conversation
      const conversationId =
        message.senderId === selectedConversation?._id
          ? message.senderId
          : message.receiverId;

      addMessage(conversationId, message);

      // ✅ If not selected conversation, show toast
      if (!isSelectedConversation) {
        addNotification(message);
      }
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, selectedConversation]);
};

export default useGetSocketMessage;
      