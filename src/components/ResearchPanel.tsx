import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, Clock, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResearchPanelProps {
  query: string;
  results: any[];
  onNewSearch: (query: string) => void;
}

export function ResearchPanel({ query, results, onNewSearch }: ResearchPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleDeepResearch = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate deep research process
    const intervals = [
      { progress: 20, text: 'Analysiere Suchergebnisse...' },
      { progress: 40, text: 'Identifiziere verwandte Themen...' },
      { progress: 60, text: 'Prüfe Quellenqualität...' },
      { progress: 80, text: 'Generiere Erkenntnisse...' },
      { progress: 100, text: 'Fertiggestellt!' }
    ];

    for (const interval of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(interval.progress);
    }

    setIsAnalyzing(false);
  };

  const researchSuggestions = [
    {
      id: '1',
      title: 'Technische Implementierung von NLP-Systemen',
      description: 'Vertiefende Analyse der verwendeten Algorithmen und Frameworks',
      relevance: 0.92,
      estimatedTime: '5-8 Min.',
      sources: 12
    },
    {
      id: '2',
      title: 'Marktanalyse: KI-Suchmaschinen vs. traditionelle Systeme',
      description: 'Vergleichende Studie der aktuellen Marktposition und Trends',
      relevance: 0.88,
      estimatedTime: '8-12 Min.',
      sources: 18
    },
    {
      id: '3',
      title: 'Ethische Richtlinien für KI-gestützte Informationssysteme',
      description: 'Untersuchung rechtlicher und ethischer Frameworks',
      relevance: 0.85,
      estimatedTime: '6-10 Min.',
      sources: 15
    },
    {
      id: '4',
      title: 'Zukunftsprognosen: Entwicklung semantischer Suchsysteme',
      description: 'Expertenmeinungen und Forschungstrends für die nächsten 5 Jahre',
      relevance: 0.83,
      estimatedTime: '7-11 Min.',
      sources: 9
    }
  ];

  const keyInsights = [
    {
      category: 'Technologie',
      insight: 'Transformer-basierte Modelle dominieren die NLP-Landschaft',
      confidence: 94,
      sources: ['AI Research', 'TechBlog', 'Future Tech']
    },
    {
      category: 'Markt',
      insight: 'Semantische Suche wird bis 2025 Standard bei großen Anbietern',
      confidence: 87,
      sources: ['Market Analysis', 'Industry Report']
    },
    {
      category: 'Ethik',
      insight: 'Regulierung von KI-Systemen wird zunehmend wichtiger',
      confidence: 91,
      sources: ['Ethics Journal', 'Policy Papers']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Deep Research Header */}
      <Card className="result-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-6 w-6 text-search-primary" />
                Deep Research
              </CardTitle>
              <CardDescription className="text-base">
                KI-gestützte Tiefenanalyse für umfassende Erkenntnisse
              </CardDescription>
            </div>
            <Button 
              onClick={handleDeepResearch}
              disabled={isAnalyzing}
              className="search-button"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Deep Research starten
                </>
              )}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4">
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Fortschritt: {analysisProgress}%
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Forschungsvorschläge</TabsTrigger>
          <TabsTrigger value="insights">Kernerkenntnisse</TabsTrigger>
          <TabsTrigger value="analysis">Quellenanalyse</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {researchSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="result-card group cursor-pointer hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-search-primary transition-colors">
                        {suggestion.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {suggestion.description}
                      </CardDescription>
                    </div>
                    <Badge className="source-badge ml-4">
                      {Math.round(suggestion.relevance * 100)}% relevant
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {suggestion.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {suggestion.sources} Quellen
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNewSearch(suggestion.title)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Erforschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {keyInsights.map((insight, index) => (
              <Card key={index} className="result-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="source-badge">
                      {insight.category}
                    </Badge>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {insight.confidence}% Vertrauen
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-3">
                    {insight.insight}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground mr-2">Basierend auf:</span>
                    {insight.sources.map((source, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="result-card">
            <CardHeader>
              <CardTitle>Quellenqualitätsanalyse</CardTitle>
              <CardDescription>
                Bewertung der verwendeten Quellen nach Vertrauenswürdigkeit und Aktualität
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Quellenkategorien</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Akademische Quellen</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Industrie-Blogs</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">News & Magazine</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Qualitätsbewertung</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Vertrauenswürdigkeit</span>
                          <span>91%</span>
                        </div>
                        <Progress value={91} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Aktualität</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Relevanz</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-search-border">
                  <h4 className="font-medium mb-3">Empfohlene Zusatzquellen</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-search-muted rounded-lg">
                      <div>
                        <p className="font-medium">IEEE Computer Society</p>
                        <p className="text-sm text-muted-foreground">Peer-reviewed AI research papers</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Besuchen
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-search-muted rounded-lg">
                      <div>
                        <p className="font-medium">Google AI Blog</p>
                        <p className="text-sm text-muted-foreground">Latest developments in machine learning</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Besuchen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}