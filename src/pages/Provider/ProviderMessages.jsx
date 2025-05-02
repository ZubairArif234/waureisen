import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Search, Calendar, User, Info, MoreHorizontal } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getProviderConversations, getConversationMessages, sendMessage, markConversationAsRead, getConversationByBooking } from '../../api/conversationAPI';
import { useSocket } from '../../utils/SocketContext';
import defaultAvatar from '../../assets/avatar.png';

// ContactCard component for the sidebar
const ContactCard = ({ contact, isActive, onClick }) => {
  // Format date
  const timestamp = contact.lastMessageTime 
    ? new Date(contact.lastMessageTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    : '';
  
  // Get customer name
  const customerName = contact.customer?.firstName && contact.customer?.lastName
    ? `${contact.customer.firstName} ${contact.customer.lastName}`
    : contact.customer?.username || 'Guest';
  
  return (
    <div 
      className={`flex items-center gap-3 p-4 cursor-pointer rounded-lg ${
        isActive ? 'bg-brand/10' : 'hover:bg-gray-100'
      }`}
      onClick={() => onClick(contact._id)}
    >
      <div className="relative">
        <img 
          src={contact.customer?.profilePicture || defaultAvatar} 
          alt={customerName} 
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className={`font-medium ${isActive ? 'text-brand' : 'text-gray-900'} truncate`}>{customerName}</h3>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{contact.lastMessage || 'No messages yet'}</p>
      </div>
      {(contact.unreadProvider > 0) && (
        <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-brand text-white text-xs px-1">
          {contact.unreadProvider}
        </span>
      )}
    </div>
  );
};

// Message bubble component
const MessageBubble = ({ message, isOwn }) => {
  const messageTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && (
        <img 
          src={defaultAvatar} 
          alt="Sender" 
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}
      <div className={`max-w-[70%] ${isOwn ? 'bg-brand text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
        <p className="text-sm">{message.content}</p>
        <div className={`text-xs mt-1 text-right ${isOwn ? 'text-brand-light' : 'text-gray-500'}`}>
          {messageTime}
        </div>
      </div>
    </div>
  );
};


const BookingInfoCard = ({ booking, t }) => {
  if (!booking) return null;
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
  const displayBookingId = booking.bookingId || booking._id?.substring(0, 8) || 'N/A';
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{t('booking_details')}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          booking.status === 'confirmed' 
            ? 'bg-green-100 text-green-800' 
            : booking.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      <div className="p-4">
        <div className="flex mb-4">
          <img 
            src={booking.listing?.images?.[0] || defaultAvatar} 
            alt={booking.listing?.title || "Property"} 
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">{booking.listing?.title || "Property"}</h4>
            <p className="text-sm text-gray-500">{booking.listing?.location?.address || "Unknown location"}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <span className="text-gray-900">
                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
              </span>
              <span className="text-gray-500 ml-1">
                ({nights} {nights === 1 ? t('night') : t('nights')})
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {booking.capacity?.people || 1} {booking.capacity?.people === 1 ? t('guest') : t('guests')}, 
              {' '}{booking.capacity?.dogs || 0} {booking.capacity?.dogs === 1 ? t('dog') : t('dogs')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {t('booking_id')}: {displayBookingId}
            </span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t('total_amount')}</span>
              <span className="text-sm font-medium text-brand">{booking.totalPrice} CHF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderMessages = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const messageInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const messageEndRef = useRef(null);
  
  // Parse query params to get booking ID if it exists
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('booking');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showBookingInfo, setShowBookingInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageSentFlag = useRef(false);

  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  
  const { socket } = useSocket();
  
  // Load conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const data = await getProviderConversations();
        setConversations(data);
        
        // If a booking ID is provided in the URL, find or create the conversation
        if (bookingId) {
          try {
            const conversation = await getConversationByBooking(bookingId);
            if (conversation) {
              setSelectedContact(conversation._id);
              setCurrentConversation(conversation);
            }
          } catch (err) {
            console.error('Error getting conversation for booking:', err);
          }
        } else if (data.length > 0 && !selectedContact) {
          // Select first conversation by default
          setSelectedContact(data[0]._id);
          setCurrentConversation(data[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [bookingId]);
  
  
  useEffect(() => {
    if (!socket) return;
    
    // Keep track of processed message IDs to avoid duplicates
    const processedMessageIds = new Set();
    
    // Listen for new messages
    socket.on('new_message', (message) => {
      // Skip if we've already processed this message or it's a temp message
      if (processedMessageIds.has(message._id)) return;
      processedMessageIds.add(message._id);
      
      // Check if the message belongs to the current conversation
      if (selectedContact && message.conversation === selectedContact) {
        // If it's our own message, check if we need to replace a temp message
        if (message.senderType === 'Provider') {
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
          // It's from the other party, just add it
          setMessages(prevMessages => [...prevMessages, message]);
          
          // Mark as read if it's from the customer
          markConversationAsRead(selectedContact).catch(console.error);
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
                unreadProvider: conv._id === selectedContact 
                  ? 0 // If this conversation is selected, mark as read
                  : (conv.unreadProvider || 0) + (message.senderType === 'User' ? 1 : 0)
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
            ? { ...conv, unreadCustomer: 0 }
            : conv
        )
      );
    });
    
    return () => {
      socket.off('new_message');
      socket.off('messages_read');
      processedMessageIds.clear();
    };
  }, [socket, selectedContact]);
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedContact) return;
    
    const fetchMessages = async () => {
      try {
        // Join the conversation room
        if (socket) {
          socket.emit('join_conversation', selectedContact);
        }
        
        // Find the current conversation
        const conversation = conversations.find(c => c._id === selectedContact);
        if (conversation) {
          setCurrentConversation(conversation);
        }
        
        // Fetch messages
        const data = await getConversationMessages(selectedContact);
        
        // Sort messages by date (oldest first)
        const sortedMessages = [...data].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);
        
        // Mark messages as read if there are unread messages
        const convo = conversations.find(c => c._id === selectedContact);
        if (convo && convo.unreadProvider > 0) {
          await markConversationAsRead(selectedContact);
          
          // Update local state to reflect read status
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv._id === selectedContact
                ? { ...conv, unreadProvider: 0 }
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
        socket.emit('leave_conversation', selectedContact);
      }
    };
  }, [selectedContact, socket, conversations]);
  
  useEffect(() => {
    if (messageContainerRef.current && messages.length > 0) {
      // Small delay to ensure all content is rendered
      setTimeout(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      messageSentFlag.current = false; // Reset the flag when the component unmounts
    };
  }, []);
  
  
  // Filter contacts based on search query
  const filteredContacts = conversations.filter(contact => {
    // Get customer name
    const customerName = contact.customer?.firstName && contact.customer?.lastName
      ? `${contact.customer.firstName} ${contact.customer.lastName}`
      : contact.customer?.username || '';
    
    // Get listing title  
    const listingTitle = contact.listing?.title || '';
    
    return customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (contact.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
  };
  
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (messageSentFlag.current || newMessage.trim() === '' || !selectedContact) return;
  
    try {
      // Generate a temporary ID that we can track
      const tempId = `temp-${Date.now()}`;
      
      // Optimistic update - add message to UI immediately
      const tempMessage = {
        _id: tempId,
        content: newMessage.trim(),
        sender: 'me',
        senderType: 'Provider',
        createdAt: new Date().toISOString(),
        isPending: true // Add this flag to identify pending messages
      };
  
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');
      messageSentFlag.current = true; // Set the flag to true
  
      // Focus back on the input field
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
  
      // Actually send the message
      const sentMessage = await sendMessage(selectedContact, newMessage.trim());
      
      // Update the temporary message with the real one
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempId ? { ...sentMessage, isTemp: false } : msg
        )
      );
  
      // Update conversation in the list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedContact
            ? { 
                ...conv, 
                lastMessage: newMessage.trim(),
                lastMessageTime: new Date().toISOString(),
                unreadCustomer: (conv.unreadCustomer || 0) + 1
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
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
  
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
          <div className="py-4 flex items-center">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 ml-4">{t('messages')}</h1>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-8">
            <div className="flex h-[85vh]">
              {/* Left Sidebar with Contact List */}
              <div className="w-full sm:w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('search_messages')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="w-8 h-8 border-4 border-t-brand border-gray-200 rounded-full animate-spin"></div>
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {error ? error : t('no_conversations_found')}
                    </div>
                  ) : (
                    filteredContacts.map(contact => (
                      <ContactCard
                        key={contact._id}
                        contact={contact}
                        isActive={selectedContact === contact._id}
                        onClick={handleContactSelect}
                      />
                    ))
                  )}
                </div>
              </div>
              
              {/* Right Section with Chat */}
              <div className="hidden sm:flex flex-col w-2/3 h-[calc(100vh-180px)]">
                {currentConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={currentConversation.customer?.profilePicture || defaultAvatar} 
                            alt={currentConversation.customer?.username || 'Guest'} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {currentConversation.customer?.firstName && currentConversation.customer?.lastName
                              ? `${currentConversation.customer.firstName} ${currentConversation.customer.lastName}`
                              : currentConversation.customer?.username || 'Guest'}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(currentConversation.booking?.checkInDate).toLocaleDateString()} - {new Date(currentConversation.booking?.checkOutDate).toLocaleDateString()}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {currentConversation.booking?.capacity?.people || 1} {currentConversation.booking?.capacity?.people !== 1 ? t('guests') : t('guest')}, 
                            {' '}{currentConversation.booking?.capacity?.dogs || 0} {currentConversation.booking?.capacity?.dogs !== 1 ? t('dogs') : t('dog')}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            {t('booking_id')}: {currentConversation.booking?.bookingId || currentConversation.booking?._id?.substring(0, 8) || 'N/A'}
                          </span>
                        </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          currentConversation.booking?.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : currentConversation.booking?.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {currentConversation.booking?.status.charAt(0).toUpperCase() + currentConversation.booking?.status.slice(1)}
                        </span>
                        {/* <button 
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                          onClick={() => setShowBookingInfo(!showBookingInfo)}
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div> */}
                      </div>
                    </div>
                    
                   {/* Chat Body */}
                  <div className="flex-1 flex">
                    <div 
                      ref={messageContainerRef}
                      className="flex-1 p-4 overflow-y-auto"
                      style={{ maxHeight: 'calc(100vh - 220px)' }}
                    >
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="w-8 h-8 border-4 border-t-brand border-gray-200 rounded-full animate-spin"></div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <p className="text-gray-500">{t('no_messages_yet')}</p>
                          <p className="text-sm text-gray-400 mt-2">{t('start_conversation')}</p>
                        </div>
                      ) : (
                        /* Message bubbles */
                        messages.map(message => (
                          <MessageBubble
                            key={message._id}
                            message={message}
                            isOwn={message.sender === 'me' || message.senderType === 'Provider'}
                          />
                        ))
                      )}
                      <div ref={messageEndRef}></div>
                    </div>
                  </div>
                    
                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <textarea
                            ref={messageInputRef}
                            placeholder={t('type_message')}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                            rows="2"
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={newMessage.trim() === ''}
                          className={`p-3 rounded-full ${
                            newMessage.trim() === ''
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-brand text-white hover:bg-brand/90'
                          }`}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">{t('select_conversation')}</p>
                      <p className="text-gray-400 text-sm">{t('choose_contact_to_chat')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default ProviderMessages;