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
  MapPin,
  Settings
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
  const chats = [];

  // Mock messages for selected chat
  const getMessagesForChat = (chatId) => {
    return [];
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

  // Conversation List View - Default "Coming Soon" state
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
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className={`transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-rose-100/50 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This section is under development</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Window View (kept in case it's accessed directly)
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
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-bold text-gray-900">Chat</h2>
                  </div>
                  <p className="text-xs text-gray-600">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-4 overflow-y-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600">This section is under development</p>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-rose-100/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                disabled
                type="text"
                placeholder="Feature coming soon..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full bg-gray-100"
              />
            </div>
            
            <button
              disabled
              className="p-3 rounded-full bg-gray-100 text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}