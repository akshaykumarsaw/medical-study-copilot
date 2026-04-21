'use client';

import React, { useState, useEffect, useRef } from 'react';
import { tutorService, ChatMessage } from '@/services/tutor.service';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TutorPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string; id: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsFetchingHistory(true);
        const history = await tutorService.getHistory();
        
        const formattedMessages: { role: 'user' | 'bot'; content: string; id: string }[] = [];
        history.forEach(item => {
          formattedMessages.push({ role: 'user', content: item.question, id: `${item.id}-q` });
          if (item.answer) {
            formattedMessages.push({ role: 'bot', content: item.answer, id: `${item.id}-a` });
          }
        });
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const tempId = Date.now().toString();
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, id: `temp-${tempId}` }]);
    setIsLoading(true);

    try {
      const response = await tutorService.askQuestion(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: response.answer, id: `${response.id}-a` }]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having trouble connecting right now. Please try again.", id: `error-${tempId}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-7xl mx-auto rounded-xl border border-medical-brown/10 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-medical-brown/10 bg-parchment flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-medical-brown text-lg">AI Tutor</h2>
            <p className="text-xs text-medical-muted">Always ready to discuss cases & concepts</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-parchment-light/30">
        {isFetchingHistory ? (
          <div className="flex items-center justify-center h-full text-medical-muted">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal mb-2">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-medical-brown">How can I help you today?</h3>
            <p className="text-sm text-medical-muted">
              Ask about clinical scenarios, anatomical structures, or upload a case study to get started.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-medical-brown text-white' : 'bg-medical-teal text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-medical-brown text-white rounded-tr-sm' 
                  : 'bg-white border border-medical-brown/10 text-medical-brown rounded-tl-sm shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4 max-w-[90%]">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm bg-medical-teal text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-medical-brown/10 text-medical-brown rounded-tl-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-medical-brown/10">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto relative relative">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your medical query here... (Shift+Enter for new line)"
              className="w-full bg-parchment-light border border-medical-brown/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal resize-none min-h-[56px] max-h-32 text-sm text-medical-brown font-sans shadow-inner placeholder:text-medical-muted"
              rows={1}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="shrink-0 h-14 w-14 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Send className="w-5 h-5 -ml-1" />
          </Button>
        </form>
        <div className="text-center mt-2 px-4">
          <p className="text-[10px] text-medical-muted">
            ARIVU can make mistakes in diagnosis suggestions. Always verify with actual medical protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
