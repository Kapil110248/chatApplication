// src/context/useSendMessage.js
import { useState } from "react";
import useConversation from "../zustand/useConversation.js";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, messagesMap, setMessagesForConversation } = useConversation();

  const conversationId = selectedConversation?._id;
  const messages = messagesMap[conversationId] || [];

  const sendMessages = async (formData) => {
    if (!formData || !(formData instanceof FormData)) {
      console.warn("❌ Invalid form data");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:4002/api/message/send/${conversationId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessagesForConversation(conversationId, [...messages, res.data]);
    } catch (error) {
      console.error("🔥 Error in sendMessages:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
