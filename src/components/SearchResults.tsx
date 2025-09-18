import React from 'react';
import { ExternalLink, Clock, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance: number;
  timestamp: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onSourceClick: (url: string) => void;
}

export function SearchResults({ results, isLoading, onSourceClick }: SearchResultsProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return 'text-green-600';
    if (relevance >= 0.8) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRelevanceLabel = (relevance: number) => {
    if (relevance >= 0.9) return 'Sehr relevant';
    if (relevance >= 0.8) return 'Relevant';
    return 'Mäßig relevant';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="result-card">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="result-card text-center py-12">
        <CardContent>
          <div className="text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</h3>
            <p>Versuchen Sie es mit anderen Suchbegrissen oder einer anderen Formulierung.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-search-border pb-4">
        <div>
          <h2 className="text-2xl font-bold">Suchergebnisse</h2>
          <p className="text-muted-foreground">
            {results.length} Ergebnisse gefunden in 0.3 Sekunden
          </p>
        </div>
        <Badge variant="outline" className="source-badge">
          <Star className="h-3 w-3 mr-1" />
          KI-gefiltert
        </Badge>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={result.id} className="result-card group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 group-hover:text-search-primary transition-colors">
                    <a 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {result.title}
                    </a>
                  </CardTitle>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge className="source-badge">
                      {result.source}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(result.timestamp)}
                    </div>
                    
                    <div className={`flex items-center gap-1 ${getRelevanceColor(result.relevance)}`}>
                      <TrendingUp className="h-3 w-3" />
                      {getRelevanceLabel(result.relevance)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-muted-foreground/30">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="text-base leading-relaxed mb-4">
                {result.snippet}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground truncate max-w-md">
                  {result.url}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSourceClick(result.url)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Quelle öffnen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Load More Button */}
      {results.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" className="px-8">
            Weitere Ergebnisse laden
          </Button>
        </div>
      )}
    </div>
  );
}