import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface ChatInterfaceProps {
  query: string;
  results: any[];
  onNewSearch: (query: string) => void;
}

export function ChatInterface({ query, results, onNewSearch }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: 'Hallo! Ich bin Ihr KI-Assistent für intelligente Suche. Stellen Sie mir Fragen zu Ihren Suchergebnissen oder bitten Sie mich um weiterführende Recherchen.',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, results);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        sources: aiResponse.sources
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input: string, searchResults: any[]) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('zusammenfass') || lowerInput.includes('summary')) {
      return {
        content: `Basierend auf den aktuellen Suchergebnissen kann ich folgende Kernpunkte zusammenfassen:

**Hauptthemen:**
• Künstliche Intelligenz revolutioniert Suchmaschinenoptimierung
• Machine Learning verbessert Nutzerverständnis
• Natural Language Processing ermöglicht bessere Sprachinterpretation
• Semantische Suche nutzt Kontext für präzisere Ergebnisse

**Wichtige Erkenntnisse:**
Die gefundenen Quellen zeigen einen klaren Trend hin zu intelligenteren, kontextbewussten Suchsystemen. Besonders bemerkenswert ist die Entwicklung von multimodalen KI-Systemen, die verschiedene Medientypen gleichzeitig verarbeiten können.

Möchten Sie, dass ich tiefer in einen bestimmten Aspekt einsteige?`,
        sources: ['TechBlog', 'AI Research', 'Search Technology']
      };
    }

    if (lowerInput.includes('quelle') || lowerInput.includes('referenz')) {
      return {
        content: `Die aktuellen Suchergebnisse stammen aus vertrauenswürdigen Quellen:

**Hauptquellen:**
• **TechBlog** - Spezialisiert auf KI und Suchmaschinenoptimierung
• **AI Research** - Akademische Forschung zu Machine Learning
• **Search Technology** - Technische Einblicke in Suchsysteme
• **Future Tech** - Trends und Zukunftsprognosen
• **Ethics Journal** - Ethische Aspekte der KI-Entwicklung

Alle Quellen wurden auf Aktualität und Relevanz geprüft. Die Vertrauenswürdigkeit liegt bei durchschnittlich 91%.`,
        sources: ['Alle aktuellen Suchergebnisse']
      };
    }

    if (lowerInput.includes('vergleich') || lowerInput.includes('unterschied')) {
      return {
        content: `Hier ist ein Vergleich der wichtigsten Konzepte aus den Suchergebnissen:

**Traditionelle vs. KI-gestützte Suche:**
• **Keyword-Matching vs. Semantisches Verstehen** - KI erfasst Kontext und Bedeutung
• **Statische Algorithmen vs. Lernende Systeme** - KI verbessert sich kontinuierlich
• **Einzelne Modalitäten vs. Multimodale Verarbeitung** - KI kann Text, Bild und Audio kombinieren

**Machine Learning vs. Deep Learning:**
• ML nutzt strukturierte Datenanalyse
• DL ermöglicht komplexere Mustererkennnung durch neuronale Netze

Soll ich einen bestimmten Aspekt genauer erläutern?`,
        sources: ['TechBlog', 'AI Research']
      };
    }

    // Default response
    return {
      content: `Das ist eine interessante Frage! Basierend auf den verfügbaren Suchergebnissen kann ich folgende Einblicke bieten:

Die aktuellen Entwicklungen im Bereich KI-gestützter Suche zeigen mehrere wichtige Trends:

1. **Verbesserte Sprachverarbeitung** - Systeme verstehen natürliche Sprache immer besser
2. **Kontextuelle Relevanz** - Suchergebnisse werden präziser und situationsangepasst
3. **Multimodale Integration** - Kombination verschiedener Medientypen für umfassendere Antworten

Haben Sie spezifische Fragen zu einem dieser Bereiche? Ich kann auch eine neue Suche zu verwandten Themen durchführen.`,
      sources: results.slice(0, 3).map(r => r.source)
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-search-primary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`chat-message ${message.type === 'user' ? 'chat-user' : 'chat-ai'}`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-search-border/30">
                        <span className="text-xs text-muted-foreground mr-2">Quellen:</span>
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-search-border/30">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-search-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="chat-message chat-ai">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-muted-foreground">KI schreibt...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Chat Input */}
          <div className="border-t border-search-border p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Stellen Sie Fragen zu den Suchergebnissen..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="search-button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Drücken Sie Enter zum Senden • Shift+Enter für neue Zeile</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}