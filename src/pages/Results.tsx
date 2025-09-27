import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Download, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Result {
  id: string;
  title: string;
  description?: string;  
  file_url: string;
  result_type: string;
  class_grade?: string;
  created_at: string;
}

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const resultTypes = ["all", ...Array.from(new Set(results.map(result => result.result_type)))];
  const filteredResults = selectedType === "all" 
    ? results 
    : results.filter(result => result.result_type === selectedType);

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading results...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-6">Academic Results</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access and download academic results, exam scores, and achievement records
          </p>
        </div>
      </section>

      {/* Result Type Filter */}
      {resultTypes.length > 1 && (
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {resultTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {result.result_type}
                      </Badge>
                      {result.class_grade && (
                        <Badge variant="secondary">
                          {result.class_grade}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl flex items-start space-x-2">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{result.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.description && (
                      <p className="text-muted-foreground">{result.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Published: {format(new Date(result.created_at), 'MMM dd, yyyy')}
                    </div>

                    <Button 
                      onClick={() => handleDownload(result.file_url, result.title)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Result
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">No Results Available</h2>
              <p className="text-muted-foreground">
                Check back soon for academic results and achievement records!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}