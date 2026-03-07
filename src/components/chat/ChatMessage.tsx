'use client';

import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#1e3a5f] rounded-2xl rounded-br-md'
            : 'bg-[#1a1a1a] rounded-2xl rounded-bl-md'
        }`}
        style={{ color: '#ededed' }}
      >
        {content}
      </div>
    </div>
  );
}
