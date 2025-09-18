import React, { useState } from 'react';
import { Search, Sparkles, MessageSquare, FileText, Brain, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ExportDropdown } from '@/components/ExportDropdown';
import { SearchResults } from './SearchResults';
import { ChatInterface } from './ChatInterface';
import { ResearchPanel } from './ResearchPanel';
import { useToast } from '@/hooks/use-toast';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  // Erweiterte Mock-Daten für verschiedene Suchthemen
  const generateMockResults = (searchQuery: string, page: number = 1): SearchResult[] => {
    const baseResults = [
      {
        id: `${page}-1`,
        title: `${searchQuery} - Umfassende Analyse und Einblicke`,
        url: `https://example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Eine detaillierte Untersuchung von ${searchQuery} mit aktuellen Erkenntnissen und praktischen Anwendungen. Diese Quelle bietet fundierte Informationen und Expertenmeinungen zu den wichtigsten Aspekten des Themas.`,
        source: 'ExpertBlog',
        relevance: 0.95 - (page - 1) * 0.05,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${page}-2`,
        title: `Neueste Entwicklungen in ${searchQuery} - Seite ${page}`,
        url: `https://research.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}-${page}`,
        snippet: `Aktuelle Forschungsergebnisse und Trends zu ${searchQuery}. Diese wissenschaftliche Publikation beleuchtet die neuesten Fortschritte und zukünftige Perspektiven in diesem Bereich.`,
        source: 'Forschungsjournal',
        relevance: 0.92 - (page - 1) * 0.05,
        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${page}-3`,
        title: `Praktische Anwendungen von ${searchQuery} - Teil ${page}`,
        url: `https://tech.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}-${page}`,
        snippet: `Wie ${searchQuery} in der Praxis eingesetzt wird - von Grundlagen bis zu fortgeschrittenen Techniken. Ein umfassender Leitfaden mit Beispielen und Best Practices.`,
        source: 'TechMagazin',
        relevance: 0.89 - (page - 1) * 0.05,
        timestamp: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${page}-4`,
        title: `${searchQuery}: Trends und Zukunftsperspektiven ${page}`,
        url: `https://future.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}-${page}`,
        snippet: `Eine Analyse der aktuellen Trends und zukünftigen Entwicklungen im Bereich ${searchQuery}. Expertenmeinungen und Prognosen für die kommenden Jahre.`,
        source: 'ZukunftsTrends',
        relevance: 0.87 - (page - 1) * 0.05,
        timestamp: new Date(Date.now() - Math.random() * 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${page}-5`,
        title: `Grundlagen und Einführung in ${searchQuery} - Band ${page}`,
        url: `https://learn.example.com/${searchQuery.replace(/\s+/g, '-').toLowerCase()}-${page}`,
        snippet: `Ein umfassender Einführungskurs zu ${searchQuery} für Anfänger und Fortgeschrittene. Schritt-für-Schritt Anleitungen und verständliche Erklärungen der wichtigsten Konzepte.`,
        source: 'LernPlattform',
        relevance: 0.84 - (page - 1) * 0.05,
        timestamp: new Date(Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return baseResults.map(result => ({
      ...result,
      relevance: Math.max(0.65, result.relevance)
    }));
  };

  const generateSummary = (searchQuery: string, searchResults: SearchResult[]): string => {
    const lowerQuery = searchQuery.toLowerCase();
    
    if (lowerQuery.includes('künstliche intelligenz') || lowerQuery.includes('ki')) {
      return `Die Analyse der Suchergebnisse zu "${searchQuery}" zeigt eine rasante Entwicklung im Bereich der künstlichen Intelligenz. Machine Learning Algorithmen revolutionieren nicht nur Suchmaschinen, sondern auch zahlreiche andere Anwendungsbereiche. Besonders bemerkenswert ist der Fortschritt bei neuronalen Netzen und Deep Learning-Technologien, die es Computern ermöglichen, komplexe Muster zu erkennen und menschenähnliche Entscheidungen zu treffen. Die gefundenen Quellen zeigen einheitlich, dass KI-gestützte Systeme zunehmend präzisere und kontextbewusste Ergebnisse liefern. Diese Entwicklung wird durch kontinuierliche Verbesserungen in der Datenverarbeitung und algorithimischen Ansätzen vorangetrieben.`;
    }
    
    if (lowerQuery.includes('klimawandel') || lowerQuery.includes('klima')) {
      return `Die Recherche zu "${searchQuery}" offenbart die Dringlichkeit und Komplexität der aktuellen Klimakrise. Wissenschaftliche Daten belegen eine beschleunigte Erwärmung der globalen Temperaturen sowie veränderte Wettermuster, die weitreichende Auswirkungen auf Ökosysteme und menschliche Gesellschaften haben. Innovative Technologien und nachhaltige Lösungsansätze gewinnen zunehmend an Bedeutung, wobei sowohl politische als auch technologische Maßnahmen erforderlich sind. Die analysierten Quellen zeigen einen wissenschaftlichen Konsens über die anthropogenen Ursachen des Klimawandels und betonen die Notwendigkeit sofortiger, koordinierter Maßnahmen. Gleichzeitig werden vielversprechende Entwicklungen in erneuerbaren Energien und Klimaschutztechnologien dokumentiert.`;
    }
    
    if (lowerQuery.includes('blockchain') || lowerQuery.includes('kryptowährung')) {
      return `Die Untersuchung von "${searchQuery}" verdeutlicht das transformative Potenzial der Blockchain-Technologie weit über Kryptowährungen hinaus. Diese dezentrale Ledger-Technologie verspricht revolutionäre Veränderungen in Finanzwesen, Datenmanagement und Vertrauensbildung zwischen Parteien. Besonders hervorzuheben sind die Vorteile in Bezug auf Transparenz, Sicherheit und Unveränderlichkeit von Transaktionen. Die gefundenen Quellen illustrieren vielfältige Anwendungsmöglichkeiten von Smart Contracts bis hin zu Supply Chain Management. Jedoch zeigen die Analysen auch Herausforderungen wie Skalierbarkeit, Energieverbrauch und regulatorische Unsicherheiten auf, die für die Massenadoption bewältigt werden müssen.`;
    }
    
    // Generische Zusammenfassung für andere Themen
    return `Basierend auf der umfassenden Analyse zu "${searchQuery}" zeigen die gefundenen Quellen ein vielschichtiges Bild des Themas mit sowohl aktuellen Entwicklungen als auch zukunftsweisenden Perspektiven. Die Forschung in diesem Bereich entwickelt sich kontinuierlich weiter, wobei praktische Anwendungen zunehmend in den Fokus rücken. Expertenmeinungen aus verschiedenen Fachbereichen konvergieren zu dem Schluss, dass signifikante Veränderungen und Innovationen zu erwarten sind. Die analysierten Materialien zeigen sowohl Chancen als auch Herausforderungen auf, die eine ausgewogene und durchdachte Herangehensweise erfordern. Besonders bemerkenswert ist die Interdisziplinarität des Themas, die verschiedene Fachbereiche und Stakeholder miteinander verbindet und kollaborative Lösungsansätze fördert.`;
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setCurrentPage(1);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generiere relevante Ergebnisse
    const searchResults = generateMockResults(searchQuery, 1);
    
    setResults(searchResults);
    setIsSearching(false);
  };

  const handleLoadMore = async () => {
    if (!query.trim()) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nextPage = currentPage + 1;
    const newResults = generateMockResults(query, nextPage);
    
    setResults(prev => [...prev, ...newResults]);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
    
    toast({
      title: "Weitere Ergebnisse geladen",
      description: `${newResults.length} zusätzliche Ergebnisse hinzugefügt.`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const currentSummary = query && results.length > 0 ? generateSummary(query, results) : undefined;
  const hasMoreResults = currentPage < 5; // Maximal 5 Seiten simulieren

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header with Theme Toggle */}
      <div className="sticky top-0 z-50 border-b border-search-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-search-primary" />
              <span className="font-semibold text-lg">Intelligente Suche</span>
            </div>
            
            <div className="flex items-center gap-3">
              <ExportDropdown 
                query={query} 
                results={results} 
                summary={currentSummary}
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

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
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl border border-search-border">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Stellen Sie Ihre Frage oder geben Sie Suchbegriffe ein..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-4 py-6 text-lg border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-search-primary"
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
              isLoading={isSearching || isLoadingMore}
              onSourceClick={(url) => window.open(url, '_blank')}
              onLoadMore={handleLoadMore}
              hasMoreResults={hasMoreResults}
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
                {results.length > 0 && currentSummary ? (
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed">
                        {currentSummary}
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