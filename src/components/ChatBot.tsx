import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, Paperclip, ArrowUp, Mail, Image, Lightbulb, ListChecks, Code, PenLine, GraduationCap, Mic, Heart, Calendar, Phone, FileText, Users, Flower2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isSidebarCollapsed: boolean;
  inline?: boolean;
}
const ChatBot: React.FC<ChatBotProps> = ({ isSidebarCollapsed, inline = false }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Khambi Ai, your compassionate AI assistant for Khambi Funeral Services. I'm here to help you with any questions about our packages, planning, or cultural traditions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGroqAPI = async (userMessage: string) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const systemPrompt = `You are Khambi Ai, a compassionate AI assistant for Khambi Funeral Services in South Africa. You help grieving families navigate funeral planning with dignity and care.

Key information about Khambi Funeral Services:
- Packages: BRONZE (R15,000 Cover - Flat Lid Coffin, 1 Family Car, 50 Chairs), SILVER (R20,000 Cover - Face-view Casket, 2 Family Cars, 50 Chairs), GOLD (R25,000 Cover - Half-view Casket, 2 Family Cars, 100 Chairs & VIP Toilet)
- Services: Traditional ceremonies, modern memorials, casket selection, transportation, personalized planning
- Cultural respect: Honor all traditions (Sepedi, Xitsonga, English, Venda, Zulu, Xhosa)
- Contact: khambi@khambifunerals.co.za, 012 820 1084, 084 583 7299 (Mobile), www.khambifunerals.com
- AI support: OpenAI integration ready for compassionate guidance

Always respond with empathy, cultural sensitivity, and practical help. Keep responses concise but caring. If asked about pricing, be transparent about the packages. If emotional support is needed, provide compassionate guidance.`;

    try {
      console.log('Making Groq API call...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma2-9b-it',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API error details:', error);
      // Fallback to simulated response if API fails
      const responses = [
        "Thank you for your question. At Khambi Funeral Services, we offer three main packages: Basic Dignity (R8,500), Premium Memorial (R18,500), and Complete Celebration (R35,000). Each package includes essential services like casket selection, transportation, and ceremony coordination. Which package interests you most?",
        "I'm here to help with your funeral planning needs. Our compassionate team understands how difficult this time can be. We honor all cultural traditions. Would you like me to explain our services or connect you with our support team?",
        "We provide comprehensive funeral services with dignity and respect for every family. Our packages are designed to honor your loved one according to your cultural traditions. Please feel free to ask about any specific aspect of our services.",
        "During this difficult time, we're committed to supporting your family with compassion. Our services include traditional ceremonies, modern memorials, and personalized planning. How can I assist you today?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Small delay to show loading state even with fast models
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const botResponse = await callGroqAPI(inputValue);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact our support team directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (inline) {
    return (
      <div className={`rounded-2xl shadow-xl border overflow-hidden ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Chat Header */}
        <div className={`flex items-center gap-3 p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDark ? 'bg-khambi-accent/20' : 'bg-khambi-accent/10'
          }`}>
            <Bot className={`w-6 h-6 ${isDark ? 'text-khambi-accent' : 'text-khambi-gold'}`} />
          </div>
          <div>
            <h4 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Khambi Ai Assistant
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Online • Ready to help
            </p>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="h-96 p-6 overflow-y-auto bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-khambi-accent/20' : 'bg-khambi-accent/10'
                  }`}>
                    <Bot className={`w-4 h-4 ${isDark ? 'text-khambi-accent' : 'text-khambi-gold'}`} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? `rounded-br-md ${isDark ? 'bg-khambi-primary text-white' : 'bg-khambi-primary text-white'}`
                      : `rounded-bl-md ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user'
                      ? 'text-green-100'
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>U</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Input Box */}
          <div className={`relative rounded-2xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <div className="flex items-start gap-2 p-3">
              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                <Paperclip className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Start your chat here or use the voice feature"
                disabled={isLoading}
                rows={3}
                className={`flex-1 bg-transparent border-none outline-none resize-none ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="flex flex-col gap-2">
                <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                  <Mic className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    inputValue.trim() && !isLoading
                      ? isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                      : isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion Buttons */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Heart className="w-4 h-4" />
              Plan a memorial
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Calendar className="w-4 h-4" />
              Schedule service
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Flower2 className="w-4 h-4" />
              Choose casket
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Users className="w-4 h-4" />
              Family support
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <FileText className="w-4 h-4" />
              Documentation
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Phone className="w-4 h-4" />
              Contact support
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Lightbulb className="w-4 h-4" />
              Get guidance
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${isSidebarCollapsed ? 'lg:right-6' : 'lg:right-24'}`}>
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-200 ${
            isDark
              ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Bot className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Talk to Khambi Ai
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-full max-w-md ${isSidebarCollapsed ? 'lg:right-6' : 'lg:right-24'}`}>
      <div className={`rounded-2xl shadow-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <Bot className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Talk to Khambi Ai
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                AI Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Minimize2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <Bot className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? `rounded-br-md ${isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`
                    : `rounded-bl-md ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user'
                    ? 'text-green-100'
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}>
                  <User className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Input Box */}
          <div className={`relative rounded-2xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <div className="flex items-center gap-2 p-2">
              <button className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                <Paperclip className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Start your chat here or use the voice feature"
                disabled={isLoading}
                className={`flex-1 bg-transparent border-none outline-none ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />
              <button className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                <Mic className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`p-1.5 rounded-lg transition-colors ${
                  inputValue.trim() && !isLoading
                    ? isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                    : isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Suggestion Buttons - Horizontal scroll on mobile */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Heart className="w-3 h-3" />
              Plan a memorial
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Calendar className="w-3 h-3" />
              Schedule service
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Flower2 className="w-3 h-3" />
              Choose casket
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Users className="w-3 h-3" />
              Family support
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <FileText className="w-3 h-3" />
              Documentation
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Phone className="w-3 h-3" />
              Contact support
            </button>
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}>
              <Lightbulb className="w-3 h-3" />
              Get guidance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

