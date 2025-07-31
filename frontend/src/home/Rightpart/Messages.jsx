import React, { useEffect, useRef } from "react";
import Message from "./Message";
import Loading from "../../components/Loading.jsx";
import useGetMessage from "../../context/useGetMessage.js";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";
import useConversation from "../../zustand/useConversation.js";

function Messages() {
  const { loading } = useGetMessage(); // ✅ only trigger fetch
  useGetSocketMessage(); // ✅ socket listener

  const { selectedConversation, messagesMap } = useConversation();
  const messages = messagesMap[selectedConversation?._id] || [];

  const lastMsgRef = useRef();

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-2"
      style={{ minHeight: "calc(92vh - 8vh)" }}
    >
      {loading ? (
        <Loading />
      ) : messages.length > 0 ? (
        messages.map((message, idx) => (
          <div
            key={message._id || idx}
            ref={idx === messages.length - 1 ? lastMsgRef : null}
          >
            <Message message={message} />
          </div>
        ))
      ) : (
        <p className="text-center mt-[20%] text-white">
          Say Hi to start the conversation
        </p>
      )}
    </div>
  );
}

export default Messages;
