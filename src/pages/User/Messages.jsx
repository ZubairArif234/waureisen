import React, { useState } from 'react';
import { Search, Sliders, MessageSquare, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/HomeComponents/Navbar';
import Avt from '../../assets/avatar.png';

// Dummy data for conversations
const dummyConversations = [
  {
    id: 1,
    name: 'John Smith',
    lastMessage: 'Perfect! Looking forward to staying at your place.',
    timestamp: '2h ago',
    unread: true,
    avatar: Avt
  },
  {
    id: 2,
    name: 'Emma Williams',
    lastMessage: 'Is the property available for the dates mentioned?',
    timestamp: '5h ago',
    unread: true,
    avatar: Avt
  },
  {
    id: 3,
    name: 'Michael Brown',
    lastMessage: 'Thank you for the amazing stay!',
    timestamp: 'Yesterday',
    unread: false,
    avatar: Avt
  },
  {
    id: 4,
    name: 'Sarah Davis',
    lastMessage: 'Can you share more details about pet policies?',
    timestamp: '2 days ago',
    unread: false,
    avatar: Avt
  }
];

// Dummy messages for a conversation
const dummyMessages = [
  {
    id: 1,
    sender: 'John Smith',
    content: 'Hi, I am interested in booking your place for next month.',
    timestamp: '2 days ago',
    isUser: false
  },
  {
    id: 2,
    sender: 'You',
    content: 'Hello! Thank you for your interest. The place is available.',
    timestamp: '2 days ago',
    isUser: true
  },
  {
    id: 3,
    sender: 'John Smith',
    content: 'Great! Is it pet friendly? I will be traveling with my dog.',
    timestamp: '1 day ago',
    isUser: false
  },
  {
    id: 4,
    sender: 'You',
    content: 'Yes, we welcome pets! There is also a fenced garden area.',
    timestamp: '1 day ago',
    isUser: true
  },
  {
    id: 5,
    sender: 'John Smith',
    content: 'Perfect! Looking forward to staying at your place.',
    timestamp: '2h ago',
    isUser: false
  }
];

const MessageBubble = ({ message }) => (
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[70%] ${message.isUser ? 'bg-[#B4A481] text-white' : 'bg-gray-100'} rounded-2xl px-4 py-2`}>
      <p className="text-sm">{message.content}</p>
      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
    </div>
  </div>
);

const ConversationItem = ({ conversation, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
      isSelected ? 'bg-gray-50' : ''
    } ${conversation.unread ? 'font-medium' : ''}`}
  >
    <img 
      src={conversation.avatar} 
      alt={conversation.name} 
      className="w-10 h-10 rounded-full"
    />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h3 className="text-sm text-gray-900 truncate">{conversation.name}</h3>
        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
      </div>
      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
    </div>
  </div>
);

const Messages = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState(dummyConversations);

  const filteredConversations = conversations.filter(conv => 
    selectedFilter === 'all' || (selectedFilter === 'unread' && conv.unread)
  ).filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>
              
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
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('unread')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedFilter === 'unread'
                      ? 'bg-[#B4A481] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages"
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

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No messages found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedChat?.id === conversation.id}
                    onClick={() => setSelectedChat(conversation)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Chat View */}
          <div className={`${
            selectedChat ? 'flex' : 'hidden md:flex'
          } flex-1 flex flex-col bg-white`}>
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
                    src={selectedChat.avatar} 
                    alt={selectedChat.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-medium">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-500">Active Now</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {dummyMessages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#B4A481] text-white rounded-full text-sm">
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;