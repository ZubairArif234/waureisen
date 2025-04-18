import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../utils/LanguageContext';
import { isAuthenticated, getUserType, getCurrentUserId } from '../../utils/authService';
import { initSocket, getSocket, sendMessage, addEventListener, removeEventListener, markMessagesAsRead } from '../../utils/socketService';
import { getChatHistory, getUnreadCount } from '../../api/chatAPI';
import avatar from '../../assets/avatar.png';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false); // Track sending state
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  
  // To track temporary message IDs to avoid duplication
  const tempMessageIdsRef = useRef(new Set());

  // Initialize socket and fetch chat history when component mounts
  useEffect(() => {
    if (isAuthenticated() && getUserType() === 'user') {
      initSocket();
      fetchUnreadCount();
    }
    
    return () => {
      // Clean up event listeners
      const socket = getSocket();
      if (socket) {
        removeEventListener('new-message', handleNewMessage);
        removeEventListener('messages-read', handleMessagesRead);
      }
    };
  }, []);

  // Set up socket event listeners when chat opens
  useEffect(() => {
    if (isOpen && isAuthenticated() && getUserType() === 'user') {
      // Fetch chat history
      fetchChatHistory();
      
      // Add socket event listeners
      addEventListener('new-message', handleNewMessage);
      addEventListener('messages-read', handleMessagesRead);
      
      // Mark messages as read when opening chat
      if (unreadCount > 0) {
        markMessagesAsRead('admin');
        setUnreadCount(0);
      }
    }
  }, [isOpen]);

  // Auto scroll to bottom of messages when they change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fetch unread count periodically
  useEffect(() => {
    let interval;
    
    if (isAuthenticated() && getUserType() === 'user' && !isOpen) {
      interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  // Fetch chat history from the API
  const fetchChatHistory = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const history = await getChatHistory(userId);
      
      // Clear temp message IDs when loading history
      tempMessageIdsRef.current.clear();
      
      // Format messages for the UI
      const formattedMessages = history.map(msg => ({
        id: msg.id,
        text: msg.content,
        isAdmin: msg.senderType === 'Admin',
        timestamp: formatTimestamp(msg.timestamp)
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      
      // Show a friendly error message to the user
      setMessages([
        {
          id: 'error',
          text: t('error_loading_chat_history') || 'Error loading chat history',
          isAdmin: true,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!userId) return;
    
    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Handle new message from socket
  const handleNewMessage = (message) => {
    console.log('Received message from socket:', message);
    
    // Only process if message is relevant to this user
    if ((message.sender === userId && message.senderType === 'User') || 
        (message.receiver === userId && message.receiverType === 'User')) {
      
      // Create a unique ID for the message
      const messageId = message.id || `server-${Date.now()}`;
      
      // Check if this is a message we sent temporarily
      if (message.sender === userId && tempMessageIdsRef.current.has(messageId)) {
        console.log('Ignoring duplicate message with ID:', messageId);
        return; // Skip adding this message
      }
      
      // Create the new message object
      const newMessage = {
        id: messageId,
        text: message.content,
        isAdmin: message.senderType === 'Admin',
        timestamp: formatTimestamp(message.timestamp)
      };
      
      // Add to messages - using functional update to avoid stale state
      setMessages(prevMessages => {
        // Check if message already exists to prevent duplicates
        const exists = prevMessages.some(msg => msg.id === messageId);
        if (exists) {
          console.log('Message already exists in state, not adding again');
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
      
      // If the message is from admin and chat is closed, increment unread count
      if (message.senderType === 'Admin' && !isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }
  };

  // Handle messages being marked as read
  const handleMessagesRead = ({ conversationId }) => {
    // If admin has read our messages, update the message statuses
    if (conversationId === userId) {
      // Update read status in the UI if needed
      // (we could mark messages with a "read" indicator)
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle chat open button click
  const handleChatOpen = () => {
    // Check if user is authenticated and is a customer
    if (!isAuthenticated() || getUserType() !== 'user') {
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    // User is authenticated and is a customer, open the chat
    setIsOpen(true);
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    // Set sending flag to prevent double-sends
    setSendingMessage(true);
    
    // Generate temporary ID for this message
    const tempId = `temp-${Date.now()}`;
    tempMessageIdsRef.current.add(tempId);
    
    // Create message object
    const messageData = {
      content: message.trim(),
      receiverId: 'admin',
    };
    
    // Optimistically add message to UI
    const optimisticMessage = {
      id: tempId,
      text: message,
      isAdmin: false,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    
    try {
      // Send message via socket
      await sendMessage(messageData);
      console.log('Message sent successfully:', messageData);
      
      // Note: We don't add the message to the UI here, as the socket will send it back
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the optimistic message and show error
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempId),
        {
          id: `error-${Date.now()}`,
          text: t('error_sending_message') || 'Failed to send message. Please try again.',
          isAdmin: true,
          timestamp: 'Just now'
        }
      ]);
      
      // Remove from temp IDs
      tempMessageIdsRef.current.delete(tempId);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      {/* Chat Button with Notification Badge */}
      <button
        onClick={handleChatOpen}
        className={`fixed bottom-6 right-6 z-50 bg-brand text-white p-4 rounded-full shadow-lg hover:bg-brand/90 transition-transform transform hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
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
                <h3 className="font-medium">{t('waureisen_support') || 'Waureisen Support'}</h3>
                <p className="text-sm opacity-90">{t('online') || 'Online'}</p>
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-500">{t('start_conversation') || 'Start a conversation'}</p>
              </div>
            ) : (
              messages.map((msg) => (
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('type_message') || 'Type a message...'}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                className={`p-2 rounded-full ${
                  message.trim() && !sendingMessage
                    ? 'bg-brand text-white hover:bg-brand/90' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!message.trim() || sendingMessage}
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