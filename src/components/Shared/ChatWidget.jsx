import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Image } from 'lucide-react';
import avatar from '../../assets/avatar.png';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can we help you today?",
      isAdmin: true,
      timestamp: "Just now"
    }
  ]);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: message,
      isAdmin: false,
      timestamp: "Just now"
    }]);

    // Clear input
    setMessage('');

    // Simulate admin response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Thanks for your message! We'll get back to you soon.",
        isAdmin: true,
        timestamp: "Just now"
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-brand text-white p-4 rounded-full shadow-lg hover:bg-brand/90 transition-transform transform hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-brand text-white rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <img 
                  src={avatar} 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">Waureisen Support</h3>
                <p className="text-sm opacity-90">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.isAdmin 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-brand text-white'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
              />
              <button
                type="submit"
                className={`p-2 rounded-full ${
                  message.trim() 
                    ? 'bg-brand text-white hover:bg-brand/90' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;