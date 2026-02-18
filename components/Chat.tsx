"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I have processed your PDF. Ask me anything about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!input.trim() || isLoading) return;

  //   const userMessage: Message = { role: "user", content: input };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ messages: [...messages, userMessage] }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     const aiMessage: Message = {
  //       role: "assistant",
  //       content: data.content || "Sorry, I couldn't generate a response.",
  //     };
  //     setMessages((prev) => [...prev, aiMessage]);
  //   } catch (error) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: "Sorry, I ran into an error processing that.",
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);


  // 1. Initial State Setup
  const userMessage: Message = { role: "user", content: input };
  const placeholderMessage: Message = { role: "assistant", content: "" };
  setMessages((prev) => [...prev, userMessage, placeholderMessage]);
  setInput("");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    let buffer = ""; // Stores text waiting to be "typed"
    let displayedText = ""; // The text currently visible in UI
    const typingSpeed = 10; // 30ms per character (Decrease to go faster)

    // 2. Typing Timer
    const interval = setInterval(() => {
      if (buffer.length > 0) {
        // Take the first character from the buffer
        const char = buffer[0];
        buffer = buffer.slice(1);
        displayedText += char;

        // Update the UI
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            role: "assistant", 
            content: displayedText 
          };
          return updated;
        });
      }
    }, typingSpeed);

    // 3. Read the Stream
    if (!reader) {
      throw new Error("No response body");
    }
    while (true) {
      const { done, value } = await reader?.read();
      if (done) {
        // Stop the interval once the buffer is empty after the stream ends
        const checkDone = setInterval(() => {
          if (buffer.length === 0) {
            clearInterval(interval);
            clearInterval(checkDone);
            setIsLoading(false);
          }
        }, 100);
        break;
      }
      
      // Add incoming tokens to the buffer
      buffer += decoder.decode(value, { stream: true });
    }

  } catch (error) {
    console.error("Streaming Error:", error);
    setIsLoading(false);
  }
};
  return (
    <div className="flex flex-col min-h-screen w-full  bg-transparent border border-slate-800 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex items-center gap-2">
        <Bot className="text-blue-400" />
        <h2 className="text-white font-semibold">PDF Assistant</h2>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`whitespace-pre-wrap p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none"}`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="animate-spin text-blue-400" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-600 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
