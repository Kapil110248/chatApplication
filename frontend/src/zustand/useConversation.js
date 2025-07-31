import { create } from "zustand";
import { persist } from "zustand/middleware";

const useConversation = create(
  persist(
    (set) => ({
      selectedConversation: null,

      setSelectedConversation: (selectedConversation) =>
        set({ selectedConversation }),

      messagesMap: {},

      // ✅ Overwrite conversation messages
      setMessagesForConversation: (conversationId, messages) =>
        set((state) => ({
          messagesMap: {
            ...state.messagesMap,
            [conversationId]: Array.isArray(messages) ? messages : [],
          },
        })),

      // ✅ Add a single message to appropriate conversation
      addMessage: (conversationId, message) =>
        set((state) => {
          const existingMessages = state.messagesMap[conversationId] || [];

          // ❌ prevent duplicates (optional)
          const alreadyExists = existingMessages.some(
            (m) => m._id === message._id
          );
          if (alreadyExists) return {}; // do nothing

          return {
            messagesMap: {
              ...state.messagesMap,
              [conversationId]: [...existingMessages, message],
            },
          };
        }),
    }),
    {
      name: "chat-store", // ✅ Saved in localStorage
    }
  )
);

export default useConversation;
