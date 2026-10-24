import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';

export default function ChatPanel({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSendMessage
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt) => {
    if (isTyping) return;
    onSendMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-out"
      aria-label="AI Career Adviser Chat"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block leading-tight">AI Career Adviser</span>
            <span className="text-[10px] text-emerald-600 font-medium">Ready for commands</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Close adviser chat"
          aria-label="Close adviser chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] text-xs p-3 rounded-xl leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] mt-1.5 block font-mono ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-slate-200/80 text-slate-500 text-xs px-3.5 py-2.5 rounded-xl rounded-bl-none flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 ml-1">Analyzing fit scores...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 border-t border-slate-100 bg-white/95 flex flex-wrap gap-1.5 text-[11px]">
        <button
          type="button"
          onClick={() => handleQuickPrompt('remove SQL')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors"
        >
          "remove SQL"
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('add Figma, working')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors"
        >
          "add Figma, working"
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('why is #1 my best match')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors"
        >
          "why is #1 my best match"
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('make my plan lighter')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors"
        >
          "make my plan lighter"
        </button>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask adviser (e.g. remove SQL)..."
          className="flex-1 text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors shadow-2xs"
          title="Send message"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
}
