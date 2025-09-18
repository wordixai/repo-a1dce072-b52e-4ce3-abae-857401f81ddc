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

  // Erweiterte Mock-Daten für verschiedene Suchthemen
  const generateMockResults = (searchQuery: string): SearchResult[] => {
    const baseResults = [
      {
        id: '1',
        title: `${searchQuery} - Umfassende Analyse und Einblicke`,
        url: `https://example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Eine detaillierte Untersuchung von ${searchQuery} mit aktuellen Erkenntnissen und praktischen Anwendungen. Diese Quelle bietet fundierte Informationen und Expertenmeinungen zu den wichtigsten Aspekten des Themas.`,
        source: 'ExpertBlog',
        relevance: 0.95,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: `Neueste Entwicklungen in ${searchQuery}`,
        url: `https://research.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Aktuelle Forschungsergebnisse und Trends zu ${searchQuery}. Diese wissenschaftliche Publikation beleuchtet die neuesten Fortschritte und zukünftige Perspektiven in diesem Bereich.`,
        source: 'Forschungsjournal',
        relevance: 0.92,
        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: `Praktische Anwendungen von ${searchQuery}`,
        url: `https://tech.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Wie ${searchQuery} in der Praxis eingesetzt wird - von Grundlagen bis zu fortgeschrittenen Techniken. Ein umfassender Leitfaden mit Beispielen und Best Practices.`,
        source: 'TechMagazin',
        relevance: 0.89,
        timestamp: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: `${searchQuery}: Trends und Zukunftsperspektiven`,
        url: `https://future.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Eine Analyse der aktuellen Trends und zukünftigen Entwicklungen im Bereich ${searchQuery}. Expertenmeinungen und Prognosen für die kommenden Jahre.`,
        source: 'ZukunftsTrends',
        relevance: 0.87,
        timestamp: new Date(Date.now() - Math.random() * 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        title: `Grundlagen und Einführung in ${searchQuery}`,
        url: `https://learn.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Ein umfassender Einführungskurs zu ${searchQuery} für Anfänger und Fortgeschrittene. Schritt-für-Schritt Anleitungen und verständliche Erklärungen der wichtigsten Konzepte.`,
        source: 'LernPlattform',
        relevance: 0.84,
        timestamp: new Date(Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Spezifische Ergebnisse für häufige Suchbegriffe
    const specificResults: { [key: string]: SearchResult[] } = {
      'künstliche intelligenz': [
        {
          id: 'ai1',
          title: 'KI revolutioniert die Suchmaschinenoptimierung',
          url: 'https://example.com/ai-seo',
          snippet: 'Machine Learning Algorithmen analysieren Nutzerverhalten und Kontext für präzisere Suchergebnisse. Diese Entwicklung verändert grundlegend, wie wir Informationen finden.',
          source: 'AI Research',
          relevance: 0.96,
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: 'ai2',
          title: 'Deep Learning in der Praxis',
          url: 'https://example.com/deep-learning',
          snippet: 'Neuronale Netze ermöglichen es Computern, komplexe Muster zu erkennen und menschenähnliche Entscheidungen zu treffen.',
          source: 'TechBlog',
          relevance: 0.93,
          timestamp: '2024-01-14T15:20:00Z'
        }
      ],
      'klimawandel': [
        {
          id: 'climate1',
          title: 'Aktuelle Klimadaten und Trends',
          url: 'https://example.com/climate-data',
          snippet: 'Neueste wissenschaftliche Erkenntnisse zum Klimawandel zeigen beschleunigte Veränderungen in globalen Temperaturen und Wettermustern.',
          source: 'Klimaforschung',
          relevance: 0.94,
          timestamp: '2024-01-16T09:15:00Z'
        }
      ],
      'blockchain': [
        {
          id: 'crypto1',
          title: 'Blockchain-Technologie verstehen',
          url: 'https://example.com/blockchain-basics',
          snippet: 'Dezentrale Ledger-Technologie revolutioniert Finanzwesen und Datenmanagement durch Transparenz und Sicherheit.',
          source: 'CryptoJournal',
          relevance: 0.91,
          timestamp: '2024-01-13T14:30:00Z'
        }
      ]
    };

    // Prüfe auf spezifische Begriffe
    const lowerQuery = searchQuery.toLowerCase();
    for (const [key, specificRes] of Object.entries(specificResults)) {
      if (lowerQuery.includes(key)) {
        return [...specificRes, ...baseResults.slice(0, 3)];
      }
    }

    // Fallback: Angepasste Basis-Ergebnisse
    return baseResults.map(result => ({
      ...result,
      relevance: Math.max(0.75, result.relevance - Math.random() * 0.1)
    }));
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generiere relevante Ergebnisse
    const searchResults = generateMockResults(searchQuery);
    
    setResults(searchResults);
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
            
            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Künstliche Intelligenz', 'Klimawandel', 'Blockchain', 'Nachhaltigkeit', 'Digitalisierung'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="text-sm"
                >
                  {suggestion}
                </Button>
              ))}
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
                        Basierend auf den analysierten Quellen zu <strong>"{query}"</strong> zeigen sich folgende Kernpunkte:
                      </p>
                      
                      <ul className="space-y-2 mt-4">
                        <li>• <strong>Aktuelle Entwicklungen:</strong> Die Forschung in diesem Bereich entwickelt sich rapide weiter</li>
                        <li>• <strong>Praktische Anwendungen:</strong> Vielfältige Einsatzmöglichkeiten in verschiedenen Bereichen</li>
                        <li>• <strong>Zukunftsperspektiven:</strong> Positive Trends und innovative Ansätze zeichnen sich ab</li>
                        <li>• <strong>Herausforderungen:</strong> Wichtige Aspekte erfordern weitere Aufmerksamkeit</li>
                        <li>• <strong>Expertenmeinungen:</strong> Konsens über die Bedeutung des Themas</li>
                      </ul>
                      
                      <p className="mt-4">
                        Die gefundenen Quellen bieten eine ausgewogene Perspektive auf das Thema und 
                        stammen aus vertrauenswürdigen wissenschaftlichen und technischen Publikationen.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      <Badge variant="outline">Vertrauenswürdigkeit: {Math.round(results.reduce((acc, r) => acc + r.relevance, 0) / results.length * 100)}%</Badge>
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