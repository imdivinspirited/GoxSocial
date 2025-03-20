import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Paperclip, Send, Image, Video, FilePlus2, Smile } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const DUMMY_CHATS = [
  {
    id: 1,
    user: {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      isOnline: true
    },
    lastMessage: "Are you planning on visiting the Taj Mahal while in India?",
    timestamp: "2 mins"
  },
  {
    id: 2,
    user: {
      id: 3,
      name: "Wei Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      isOnline: true
    },
    lastMessage: "I love the photos you shared from Kyoto! 🌸",
    timestamp: "5 mins"
  },
  {
    id: 3,
    user: {
      id: 4,
      name: "Miguel Torres",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", 
      isOnline: false
    },
    lastMessage: "Do you recommend any tour guides for Machu Picchu?",
    timestamp: "Yesterday"
  },
  {
    id: 4,
    user: {
      id: 5,
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      isOnline: false 
    },
    lastMessage: "Let's meet up for dinner when we're both in Bangkok next month!",
    timestamp: "Yesterday"
  },
  {
    id: 5,
    user: {
      id: 6,
      name: "Alex Kim",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      isOnline: true
    },
    lastMessage: "I just booked my tickets to Bali! So excited!",
    timestamp: "2 days"
  }
];

// Sample conversation messages for the demo
const SAMPLE_MESSAGES = [
  {
    id: 1,
    sender: 2,
    text: "Hi there! I noticed you're planning a trip to India soon.",
    timestamp: "10:30 AM",
    status: "read"
  },
  {
    id: 2,
    sender: 1, // current user
    text: "Yes! I'm really excited. I'll be visiting Delhi, Agra, and Jaipur.",
    timestamp: "10:32 AM",
    status: "read"
  },
  {
    id: 3,
    sender: 2,
    text: "That's a great itinerary! The Golden Triangle is perfect for first-time visitors.",
    timestamp: "10:33 AM",
    status: "read"
  },
  {
    id: 4,
    sender: 2,
    text: "Are you planning on visiting the Taj Mahal while in Agra?",
    timestamp: "10:33 AM",
    status: "read"
  },
  {
    id: 5,
    sender: 1, // current user
    text: "Absolutely! It's one of the main reasons I'm going. Any tips for visiting?",
    timestamp: "10:35 AM",
    status: "read"
  },
  {
    id: 6,
    sender: 2,
    text: "I'd recommend going early in the morning, around sunrise. The lighting is beautiful for photos, and it's less crowded.",
    timestamp: "10:36 AM",
    status: "read"
  },
  {
    id: 7,
    sender: 2,
    text: "Also, hire a guide there. They can show you the best photo spots and tell you about the history.",
    timestamp: "10:37 AM", 
    status: "read"
  },
  {
    id: 8,
    sender: 2,
    text: "Here's a photo I took when I visited last year!",
    timestamp: "10:38 AM",
    status: "read",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState(DUMMY_CHATS[0]);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !attachmentType) return;
    
    const message = {
      id: messages.length + 1,
      sender: user?.id || 1, // current user
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    setAttachmentType(null);
    
    // Simulate a reply after 1-2 seconds
    setTimeout(() => {
      const replyMessage = {
        id: messages.length + 2,
        sender: selectedChat.user.id,
        text: "Thanks for sharing! I'll keep that in mind for my trip.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent"
      };
      
      setMessages(prev => [...prev, replyMessage]);
    }, 1500);
  };
  
  const handleAttachment = (type: string) => {
    setAttachmentType(type);
    toast({
      title: "Attachment added",
      description: `${type} attachment ready to send.`,
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
        {/* Chat List (Left Sidebar) */}
        <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-700">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <Tabs defaultValue="all">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            {DUMMY_CHATS.map((chat) => (
              <div 
                key={chat.id}
                className={`flex items-center gap-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors ${selectedChat.id === chat.id ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.user.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-800"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{chat.user.name}</h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Content (Right Side) */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedChat.user.avatar} alt={selectedChat.user.name} />
                <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedChat.user.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {selectedChat.user.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === (user?.id || 1) ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === (user?.id || 1) 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-neutral-100 dark:bg-neutral-700 rounded-bl-none'
                  }`}
                >
                  {message.text && <p className="mb-1">{message.text}</p>}
                  {message.image && (
                    <img src={message.image} alt="Shared image" className="rounded-md max-h-60 my-2" />
                  )}
                  <div className="text-right">
                    <span className={`text-xs ${message.sender === (user?.id || 1) ? 'text-neutral-200' : 'text-neutral-400'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            {attachmentType && (
              <div className="mb-2 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-md flex items-center justify-between">
                <span className="text-sm">1 {attachmentType} attachment ready to send</span>
                <Button variant="ghost" size="sm" onClick={() => setAttachmentType(null)}>
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleAttachment('image')}
                >
                  <Image className="h-5 w-5 text-neutral-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleAttachment('video')}
                >
                  <Video className="h-5 w-5 text-neutral-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleAttachment('file')}
                >
                  <FilePlus2 className="h-5 w-5 text-neutral-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Smile className="h-5 w-5 text-neutral-500" />
                </Button>
              </div>
              
              <Input 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              
              <Button onClick={handleSendMessage} disabled={newMessage.trim() === "" && !attachmentType}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}