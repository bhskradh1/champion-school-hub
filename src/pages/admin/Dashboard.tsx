import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Bell, Image, FileText, Users, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  events: number;
  notices: number;
  gallery: number;
  results: number;
  leadership: number;
  messages: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    notices: 0,
    gallery: 0,
    results: 0,
    leadership: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, noticesRes, galleryRes, resultsRes, leadershipRes, messagesRes] = 
          await Promise.all([
            supabase.from('events').select('id', { count: 'exact', head: true }),
            supabase.from('notices').select('id', { count: 'exact', head: true }),
            supabase.from('gallery').select('id', { count: 'exact', head: true }),
            supabase.from('results').select('id', { count: 'exact', head: true }),
            supabase.from('leadership').select('id', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          ]);

        setStats({
          events: eventsRes.count || 0,
          notices: noticesRes.count || 0,
          gallery: galleryRes.count || 0,
          results: resultsRes.count || 0,
          leadership: leadershipRes.count || 0,
          messages: messagesRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Events', value: stats.events, icon: Calendar, color: 'text-blue-600' },
    { title: 'Notices', value: stats.notices, icon: Bell, color: 'text-yellow-600' },
    { title: 'Gallery Images', value: stats.gallery, icon: Image, color: 'text-green-600' },
    { title: 'Results', value: stats.results, icon: FileText, color: 'text-purple-600' },
    { title: 'Leadership', value: stats.leadership, icon: Users, color: 'text-indigo-600' },
    { title: 'Messages', value: stats.messages, icon: Mail, color: 'text-red-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Champion English School admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="/admin/events" 
                className="p-3 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors text-center"
              >
                Add Event
              </a>
              <a 
                href="/admin/notices" 
                className="p-3 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors text-center"
              >
                Add Notice
              </a>
              <a 
                href="/admin/gallery" 
                className="p-3 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors text-center"
              >
                Upload Images
              </a>
              <a 
                href="/admin/results" 
                className="p-3 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors text-center"
              >
                Upload Results
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking will be implemented in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}