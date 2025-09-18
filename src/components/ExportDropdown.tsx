import React from 'react';
import { Download, FileText, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ExportDropdownProps {
  query: string;
  results: any[];
  summary?: string;
}

export function ExportDropdown({ query, results, summary }: ExportDropdownProps) {
  const { toast } = useToast();

  const exportToJSON = () => {
    const exportData = {
      query,
      timestamp: new Date().toISOString(),
      results: results.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        source: result.source,
        relevance: result.relevance,
        timestamp: result.timestamp
      })),
      summary,
      metadata: {
        totalResults: results.length,
        averageRelevance: results.reduce((acc, r) => acc + r.relevance, 0) / results.length,
        exportedBy: 'Intelligente Suche App'
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `suche-${query.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export erfolgreich",
      description: "Suchergebnisse wurden als JSON-Datei gespeichert.",
    });
  };

  const exportToText = () => {
    const textContent = `SUCHERGEBNISSE - ${query}
Erstellt am: ${new Date().toLocaleString('de-DE')}
Anzahl Ergebnisse: ${results.length}

${summary ? `ZUSAMMENFASSUNG:
${summary}

` : ''}DETAILLIERTE ERGEBNISSE:

${results.map((result, index) => `
${index + 1}. ${result.title}
   URL: ${result.url}
   Quelle: ${result.source}
   Relevanz: ${Math.round(result.relevance * 100)}%
   Beschreibung: ${result.snippet}
   Zeitstempel: ${new Date(result.timestamp).toLocaleString('de-DE')}
`).join('\n')}

---
Exportiert von: Intelligente Suche App
`;

    const dataBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `suche-${query.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export erfolgreich",
      description: "Suchergebnisse wurden als Textdatei gespeichert.",
    });
  };

  const exportToMarkdown = () => {
    const markdownContent = `# Suchergebnisse: ${query}

**Erstellt am:** ${new Date().toLocaleString('de-DE')}  
**Anzahl Ergebnisse:** ${results.length}  
**Durchschnittliche Relevanz:** ${Math.round(results.reduce((acc, r) => acc + r.relevance, 0) / results.length * 100)}%

${summary ? `## Zusammenfassung

${summary}

` : ''}## Detaillierte Ergebnisse

${results.map((result, index) => `
### ${index + 1}. ${result.title}

- **URL:** [${result.url}](${result.url})
- **Quelle:** ${result.source}
- **Relevanz:** ${Math.round(result.relevance * 100)}%
- **Datum:** ${new Date(result.timestamp).toLocaleDateString('de-DE')}

${result.snippet}

`).join('')}

---
*Exportiert von: Intelligente Suche App*
`;

    const dataBlob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `suche-${query.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export erfolgreich",
      description: "Suchergebnisse wurden als Markdown-Datei gespeichert.",
    });
  };

  const saveToLocalStorage = () => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newSearch = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      resultCount: results.length,
      summary: summary?.substring(0, 200) + '...' || 'Keine Zusammenfassung verfügbar'
    };

    searchHistory.unshift(newSearch);
    // Behalte nur die letzten 10 Suchanfragen
    if (searchHistory.length > 10) {
      searchHistory.splice(10);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    toast({
      title: "Suche gespeichert",
      description: "Suchanfrage wurde in der lokalen Historie gespeichert.",
    });
  };

  const shareResults = async () => {
    const shareText = `Suchergebnisse für "${query}" - ${results.length} Ergebnisse gefunden`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Intelligente Suche - Ergebnisse',
          text: shareText,
          url: window.location.href
        });
        toast({
          title: "Geteilt",
          description: "Suchergebnisse wurden geteilt.",
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "In Zwischenablage kopiert",
          description: "Suchtext wurde in die Zwischenablage kopiert.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "In Zwischenablage kopiert",
        description: "Suchtext wurde in die Zwischenablage kopiert.",
      });
    }
  };

  const isDisabled = !query || results.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isDisabled}
          className="h-9"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="h-4 w-4 mr-2" />
          Als JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText}>
          <FileText className="h-4 w-4 mr-2" />
          Als Textdatei
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          Als Markdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={saveToLocalStorage}>
          <Bookmark className="h-4 w-4 mr-2" />
          In Historie speichern
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareResults}>
          <Share2 className="h-4 w-4 mr-2" />
          Teilen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}