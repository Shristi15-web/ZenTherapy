import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Bot,
  User,
  Heart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  className?: string;
}

// Mock responses for wellness queries
const responses = {
  greetings: [
    "Namaste! 🙏 Welcome to Zen Therapy. I'm your wellness assistant. How can I help you on your journey to better health today?",
    "Hello! I'm here to provide guidance on Ayurvedic practices and wellness. What would you like to know?",
    "Greetings! I'm your virtual wellness companion. Feel free to ask me about our treatments, yoga practices, or general wellness tips.",
  ],
  stress: [
    "For stress relief, I recommend trying Pranayama breathing exercises. Start with deep belly breathing for 5 minutes daily. Would you like me to guide you through a simple technique?",
    "Stress can be managed naturally through Ayurveda. Consider Abhyanga (oil massage), meditation, and herbs like Ashwagandha. Our practitioners can create a personalized plan for you.",
    "Try this quick stress-relief technique: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times. This activates your parasympathetic nervous system.",
  ],
  sleep: [
    "For better sleep, establish a evening routine: no screens 1 hour before bed, warm herbal tea (chamomile or tulsi), and gentle stretching. Avoid heavy meals 3 hours before sleep.",
    "Poor sleep often indicates Vata imbalance in Ayurveda. Try warm milk with a pinch of nutmeg, foot massage with sesame oil, and keep your bedroom cool and dark.",
    "Consider our Shirodhara treatment for deep relaxation and improved sleep quality. The warm oil therapy calms the nervous system naturally.",
  ],
  diet: [
    "According to Ayurveda, eat according to your dosha constitution. Generally, favor warm, cooked foods over cold/raw, eat your largest meal at midday, and practice mindful eating.",
    "For optimal digestion, drink warm water throughout the day, avoid ice-cold drinks with meals, and include digestive spices like ginger, cumin, and fennel in your cooking.",
    "Consider a consultation to determine your Ayurvedic constitution (Vata, Pitta, or Kapha) for personalized dietary recommendations.",
  ],
  meditation: [
    "Start with just 5 minutes daily. Sit comfortably, focus on your breath, and when your mind wanders, gently return attention to breathing. Consistency matters more than duration.",
    "Try our guided meditation sessions! We offer Mindfulness, Loving-kindness, and Mantra meditation. Each has unique benefits for mental clarity and emotional balance.",
    "Meditation is like training for the mind. Begin with simple breath awareness and gradually explore different techniques to find what resonates with you.",
  ],
  appointments: [
    "I can help you understand our services, but for booking appointments, please use our online scheduler or call our center directly. Our practitioners would love to meet you!",
    "We offer various treatments including Panchakarma, Abhyanga, Shirodhara, and consultation sessions. Would you like to know more about any specific treatment?",
    "Our practitioners are available for consultations Monday through Saturday. Initial consultations include dosha assessment and personalized treatment planning.",
  ],
  treatments: [
    "We specialize in authentic Ayurvedic treatments. Popular options include Abhyanga (full-body oil massage), Shirodhara (oil pouring therapy), and Panchakarma (detoxification).",
    "Each treatment is customized based on your constitution and current health needs. Our practitioners use traditional techniques with premium oils and herbs.",
    "Treatment duration varies: Abhyanga (60-90 min), Shirodhara (45-60 min), Consultation (60 min). All treatments include pre and post-care guidance.",
  ],
  general: [
    "Ayurveda focuses on prevention and treating the root cause, not just symptoms. It emphasizes balance between mind, body, and spirit through lifestyle, diet, and natural remedies.",
    "Our center combines traditional Ayurvedic wisdom with modern comfort. All our practitioners are certified and experienced in authentic Ayurvedic methods.",
    "Wellness is a journey, not a destination. Small, consistent changes in daily routine can lead to significant improvements in health and vitality.",
  ],
  fallback: [
    "That's an interesting question! While I can provide general wellness guidance, I'd recommend speaking with our qualified practitioners for personalized advice. Would you like to know about our consultation services?",
    "I'm still learning about that topic. For specific health concerns, our experienced Ayurvedic doctors can provide the best guidance. Can I help you with general wellness information instead?",
    "I want to make sure you get accurate information. For detailed questions about treatments or health conditions, our practitioners are the best resource. Is there anything else about our services I can help with?",
  ],
};

const quickSuggestions = [
  "How to reduce stress naturally?",
  "What is my dosha type?",
  "Best foods for digestion",
  "Meditation for beginners",
  "Book an appointment",
  "Treatment options",
];

const SimulatedChatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const welcomeMessage: ChatMessage = {
        id: "1",
        text: responses.greetings[0],
        sender: "bot",
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 4),
      };
      setMessages([welcomeMessage]);
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Check for keywords in user message
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("namaste")
    ) {
      return responses.greetings[
        Math.floor(Math.random() * responses.greetings.length)
      ];
    }

    if (
      message.includes("stress") ||
      message.includes("anxiety") ||
      message.includes("worry")
    ) {
      return responses.stress[
        Math.floor(Math.random() * responses.stress.length)
      ];
    }

    if (
      message.includes("sleep") ||
      message.includes("insomnia") ||
      message.includes("tired")
    ) {
      return responses.sleep[
        Math.floor(Math.random() * responses.sleep.length)
      ];
    }

    if (
      message.includes("diet") ||
      message.includes("food") ||
      message.includes("eat") ||
      message.includes("nutrition")
    ) {
      return responses.diet[Math.floor(Math.random() * responses.diet.length)];
    }

    if (
      message.includes("meditat") ||
      message.includes("mindful") ||
      message.includes("focus")
    ) {
      return responses.meditation[
        Math.floor(Math.random() * responses.meditation.length)
      ];
    }

    if (
      message.includes("appointment") ||
      message.includes("book") ||
      message.includes("schedule")
    ) {
      return responses.appointments[
        Math.floor(Math.random() * responses.appointments.length)
      ];
    }

    if (
      message.includes("treatment") ||
      message.includes("therapy") ||
      message.includes("massage") ||
      message.includes("abhyanga") ||
      message.includes("shirodhara")
    ) {
      return responses.treatments[
        Math.floor(Math.random() * responses.treatments.length)
      ];
    }

    if (
      message.includes("dosha") ||
      message.includes("ayurveda") ||
      message.includes("constitution") ||
      message.includes("vata") ||
      message.includes("pitta") ||
      message.includes("kapha")
    ) {
      return responses.general[
        Math.floor(Math.random() * responses.general.length)
      ];
    }

    // Fallback response
    return responses.fallback[
      Math.floor(Math.random() * responses.fallback.length)
    ];
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getResponse(messageText);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        suggestions:
          Math.random() > 0.5 ? quickSuggestions.slice(0, 3) : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const resetChat = () => {
    setMessages([]);
    setHasInitialized(false);
    const welcomeMessage: ChatMessage = {
      id: "1",
      text: responses.greetings[1],
      sender: "bot",
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 4),
    };
    setMessages([welcomeMessage]);
    setHasInitialized(true);
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card
        className={`w-80 h-96 shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-14" : "h-96"
        }`}
      >
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm">Wellness Assistant</CardTitle>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "bot" ? (
                            <Bot className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 justify-start">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-7 rounded-full"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs text-gray-600">Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && sendMessage(inputValue)
                  }
                  placeholder="Ask about wellness, treatments..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => sendMessage(inputValue)}
                  size="sm"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                <Heart className="h-3 w-3 inline mr-1" />
                For medical advice, consult our practitioners
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SimulatedChatbot;
