// components/ZaloChatButton.tsx
import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

export default function ZaloChatButton() {
  return (
    <a
      href="https://zalo.me/0961222844"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
    >
      <FaCommentDots className="text-xl" />
      <span className="hidden sm:inline">Chat Zalo</span>
    </a>
  );
}
