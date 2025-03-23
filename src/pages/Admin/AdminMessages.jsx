import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bell, Send, Phone, Video, Info, ArrowLeft, User, Check, CheckCheck } from 'lucide-react';
import avatar from '../../assets/avatar.png';

// Message status component
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

// Message component
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

// Conversation list item component
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

// Notification toast component
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
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Is the mountain cabin still available for next week?',
      lastMessageTime: '10:42 AM',
      online: true,
      unreadCount: 2,
      messages: [
        {
          id: 1,
          content: 'Hello, I am interested in booking the Mountain View Chalet for August 15-20.',
          time: '10:30 AM',
          isAdmin: false,
          status: 'read'
        },
        {
          id: 2,
          content: 'Hi John! Thanks for your interest. The Mountain View Chalet is available for those dates.',
          time: '10:35 AM',
          isAdmin: true,
          status: 'read'
        },
        {
          id: 3,
          content: 'Great! Is there a discount for a 5-day stay? Also, is it dog-friendly?',
          time: '10:38 AM',
          isAdmin: false,
          status: 'read'
        },
        {
          id: 4,
          content: 'Yes, we offer a 10% discount for stays of 5 days or more. And absolutely, the chalet is dog-friendly with a fenced yard.',
          time: '10:40 AM',
          isAdmin: true,
          status: 'read'
        },
        {
          id: 5,
          content: 'Perfect! Is the mountain cabin still available for next week?',
          time: '10:42 AM',
          isAdmin: false,
          status: 'delivered'
        }
      ]
    },
    {
      id: 2,
      name: 'Emma Wilson',
      lastMessage: 'Thank you for the quick response!',
      lastMessageTime: '9:15 AM',
      online: false,
      unreadCount: 0,
      messages: [
        {
          id: 1,
          content: 'Hi, I have a question about the Beachfront Villa.',
          time: '9:05 AM',
          isAdmin: false,
          status: 'read'
        },
        {
          id: 2,
          content: 'Hello Emma, what would you like to know about the villa?',
          time: '9:10 AM',
          isAdmin: true,
          status: 'read'
        },
        {
          id: 3,
          content: 'Thank you for the quick response!',
          time: '9:15 AM',
          isAdmin: false,
          status: 'read'
        }
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      lastMessage: 'I would like to book this for next month. How do I proceed?',
      lastMessageTime: 'Yesterday',
      online: true,
      unreadCount: 1,
      messages: [
        {
          id: 1,
          content: 'Hello, I am looking at the City Apartment listing.',
          time: 'Yesterday',
          isAdmin: false,
          status: 'read'
        },
        {
          id: 2,
          content: 'I would like to book this for next month. How do I proceed?',
          time: 'Yesterday',
          isAdmin: false,
          status: 'delivered'
        }
      ]
    },
    {
      id: 4,
      name: 'Sarah Davis',
      lastMessage: 'Are there any pet-friendly options in Zürich?',
      lastMessageTime: '2 days ago',
      online: false,
      unreadCount: 0,
      messages: [
        {
          id: 1,
          content: 'Are there any pet-friendly options in Zürich?',
          time: '2 days ago',
          isAdmin: false,
          status: 'read'
        },
        {
          id: 2,
          content: 'Hi Sarah! Yes, we have several dog-friendly properties in Zürich. I can send you some recommendations.',
          time: '2 days ago',
          isAdmin: true,
          status: 'read'
        }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, conversations]);

  // Set initial active conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation]);

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && conversation.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  // Get active conversation data
  const currentConversation = conversations.find(c => c.id === activeConversation);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        const newMsg = {
          id: conv.messages.length + 1,
          content: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAdmin: true,
          status: 'sent'
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: newMsg.time
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setNewMessage('');
    
    // Simulate message status updates
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.id === conv.messages.length) {
              return { ...msg, status: 'delivered' };
            }
            return msg;
          });
          return { ...conv, messages: updatedMessages };
        }
        return conv;
      }));
    }, 1000);
    
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.id === conv.messages.length) {
              return { ...msg, status: 'read' };
            }
            return msg;
          });
          return { ...conv, messages: updatedMessages };
        }
        return conv;
      }));
    }, 2000);
  };

  // Clear notifications for a conversation
  const clearNotifications = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
    clearNotifications(conversationId);
  };

  // Notification click handler
  const handleNotificationClick = (conversationId) => {
    clearNotifications(conversationId);
  };

  // Simulate incoming messages periodically
  useEffect(() => {
    const simulateIncomingMessage = () => {
      const randomConvIndex = Math.floor(Math.random() * conversations.length);
      const randomConv = conversations[randomConvIndex];
      
      const incomingMsg = {
        id: randomConv.messages.length + 1,
        content: `This is a simulated incoming message. #${Math.floor(Math.random() * 1000)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdmin: false,
        status: 'delivered'
      };
      
      const updatedConversations = conversations.map((conv, index) => {
        if (index === randomConvIndex) {
          return {
            ...conv,
            messages: [...conv.messages, incomingMsg],
            lastMessage: incomingMsg.content,
            lastMessageTime: incomingMsg.time,
            unreadCount: conv.id !== activeConversation ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      
      // Show notification if the conversation is not active
      if (randomConv.id !== activeConversation) {
        setNotification({
          id: randomConv.id,
          name: randomConv.name,
          message: incomingMsg.content,
          time: incomingMsg.time
        });
      }
    };
    
    // Simulate incoming message every 30-60 seconds
    const timer = setTimeout(simulateIncomingMessage, Math.random() * 30000 + 30000);
    return () => clearTimeout(timer);
  }, [conversations, activeConversation]);

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
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversation}
                  onClick={() => handleSelectConversation(conversation.id)}
                  onNotificationClick={handleNotificationClick}
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
                    onClick={() => setActiveConversation(null)}
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
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-white/50">
                {currentConversation.messages.map(message => (
                  <Message 
                    key={message.id} 
                    message={message} 
                    isAdmin={message.isAdmin} 
                  />
                ))}
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