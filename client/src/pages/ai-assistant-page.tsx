import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Send, CornerDownLeft, Sparkles, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Pre-defined responses for different travel-related queries
const AI_RESPONSES = {
  greetings: [
    "Hello! I'm your TourviaHPT virtual assistant. How can I help with your travel plans today?",
    "Hi there! I'm here to help make your travel experience amazing. What are you looking for?",
    "Welcome to TourviaHPT! I'm your AI travel companion. How can I assist you today?"
  ],
  destinations: [
    "Based on your interests in cultural experiences and nature, I'd recommend visiting Kyoto, Japan. The city offers a perfect blend of historic temples, beautiful gardens, and authentic cultural experiences.",
    "For a beach vacation with adventure opportunities, Costa Rica would be an excellent choice. You can enjoy pristine beaches, rainforest hikes, wildlife encounters, and activities like surfing and zip-lining.",
    "If you're looking for a European city with rich history and amazing food, Barcelona offers stunning architecture, beautiful beaches, and incredible cuisine - all in one location."
  ],
  budget: [
    "For a budget-friendly vacation, consider destinations like Thailand, Vietnam, or Portugal. These countries offer great value with affordable accommodations, food, and activities.",
    "To save money on your trip, consider traveling during shoulder season (just before or after peak season), using public transportation, staying in accommodations with kitchen facilities, and looking for free attractions and activities.",
    "When traveling on a budget, look for flight deals using tools like Google Flights or Skyscanner, stay in hostels or use home-sharing services, and eat where locals eat instead of tourist restaurants."
  ],
  weather: [
    "The best time to visit tropical destinations is usually during the dry season, which varies by location. For Southeast Asia, November to February is ideal. The Caribbean is best from December to April.",
    "European destinations are most pleasant from May to September, but if you want to avoid crowds, consider visiting in May or September when the weather is still nice but tourist numbers are lower.",
    "If you're planning to visit mountainous regions for hiking, summer months (June to August in the Northern Hemisphere) offer the best conditions with clear trails and stable weather."
  ],
  safety: [
    "When traveling, always keep digital and physical copies of important documents like your passport, keep emergency contacts accessible, and register with your country's embassy if visiting a less stable region.",
    "For solo travelers, I recommend staying in well-reviewed accommodations in safe neighborhoods, sharing your itinerary with someone you trust, and being cautious about sharing too many details with strangers.",
    "Travel insurance is highly recommended for all trips, as it can cover medical emergencies, trip cancellations, lost luggage, and other unexpected situations that might arise during your travels."
  ],
  packing: [
    "For any trip, essentials include adaptable clothing that can be layered, comfortable walking shoes, a first-aid kit, important medications, universal adapter, reusable water bottle, and photocopies of important documents.",
    "When packing for a beach vacation, bring reef-safe sunscreen, after-sun care, a hat, sunglasses, flip-flops, a light cover-up, and quick-dry towel in addition to your swimwear.",
    "For winter destinations, pack thermal base layers, waterproof outerwear, warm accessories (hat, gloves, scarf), insulated waterproof boots, lip balm, and moisturizer for dry skin conditions."
  ]
};

// Common travel questions with their categories
const COMMON_QUESTIONS = [
  { text: "What are the top destinations to visit this year?", category: "destinations" },
  { text: "How can I travel on a budget?", category: "budget" },
  { text: "When is the best time to visit tropical countries?", category: "weather" },
  { text: "What safety precautions should I take while traveling?", category: "safety" },
  { text: "What should I pack for my upcoming trip?", category: "packing" }
];

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
};

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your TourviaHPT virtual assistant. How can I help with your travel plans today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const getAIResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (
      lowerCaseMessage.includes("hello") || 
      lowerCaseMessage.includes("hi") || 
      lowerCaseMessage.includes("hey")
    ) {
      return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)];
    }
    
    // Check for destination questions
    if (
      lowerCaseMessage.includes("where should i go") || 
      lowerCaseMessage.includes("recommend a destination") || 
      lowerCaseMessage.includes("best place to visit") ||
      lowerCaseMessage.includes("top destinations")
    ) {
      return AI_RESPONSES.destinations[Math.floor(Math.random() * AI_RESPONSES.destinations.length)];
    }
    
    // Check for budget questions
    if (
      lowerCaseMessage.includes("budget") || 
      lowerCaseMessage.includes("cheap") || 
      lowerCaseMessage.includes("affordable") ||
      lowerCaseMessage.includes("save money")
    ) {
      return AI_RESPONSES.budget[Math.floor(Math.random() * AI_RESPONSES.budget.length)];
    }
    
    // Check for weather/timing questions
    if (
      lowerCaseMessage.includes("when should i visit") || 
      lowerCaseMessage.includes("best time") || 
      lowerCaseMessage.includes("weather") ||
      lowerCaseMessage.includes("season")
    ) {
      return AI_RESPONSES.weather[Math.floor(Math.random() * AI_RESPONSES.weather.length)];
    }
    
    // Check for safety questions
    if (
      lowerCaseMessage.includes("safe") || 
      lowerCaseMessage.includes("security") || 
      lowerCaseMessage.includes("danger") ||
      lowerCaseMessage.includes("precaution")
    ) {
      return AI_RESPONSES.safety[Math.floor(Math.random() * AI_RESPONSES.safety.length)];
    }
    
    // Check for packing questions
    if (
      lowerCaseMessage.includes("pack") || 
      lowerCaseMessage.includes("bring") || 
      lowerCaseMessage.includes("luggage") ||
      lowerCaseMessage.includes("suitcase")
    ) {
      return AI_RESPONSES.packing[Math.floor(Math.random() * AI_RESPONSES.packing.length)];
    }
    
    // Default response if no patterns match
    return "I'm not sure about that specific query. Could you ask about destinations, budget travel, best timing, safety tips, or packing advice? I'm here to help with your travel planning!";
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    
    // Simulate AI thinking and typing (1-2 seconds)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: getAIResponse(userMessage.text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSuggestedQuestion = (question: string, category: string) => {
    // Add user message with the suggested question
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setIsTyping(true);
    
    // Simulate AI thinking and typing (1-2 seconds)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: AI_RESPONSES[category as keyof typeof AI_RESPONSES][
          Math.floor(Math.random() * AI_RESPONSES[category as keyof typeof AI_RESPONSES].length)
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <AppShell>
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 bg-primary">
            <Bot className="text-white h-6 w-6" />
          </Avatar>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              TourviaHPT AI Assistant
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your personal travel planning companion
            </p>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg mb-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex mb-4 ${message.sender === "user" ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary">
                    <Bot className="text-white h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === "user" 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-neutral-700'
                }`}
              >
                <p className="mb-1">{message.text}</p>
                <div className="text-right">
                  <span className={`text-xs ${message.sender === "user" ? 'text-neutral-200' : 'text-neutral-400'}`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
              
              {message.sender === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage src={user?.profileImage || undefined} alt={user?.username} />
                  <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary">
                  <Bot className="text-white h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-neutral-700 rounded-lg p-3 flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
        
        {/* Suggested questions */}
        <div className="mb-4 flex flex-wrap gap-2">
          {COMMON_QUESTIONS.map((question, index) => (
            <Button 
              key={index}
              variant="outline"
              className="text-sm"
              onClick={() => handleSuggestedQuestion(question.text, question.category)}
            >
              {question.text}
            </Button>
          ))}
        </div>
        
        {/* Message input */}
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Ask me anything about travel..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          
          <Button onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
          <p>This is a simulated AI assistant for demonstration purposes.</p>
          <p>For real AI assistance, we recommend integrating with OpenAI or Anthropic API.</p>
        </div>
      </div>
    </AppShell>
  );
}