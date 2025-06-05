"use client"
import { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Search,
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Shield,
  Clock,
  Check,
  CheckCheck,
  Circle,
  Dot,
  Bell,
  BellOff,
  Flag,
  Heart,
  Star,
  Edit3,
  Image,
  X,
  Plus,
  MessageCircle,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

export default function ChatSection() {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'chat'
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && currentView === 'chat') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, currentView]);

  // Mock chat data
  const chats = [
    {
      id: 1,
      name: "Arjun Kumar",
      age: 29,
      location: "Chennai, Tamil Nadu",
      profilePic: null,
      isOnline: true,
      lastMessage: "Looking forward to our conversation! 😊",
      lastMessageTime: "2024-06-05T10:30:00Z",
      unreadCount: 2,
      isTyping: false,
      status: 'mutual',
      badges: ['Premium', 'Verified']
    },
    {
      id: 2,
      name: "Karthik Nair",
      age: 27,
      location: "Kochi, Kerala",
      profilePic: null,
      isOnline: false,
      lastMessage: "Would love to know more about you!",
      lastMessageTime: "2024-06-04T18:45:00Z",
      unreadCount: 0,
      isTyping: false,
      status: 'mutual',
      badges: ['Recently Active']
    },
    {
      id: 3,
      name: "Rohit Jain",
      age: 26,
      location: "Pune, Maharashtra",
      profilePic: null,
      isOnline: true,
      lastMessage: "Thank you for accepting my interest",
      lastMessageTime: "2024-06-04T14:20:00Z",
      unreadCount: 1,
      isTyping: true,
      status: 'mutual',
      badges: ['Premium']
    },
    {
      id: 4,
      name: "Meera Sharma",
      age: 27,
      location: "Jaipur, Rajasthan",
      profilePic: null,
      isOnline: false,
      lastMessage: "Hi! Nice to connect with you",
      lastMessageTime: "2024-06-03T12:15:00Z",
      unreadCount: 0,
      isTyping: false,
      status: 'mutual',
      badges: ['Verified']
    }
  ];

  // Mock messages for selected chat
  const getMessagesForChat = (chatId) => {
    const messageData = {
      1: [
        {
          id: 1,
          senderId: 1,
          message: "Hi Priya! Thanks for accepting my interest 😊",
          timestamp: "2024-06-05T09:00:00Z",
          status: 'seen',
          type: 'text'
        },
        {
          id: 2,
          senderId: 'me',
          message: "Hello Arjun! Nice to connect with you too",
          timestamp: "2024-06-05T09:15:00Z",
          status: 'delivered',
          type: 'text'
        },
        {
          id: 3,
          senderId: 1,
          message: "I saw your profile and we seem to have a lot in common. Would love to know more about you!",
          timestamp: "2024-06-05T09:20:00Z",
          status: 'seen',
          type: 'text'
        },
        {
          id: 4,
          senderId: 'me',
          message: "That's wonderful! I'd be happy to share more about myself. What would you like to know?",
          timestamp: "2024-06-05T09:25:00Z",
          status: 'delivered',
          type: 'text'
        },
        {
          id: 5,
          senderId: 1,
          message: "Looking forward to our conversation! 😊",
          timestamp: "2024-06-05T10:30:00Z",
          status: 'delivered',
          type: 'text'
        }
      ]
    };
    return messageData[chatId] || [];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const openChat = (chat) => {
    setSelectedChat(chat);
    setCurrentView('chat');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send via WebSocket/API
      console.log('Sending message:', newMessage);
      setNewMessage('');
      messageInputRef.current?.focus();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBadgeStyle = (badge) => {
    switch(badge) {
      case 'Premium':
        return 'bg-amber-100 text-amber-800';
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Recently Active':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Conversation List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Chats</h1>
                    <p className="text-gray-600">Connect with your mutual matches</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">{chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}</div>
                      <div className="text-xs text-gray-500">Unread</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{chats.filter(chat => chat.isOnline).length}</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats by name or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Conversations ({filteredChats.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 mb-4">Start chatting with your mutual matches!</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => openChat(chat)}
                      className="p-4 hover:bg-rose-50/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                            <User className="w-7 h-7 text-rose-500" />
                          </div>
                          {chat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                          {chat.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{chat.unreadCount}</span>
                            </div>
                          )}
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-gray-900">{chat.name}</h3>
                              {chat.badges.includes('Verified') && (
                                <Shield className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <span>{formatTime(chat.lastMessageTime)}</span>
                              {chat.unreadCount === 0 && <Dot className="w-4 h-4" />}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <span>{chat.age} years • {chat.location}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {chat.isTyping ? (
                                  <span className="text-rose-600 italic">Typing...</span>
                                ) : (
                                  chat.lastMessage
                                )}
                              </p>
                            </div>
                            
                            {/* Badges */}
                            <div className="flex space-x-1 ml-2">
                              {chat.badges.slice(0, 1).map((badge, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(badge)}`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Window View
  const messages = getMessagesForChat(selectedChat?.id);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-lg border-b border-rose-100/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-rose-500" />
                  </div>
                  {selectedChat?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-bold text-gray-900">{selectedChat?.name}</h2>
                    {selectedChat?.badges.includes('Verified') && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {selectedChat?.isOnline ? (
                      isTyping ? 'Typing...' : 'Online'
                    ) : (
                      `Last seen ${formatTime(selectedChat?.lastMessageTime)}`
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your conversation</h3>
              <p className="text-gray-600">Say hello to {selectedChat?.name}!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === 'me'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <div className={`flex items-center justify-between mt-1 space-x-2 ${
                    message.senderId === 'me' ? 'text-rose-100' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatMessageTime(message.timestamp)}</span>
                    {message.senderId === 'me' && (
                      <div className="flex items-center">
                        {getMessageStatus(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-rose-100/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
              <Image className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-rose-50 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full transition-colors ${
                newMessage.trim()
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}