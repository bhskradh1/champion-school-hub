import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading notices...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Bell className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-6">Notice Board</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest announcements and important updates from Champion English School
          </p>
        </div>
      </section>

      {/* Notices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {notices.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {notices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className={`transition-all duration-300 hover:shadow-lg ${
                    notice.is_important ? 'border-accent' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {notice.is_important && (
                          <Badge variant="destructive" className="animate-pulse">
                            Important
                          </Badge>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(notice.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{notice.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">No Notices Available</h2>
              <p className="text-muted-foreground">
                Check back soon for important announcements and updates!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}