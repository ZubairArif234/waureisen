import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Search, Calendar, User, Info, MoreHorizontal } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import avatar from '../../assets/avatar.png';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';

// ContactCard component for the sidebar
const ContactCard = ({ contact, isActive, onClick }) => {
  return (
    <div 
      className={`flex items-center gap-3 p-4 cursor-pointer rounded-lg ${
        isActive ? 'bg-brand/10' : 'hover:bg-gray-100'
      }`}
      onClick={() => onClick(contact.id)}
    >
      <div className="relative">
        <img 
          src={contact.avatar} 
          alt={contact.name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className={`font-medium ${isActive ? 'text-brand' : 'text-gray-900'} truncate`}>{contact.name}</h3>
          <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
      </div>
      {contact.unreadCount > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-brand text-white text-xs px-1">
          {contact.unreadCount}
        </span>
      )}
    </div>
  );
};

// Message bubble component
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && (
        <img src={message.sender.avatar} alt={message.sender.name} className="w-8 h-8 rounded-full mr-2 self-end" />
      )}
      <div className={`max-w-[70%] ${isOwn ? 'bg-brand text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
        <p className="text-sm">{message.text}</p>
        {message.media && (
          <img src={message.media} alt="Attached media" className="mt-2 rounded-md w-full h-auto" />
        )}
        <div className={`text-xs mt-1 text-right ${isOwn ? 'text-brand-light' : 'text-gray-500'}`}>
          {message.time}
        </div>
      </div>
    </div>
  );
};

// Booking Info Card component
const BookingInfoCard = ({ booking }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Booking Details</h3>
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
            src={booking.property.image} 
            alt={booking.property.name} 
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">{booking.property.name}</h4>
            <p className="text-sm text-gray-500">{booking.property.location}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <span className="text-gray-900">
                {booking.checkIn} - {booking.checkOut}
              </span>
              <span className="text-gray-500 ml-1">
                ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}, {booking.dogs} {booking.dogs === 1 ? 'dog' : 'dogs'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              Booking ID: #{booking.id}
            </span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-sm font-medium text-brand">{booking.totalAmount} CHF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderMessages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messageInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  
  // Parse query params to get booking ID if it exists
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('booking');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showBookingInfo, setShowBookingInfo] = useState(true);
  
  // Mock data for contacts
  const [contacts, setContacts] = useState([
    {
      id: 'C1',
      name: 'John Doe',
      avatar: avatar,
      lastMessage: 'Hi there, is the studio still available for the dates I requested?',
      lastMessageTime: '10:12 AM',
      isOnline: true,
      unreadCount: 2,
      booking: {
        id: 'B1001',
        property: {
          name: 'Modern Studio in City Center',
          location: 'Zurich, Switzerland',
          image: i1
        },
        checkIn: 'Apr 12, 2025',
        checkOut: 'Apr 16, 2025',
        nights: 4,
        guests: 2,
        dogs: 1,
        status: 'confirmed',
        totalAmount: '480'
      },
      messages: [
        {
          id: 'M1',
          sender: { id: 'C1', name: 'John Doe', avatar: avatar },
          text: 'Hi there, is the studio still available for the dates I requested?',
          time: '10:12 AM',
          isRead: false
        },
        {
          id: 'M2',
          sender: { id: 'owner', name: 'Me', avatar: avatar },
          text: 'Hello John! Yes, the studio is available for your requested dates (Apr 12-16).',
          time: '10:15 AM',
          isRead: true
        },
        {
          id: 'M3',
          sender: { id: 'C1', name: 'John Doe', avatar: avatar },
          text: 'Great! Do you offer any discount for a 4-night stay?',
          time: '10:17 AM',
          isRead: false
        }
      ]
    },
    {
      id: 'C2',
      name: 'Alice Johnson',
      avatar: avatar,
      lastMessage: 'Thanks for approving my booking! Looking forward to our stay.',
      lastMessageTime: 'Yesterday',
      isOnline: false,
      unreadCount: 0,
      booking: {
        id: 'B1002',
        property: {
          name: 'Mountain View Chalet',
          location: 'Swiss Alps, Switzerland',
          image: i2
        },
        checkIn: 'Apr 20, 2025',
        checkOut: 'Apr 23, 2025',
        nights: 3,
        guests: 4,
        dogs: 2,
        status: 'pending',
        totalAmount: '690'
      },
      messages: [
        {
          id: 'M4',
          sender: { id: 'C2', name: 'Alice Johnson', avatar: avatar },
          text: 'Hi, I just submitted a booking request for your chalet. We\'re a family of 4 with 2 dogs.',
          time: 'Yesterday, 3:30 PM',
          isRead: true
        },
        {
          id: 'M5',
          sender: { id: 'owner', name: 'Me', avatar: avatar },
          text: 'Hello Alice! I received your booking request. Is this your first time in the Swiss Alps?',
          time: 'Yesterday, 4:15 PM',
          isRead: true
        },
        {
          id: 'M6',
          sender: { id: 'C2', name: 'Alice Johnson', avatar: avatar },
          text: 'Thanks for approving my booking! Looking forward to our stay.',
          time: 'Yesterday, 5:20 PM',
          isRead: true
        }
      ]
    }
  ]);
  
  // If a booking ID was provided in the URL, select the corresponding contact
  useEffect(() => {
    if (bookingId) {
      const contact = contacts.find(c => c.booking.id === bookingId);
      if (contact) {
        setSelectedContact(contact.id);
      }
    } else if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0].id);
    }
  }, [bookingId, contacts]);
  
  // Auto-scroll to the bottom of messages when a new message is added or contact changes
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [selectedContact, contacts]);
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.booking.property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentContact = contacts.find(contact => contact.id === selectedContact);
  
  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
    
    // Mark messages as read when selecting a contact
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { 
              ...contact, 
              unreadCount: 0,
              messages: contact.messages.map(msg => ({ ...msg, isRead: true }))
            }
          : contact
      )
    );
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const newMsg = {
      id: `M${Math.random().toString(36).substr(2, 9)}`,
      sender: { id: 'owner', name: 'Me', avatar: avatar },
      text: newMessage.trim(),
      time: timeString,
      isRead: false
    };
    
    // Update contacts with the new message
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === selectedContact 
          ? { 
              ...contact, 
              messages: [...contact.messages, newMsg],
              lastMessage: newMessage.trim(),
              lastMessageTime: timeString
            }
          : contact
      )
    );
    
    // Clear the input field
    setNewMessage('');
    
    // Focus back on the input field
    if (messageInputRef.current) {
      messageInputRef.current.focus();
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
            <h1 className="text-2xl font-semibold text-gray-900 ml-4">Messages</h1>
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
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      isActive={selectedContact === contact.id}
                      onClick={handleContactSelect}
                    />
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Section with Chat */}
              <div className="hidden sm:flex flex-col w-2/3">
                {currentContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={currentContact.avatar} 
                            alt={currentContact.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {currentContact.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{currentContact.name}</h3>
                          <p className="text-xs text-gray-500">
                            {currentContact.isOnline ? 'Online' : 'Last active: Yesterday'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                          onClick={() => setShowBookingInfo(!showBookingInfo)}
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat Body */}
                    <div className="flex-1 flex">
                      <div 
                        ref={messageContainerRef}
                        className={`flex-1 p-4 overflow-y-auto ${showBookingInfo ? 'w-2/3' : 'w-full'}`}
                      >
                        {/* Message bubbles */}
                        {currentContact.messages.map(message => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.sender.id === 'owner'}
                          />
                        ))}
                      </div>
                      
                      {/* Booking info sidebar */}
                      {showBookingInfo && (
                        <div className="w-1/3 border-l border-gray-200 p-4 overflow-y-auto">
                          <BookingInfoCard booking={currentContact.booking} />
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <textarea
                            ref={messageInputRef}
                            placeholder="Type a message..."
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
                      <p className="text-gray-500 mb-2">Select a conversation</p>
                      <p className="text-gray-400 text-sm">Choose a contact from the left to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProviderMessages;