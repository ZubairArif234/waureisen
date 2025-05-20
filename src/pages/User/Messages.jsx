import React, { useState, useEffect, useRef } from 'react';
import { Search, Sliders, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getUserConversations, getConversationMessages, sendMessage, markConversationAsRead } from '../../api/conversationAPI';
import { useSocket } from '../../utils/SocketContext';
import defaultAvatar from '../../assets/avatar.png';
import logo from "../../assets/logo.png";
import { changeMetaData } from '../../utils/extra';

// Message bubble component
const MessageBubble = ({ message, isOwn ,provider}) => {
  const messageTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && (
        <img 
          src={provider?.profilePicture || logo} 
          alt="Sender" 
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}
      <div className={`max-w-[70%] ${isOwn ? 'bg-[#B4A481] text-white' : 'bg-gray-100'} rounded-2xl px-4 py-2`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{messageTime}</p>
      </div>
    </div>
  );
};

// Contact item component
const ConversationItem = ({ conversation, isSelected, onClick, unreadCount }) => {
  // Format timestamp
  const timestamp = conversation.lastMessageTime 
    ? new Date(conversation.lastMessageTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    : '';

  // Get provider info
  const provider = conversation.provider || {};
  const providerName = provider.firstName && provider.lastName 
    ? `${provider.firstName} ${provider.lastName}`
    : provider.username || 'Provider';

  return (
    <div 
      onClick={onClick}
      className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-gray-50' : ''
      } ${unreadCount > 0 ? 'font-medium' : ''}`}
    >
      <img 
        src={provider.profilePicture || logo} 
        alt={providerName} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm text-gray-900 truncate capitalize">{providerName}</h3>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage || 'Start chatting...'}</p>
      </div>
      {unreadCount > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#B4A481] text-white text-xs px-1">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

const Messages = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const messageSentFlag = useRef(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  
  useEffect(() => {
                changeMetaData("Messages - Waureisen");
              }, [])
  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const data = await getUserConversations();
        setConversations(data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);


  useEffect(() => {
    if (!socket) return;
  
    // Keep track of processed message IDs to avoid duplicates
    const processedMessageIds = new Set();
  
    // Listen for new messages
    socket.on('new_message', (message) => {
      // Skip if we've already processed this message
      if (processedMessageIds.has(message._id)) return;
      processedMessageIds.add(message._id);
      
      // Check if the message belongs to the current conversation
      if (selectedChat && message.conversation === selectedChat._id) {
        // If it's our own message, check if we need to replace a temp message
        if (message.senderType === 'User') {
          setMessages(prevMessages => {
            // Check if we have a pending message with similar content and timestamp
            const hasPendingMatch = prevMessages.some(msg => 
              msg.isPending && 
              msg.content === message.content &&
              Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 5000
            );
            
            if (hasPendingMatch) {
              // Replace the pending message with the confirmed one
              return prevMessages.map(msg => 
                (msg.isPending && msg.content === message.content) ? message : msg
              );
            } else {
              // No pending message to replace, just add it
              return [...prevMessages, message];
            }
          });
        } else {
          // It's from the provider, just add it
          setMessages(prevMessages => [...prevMessages, message]);
          
          // Mark as read if it's from provider
          markConversationAsRead(selectedChat._id).catch(console.error);
        }
      }
  
      // Update the conversation list (unread count, last message)
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === message.conversation
            ? { 
                ...conv, 
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCustomer: conv._id === selectedChat?._id 
                  ? 0 // If this conversation is selected, mark as read
                  : (conv.unreadCustomer || 0) + (message.senderType === 'Provider' ? 1 : 0)
              }
            : conv
        )
      );
    });
  
    // Listen for "messages read" events
    socket.on('messages_read', ({ conversationId }) => {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === conversationId
            ? { ...conv, unreadProvider: 0 }
            : conv
        )
      );
    });
  
    return () => {
      socket.off('new_message');
      socket.off('messages_read');
      processedMessageIds.clear();
    };
  }, [socket, selectedChat]);

  // Fetch messages when selecting a conversation
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        // Join the conversation room
        if (socket) {
          socket.emit('join_conversation', selectedChat._id);
        }

        // Fetch messages
        const data = await getConversationMessages(selectedChat._id);
        
        // Sort messages by date
        const sortedMessages = [...data].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);

        // Mark conversation as read
        if (selectedChat.unreadCustomer > 0) {
          await markConversationAsRead(selectedChat._id);
          
          // Update local state to reflect read status
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv._id === selectedChat._id
                ? { ...conv, unreadCustomer: 0 }
                : conv
            )
          );
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Cleanup: leave the conversation room
    return () => {
      if (socket) {
        socket.emit('leave_conversation', selectedChat._id);
      }
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    if (messages.length > 0) {
      // Use a timeout to ensure DOM is updated
      setTimeout(() => {
        const chatContainer = document.querySelector('.messages-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      messageSentFlag.current = false; 
    };
  }, []);
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    if (messageSentFlag.current || newMessage.trim() === '' || !selectedChat) return;
  
    try {
      // Generate a temporary ID that we can track
      const tempId = `temp-${Date.now()}`;
      
      // Optimistically add message to UI
      const tempMessage = {
        _id: tempId,
        content: newMessage,
        createdAt: new Date().toISOString(),
        sender: 'me', 
        senderType: 'User',
        isPending: true // Add this flag to identify pending messages
      };
  
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');
      messageSentFlag.current = true; // Set the flag to true
  
      // Send message to server
      const sentMessage = await sendMessage(selectedChat._id, newMessage);
      
      // Update temporary message with the real one
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempId ? { ...sentMessage, isTemp: false } : msg
        )
      );
  
      // Update conversation in the list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedChat._id
            ? { 
                ...conv, 
                lastMessage: newMessage,
                lastMessageTime: new Date().toISOString(),
                unreadProvider: (conv.unreadProvider || 0) + 1
              }
            : conv
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove the temporary message on error
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isPending)
      );
    } finally {
      // Reset the flag after a short delay
      setTimeout(() => {
        messageSentFlag.current = false;
      }, 500);
    }
  };
  

  // Filter conversations
  const filteredConversations = conversations
    .filter(conv => 
      selectedFilter === 'all' || (selectedFilter === 'unread' && (conv.unreadCustomer || 0) > 0)
    )
    .filter(conv => {
      // Search by provider name, listing title, or last message
      const providerName = conv.provider?.username || 
        `${conv.provider?.firstName || ''} ${conv.provider?.lastName || ''}`.trim();
      const listingTitle = conv.listing?.title || '';
      const lastMessage = conv.lastMessage || '';
      
      return providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar */}
          <div className={`w-full md:w-[380px] border-r flex flex-col ${
            selectedChat ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="p-6 border-b">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('messages')}</h1>
              
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedFilter === 'all'
                      ? 'bg-[#B4A481] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('all')}
                </button>
                <button
                  onClick={() => setSelectedFilter('unread')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedFilter === 'unread'
                      ? 'bg-[#B4A481] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('unread')}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search_messages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sliders className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-t-[#B4A481] border-gray-200 rounded-full animate-spin"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('no_messages_found')}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? t('adjust_search') : t('no_conversations_yet')}
                  </p>
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    isSelected={selectedChat?._id === conversation._id}
                    onClick={() => setSelectedChat(conversation)}
                    unreadCount={conversation.unreadCustomer || 0}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Chat View */}
          <div className={`${
            selectedChat ? 'flex' : 'hidden md:flex'
          } flex-1 flex flex-col bg-white h-[calc(100vh-80px)]`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-4">
                  <button 
                    className="md:hidden"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <img 
                    src={selectedChat.provider?.profilePicture || logo} 
                    alt={selectedChat.provider?.username || 'Provider'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-medium capitalize">
                      {selectedChat.provider?.firstName && selectedChat.provider?.lastName 
                        ? `${selectedChat.provider.firstName} ${selectedChat.provider.lastName}`
                        : selectedChat.provider?.username || 'Provider'}
                    </h2>
                    <p className="text-sm text-gray-500">{t('provider')}</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('no_messages_yet')}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {t('start_conversation')}
                      </p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <MessageBubble 
                        key={message._id}
                        message={message}
                        isOwn={message.sender === 'me' || message.senderType === 'User'}
                        provider={selectedChat?.provider}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="relative">
                    <input
                      type="text"
                      placeholder={t('type_a_message')}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481] pr-20"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#B4A481] text-white rounded-full text-sm disabled:bg-gray-300"
                    >
                      {t('send')}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('select_conversation')}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t('choose_conversation')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Messages;