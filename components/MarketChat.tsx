"use client";

import React, { useState, useRef, useEffect } from "react";
import { Market, ChatMessage } from "../types";
import { chatAboutMarket } from "../services/geminiService";
import { Button } from "./Button";

interface MarketChatProps {
  market: Market;
}

export const MarketChat: React.FC<MarketChatProps> = ({ market }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Convert internal message format to Gemini history format
    const history = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const responseText = await chatAboutMarket(market, userMsg.text, history);

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "ai",
      text: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl h-[500px] flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-brand-border bg-brand-darker backdrop-blur">
        <h3 className="font-semibold text-text-primary flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Chromarock AI Assistant
        </h3>
        <p className="text-xs text-text-tertiary">
          Ask about {`"${market.title}"`}
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <div className="text-center text-text-tertiary mt-20 text-sm">
            Ask me anything about the odds, related news, or risk factors.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-brand-accent text-white rounded-br-none"
                  : "bg-brand-darker border border-brand-border text-text-primary rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-darker border border-brand-border px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-brand-darker border-t border-brand-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-brand-accent text-sm"
          />
          <Button
            variant="accent"
            size="sm"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
