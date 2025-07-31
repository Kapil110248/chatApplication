import React, { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import useSendMessage from "../../context/useSendMessage.js";
import messageSound from "../../assets/notification.mp3/notification.mp3";

function Typesend() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // 👈 image preview
  const fileInputRef = useRef();
  const { loading, sendMessages } = useSendMessage();

  const playSendSound = () => {
    const audio = new Audio(messageSound);
    audio.play().catch((err) => {
      console.warn("Autoplay error:", err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const formData = new FormData();
    formData.append("message", message.trim());
    if (image) {
      formData.append("image", image);
    }

    await sendMessages(formData);
    playSendSound();

    // Clear everything
    setMessage("");
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL); // 👈 show preview
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-2 px-3 py-2 bg-gray-800">
        {/* 👁️ Image Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-md border border-gray-600"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
              }}
              className="absolute top-1 right-1 bg-black text-white px-2 py-0.5 text-xs rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-xl text-white"
          >
            <FaImage />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-full">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-700 w-full py-2 px-3 rounded-xl bg-slate-900 text-white"
            />
          </div>

          <button type="submit" disabled={loading}>
            <IoSend className="text-3xl text-white" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default Typesend;
