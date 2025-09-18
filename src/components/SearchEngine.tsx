import React, { useState } from 'react';
import { Search, Sparkles, MessageSquare, FileText, Brain, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchResults } from './SearchResults';
import { ChatInterface } from './ChatInterface';
import { ResearchPanel } from './ResearchPanel';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance: number;
  timestamp: string;
}

export function SearchEngine() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('search');

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Künstliche Intelligenz in der Suchmaschinenoptimierung',
      url: 'https://example.com/ai-seo',
      snippet: 'KI revolutioniert die Art, wie Suchmaschinen Inhalte verstehen und bewerten. Machine Learning Algorithmen analysieren Nutzerverhalten und Kontext...',
      source: 'TechBlog',
      relevance: 0.95,
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Deep Learning und natürliche Sprachverarbeitung',
      url: 'https://example.com/nlp-deep-learning',
      snippet: 'Natural Language Processing ermöglicht es Computern, menschliche Sprache zu verstehen und zu interpretieren. Transformer-Modelle wie GPT haben...',
      source: 'AI Research',
      relevance: 0.92,
      timestamp: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      title: 'Semantische Suche und Vektorräume',
      url: 'https://example.com/semantic-search',
      snippet: 'Semantische Suchsysteme verwenden Embedding-Technologien, um die Bedeutung von Begriffen im Kontext zu verstehen...',
      source: 'Search Technology',
      relevance: 0.89,
      timestamp: '2024-01-13T09:45:00Z'
    },
    {
      id: '4',
      title: 'Multimodale KI-Systeme der Zukunft',
      url: 'https://example.com/multimodal-ai',
      snippet: 'Die nächste Generation von KI-Systemen kann Text, Bilder, Audio und Video gleichzeitig verarbeiten und verstehen...',
      source: 'Future Tech',
      relevance: 0.87,
      timestamp: '2024-01-12T14:10:00Z'
    },
    {
      id: '5',
      title: 'Ethische Aspekte der KI-gestützten Suche',
      url: 'https://example.com/ai-ethics',
      snippet: 'Bei der Entwicklung intelligenter Suchsysteme müssen Datenschutz, Fairness und Transparenz berücksichtigt werden...',
      source: 'Ethics Journal',
      relevance: 0.84,
      timestamp: '2024-01-11T11:25:00Z'
    }
  ];

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter and sort mock results based on query
    const filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.relevance - a.relevance);
    
    setResults(filteredResults);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-search-primary/5 via-search-accent/5 to-search-primary/5" />
        
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Intelligente Suche
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              KI-gestützte Recherche mit Quellenangaben, Deep Research und Chat-Integration
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="search-container rounded-2xl p-1">
                <div className="relative flex items-center glass-effect rounded-xl">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Stellen Sie Ihre Frage oder geben Sie Suchbegriffe ein..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input pl-12 pr-4 py-6 text-lg border-0 bg-transparent"
                    disabled={isSearching}
                  />
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !query.trim()}
                    className="search-button m-2 px-6 py-3"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Suchergebnisse
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Deep Research
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Zusammenfassung
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <SearchResults 
              results={results} 
              isLoading={isSearching}
              onSourceClick={(url) => window.open(url, '_blank')}
            />
          </TabsContent>

          <TabsContent value="research">
            <ResearchPanel 
              query={query}
              results={results}
              onNewSearch={handleSearch}
            />
          </TabsContent>

          <TabsContent value="summary">
            <Card className="result-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Intelligente Zusammenfassung
                </CardTitle>
                <CardDescription>
                  KI-generierte Zusammenfassung basierend auf den gefundenen Quellen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed">
                        Basierend auf den analysierten Quellen zeigt sich, dass <strong>Künstliche Intelligenz</strong> 
                        die Suchmaschinenlandschaft grundlegend transformiert. Die wichtigsten Erkenntnisse:
                      </p>
                      
                      <ul className="space-y-2 mt-4">
                        <li>• <strong>Machine Learning Algorithmen</strong> ermöglichen ein tieferes Verständnis von Nutzerverhalten und Kontext</li>
                        <li>• <strong>Natural Language Processing</strong> verbessert die Interpretation menschlicher Sprache erheblich</li>
                        <li>• <strong>Semantische Suche</strong> nutzt Embedding-Technologien für kontextuelle Bedeutung</li>
                        <li>• <strong>Multimodale Systeme</strong> können verschiedene Medientypen gleichzeitig verarbeiten</li>
                        <li>• <strong>Ethische Überlegungen</strong> zu Datenschutz und Fairness werden immer wichtiger</li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      <Badge variant="outline">Vertrauenswürdigkeit: 94%</Badge>
                      <Badge variant="outline">{results.length} Quellen analysiert</Badge>
                      <Badge variant="outline">Aktualisiert: {new Date().toLocaleDateString('de-DE')}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Führen Sie zunächst eine Suche durch, um eine Zusammenfassung zu erhalten.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface 
              query={query}
              results={results}
              onNewSearch={handleSearch}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}