import { useEffect, useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation.js";

function useGetMessage() {
  const { selectedConversation, setMessagesForConversation, messagesMap } = useConversation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      // ✅ Don't refetch if already in map
      if (messagesMap[selectedConversation._id]) return;

      try {
        setLoading(true);
        // ✅ Correct API route
        const res = await axios.get(`/api/messages/get/${selectedConversation._id}`);
        setMessagesForConversation(selectedConversation._id, res.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
        setMessagesForConversation(selectedConversation._id, []);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id]);

  return {
    loading,
    messages: selectedConversation?._id ? messagesMap[selectedConversation._id] || [] : [],
  };
}

export default useGetMessage;
