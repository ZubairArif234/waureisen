import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bell, Send, ArrowLeft, User, Check, CheckCheck } from 'lucide-react';
import { initSocket, getSocket, sendMessage, addEventListener, removeEventListener, joinChat, markMessagesAsRead } from '../../utils/socketService';
import { getAdminConversations, getChatHistory, getTotalUnreadCount } from '../../api/chatAPI';
import avatar from '../../assets/avatar.png';

// Message status component - keep existing implementation
const MessageStatus = ({ status }) => {
  if (status === 'sent') {
    return <Check className="w-3 h-3 text-gray-400" />;
  } else if (status === 'delivered') {
    return <CheckCheck className="w-3 h-3 text-gray-400" />;
  } else if (status === 'read') {
    return <CheckCheck className="w-3 h-3 text-brand" />;
  }
  return null;
};

// Message component - keep existing implementation
const Message = ({ message, isAdmin }) => {
  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isAdmin && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
          <img src={avatar} alt="User" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-[75%]">
        <div 
          className={`px-4 py-2 rounded-2xl ${
            isAdmin 
              ? 'bg-brand text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={`flex mt-1 text-xs text-gray-500 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
          <span>{message.time}</span>
          {isAdmin && (
            <span className="ml-1">
              <MessageStatus status={message.status} />
            </span>
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ml-2">
          <div className="w-full h-full bg-brand flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      )}
    </div>
  );
};

// Conversation list item component - keep existing implementation
const ConversationItem = ({ conversation, isActive, onClick, onNotificationClick }) => {
  return (
    <div 
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={avatar} alt={conversation.name} className="w-full h-full object-cover" />
        </div>
        {conversation.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
          <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <span 
              className="ml-2 flex-shrink-0 bg-brand text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onNotificationClick(conversation.id);
              }}
            >
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification toast component - keep existing implementation
const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex p-4">
        <div className="mr-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={avatar} alt={notification.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-medium text-gray-900">{notification.name}</h4>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
          <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
      </div>
      <div className="flex border-t">
        <button 
          className="flex-1 py-2 text-sm font-medium text-brand hover:bg-brand/5 transition-colors"
          onClick={onClose}
        >
          View Message
        </button>
      </div>
    </div>
  );
};

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);
  
  // Initialize socket and fetch conversations when component mounts
  useEffect(() => {
    // Initialize socket connection
    initSocket();
    
    // Fetch conversations
    fetchConversations();
    
    // Add socket event listeners
    addEventListener('new-message', handleNewMessage);
    addEventListener('messages-read', handleMessagesRead);
    addEventListener('online-users', handleOnlineUsers);
    addEventListener('user-offline', handleUserOffline);
    
    // Handle window resize
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Remove event listeners
      const socket = getSocket();
      if (socket) {
        removeEventListener('new-message', handleNewMessage);
        removeEventListener('messages-read', handleMessagesRead);
        removeEventListener('online-users', handleOnlineUsers);
        removeEventListener('user-offline', handleUserOffline);
      }
    };
  }, []);

  // Scroll to bottom of messages when conversation changes or messages update
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeConversation]);

  // Join chat room when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      joinChat(activeConversation);
      fetchMessages(activeConversation);
      markMessagesAsRead(activeConversation);
      
      // Update unread count for this conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      }));
    }
  }, [activeConversation]);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await getAdminConversations();
      
      // Format conversations for UI
      const formattedConversations = data.map(conv => ({
        id: conv.id,
        name: conv.name,
        lastMessage: conv.lastMessage,
        lastMessageTime: formatTimestamp(conv.lastMessageTime),
        online: conv.online,
        unreadCount: conv.unreadCount
      }));
      
      setConversations(formattedConversations);
      
      // Set initial active conversation if on desktop
      if (!isMobileView && formattedConversations.length > 0 && !activeConversation) {
        setActiveConversation(formattedConversations[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);
      const messages = await getChatHistory(userId);
      
      // Format messages for UI
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        time: formatTimestamp(msg.timestamp),
        isAdmin: msg.senderType === 'admin',
        status: msg.isRead ? 'read' : 'delivered'
      }));
      
      setCurrentMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setCurrentMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Format timestamp
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

  // Handle new message from socket
  const handleNewMessage = (message) => {
    const { sender, senderType, content, timestamp } = message;
    
    // Update conversations list
    if (senderType === 'user') {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.id === sender);
      
      if (existingConversation) {
        // Update existing conversation
        setConversations(prev => prev.map(conv => {
          if (conv.id === sender) {
            return {
              ...conv,
              lastMessage: content,
              lastMessageTime: formatTimestamp(timestamp),
              unreadCount: conv.id === activeConversation ? 0 : conv.unreadCount + 1
            };
          }
          return conv;
        }));
      } else {
        // Add new conversation
        fetchConversations(); // Refresh the entire list to get user details
      }
      
      // Show notification if this is not the active conversation
      if (sender !== activeConversation) {
        // Find user name from conversations
        const user = conversations.find(conv => conv.id === sender);
        if (user) {
          setNotification({
            id: sender,
            name: user.name,
            message: content,
            time: formatTimestamp(timestamp)
          });
        }
      }
    }
    
    // Update current messages if this is the active conversation
    if ((sender === activeConversation && senderType === 'user') || 
        (message.receiver === activeConversation && senderType === 'admin')) {
      
      const newMsg = {
        id: message.id,
        content,
        time: formatTimestamp(timestamp),
        isAdmin: senderType === 'admin',
        status: 'delivered'
      };
      
      setCurrentMessages(prev => [...prev, newMsg]);
    }
  };

  // Handle messages being marked as read
  const handleMessagesRead = ({ conversationId }) => {
    // Update message statuses for this conversation
    if (conversationId === activeConversation) {
      setCurrentMessages(prev => prev.map(msg => {
        if (msg.isAdmin && msg.status !== 'read') {
          return { ...msg, status: 'read' };
        }
        return msg;
      }));
    }
  };

  // Handle online users update
  const handleOnlineUsers = (onlineUserIds) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      online: onlineUserIds.includes(conv.id)
    })));
  };

  // Handle user going offline
  const handleUserOffline = (userId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === userId) {
        return { ...conv, online: false };
      }
      return conv;
    }));
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
  };

  // Clear notifications for a conversation
  const clearNotifications = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
    
    // If there's a notification for this conversation, clear it
    if (notification && notification.id === conversationId) {
      setNotification(null);
    }
    
    // Mark messages as read in database
    markMessagesAsRead(conversationId);
  };

  // Handle back button in mobile view
  const handleBackClick = () => {
    setActiveConversation(null);
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    // Create message object
    const messageData = {
      content: newMessage.trim(),
      receiverId: activeConversation,
    };
    
    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      time: 'Just now',
      isAdmin: true,
      status: 'sent'
    };
    
    setCurrentMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    try {
      // Send message via socket
      await sendMessage(messageData);
      
      // Update conversations list
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: 'Just now'
          };
        }
        return conv;
      }));
      
      // Update message status to delivered after a short delay
      setTimeout(() => {
        setCurrentMessages(prev => prev.map(msg => {
          if (msg.id === optimisticMessage.id) {
            return { ...msg, status: 'delivered' };
          }
          return msg;
        }));
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error in UI
      setCurrentMessages(prev => [
        ...prev.filter(msg => msg.id !== optimisticMessage.id),
        {
          id: `error-${Date.now()}`,
          content: 'Failed to send message. Please try again.',
          time: 'Just now',
          isAdmin: true,
          status: 'error'
        }
      ]);
    }
  };

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && conversation.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  // Get current conversation data
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Notification Toast */}
      {notification && (
        <NotificationToast 
          notification={notification} 
          onClose={() => {
            setActiveConversation(notification.id);
            clearNotifications(notification.id);
            setNotification(null);
          }} 
        />
      )}
      
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Messages
        </h1>
        <p className="text-gray-600 mb-6">
          Manage conversations with customers through the CRISP messaging system
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List - Hidden in mobile when conversation is active */}
        <div 
          className={`w-full md:w-80 border-r flex flex-col ${
            isMobileView && activeConversation && currentConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Filter Tabs */}
          <div className="flex border-b p-4 gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                activeTab === 'unread'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Unread</span>
              {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0) > 0 && (
                <span className="bg-white text-brand w-5 h-5 flex items-center justify-center rounded-full text-xs">
                  {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversation}
                  onClick={() => handleSelectConversation(conversation.id)}
                  onNotificationClick={clearNotifications}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversations found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div 
          className={`flex-1 flex flex-col ${
            isMobileView && (!activeConversation || !currentConversation) ? 'hidden' : 'flex'
          }`}
        >
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center">
                {isMobileView && (
                  <button 
                    className="mr-2 p-2 hover:bg-gray-100 rounded-full"
                    onClick={handleBackClick} 
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="flex-1 flex items-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={avatar} alt={currentConversation.name} className="w-full h-full object-cover" />
                    </div>
                    {currentConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{currentConversation.name}</h3>
                    <p className="text-xs text-gray-500">
                      {currentConversation.online ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-white/50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
                  </div>
                ) : currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <User className="w-16 h-16 text-gray-300 mb-2" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-gray-400 text-sm mt-1">Send a message to start the conversation</p>
                  </div>
                ) : (
                  currentMessages.map(message => (
                    <Message 
                      key={message.id} 
                      message={message} 
                      isAdmin={message.isAdmin} 
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-full ${
                      newMessage.trim() 
                        ? 'bg-brand text-white hover:bg-brand/90' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;