import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Bell, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface Notice {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_important: false,
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

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
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const noticeData = {
        ...formData,
        created_by: user.id,
      };

      if (editingNotice) {
        const { error } = await supabase
          .from('notices')
          .update(noticeData)
          .eq('id', editingNotice.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Notice updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('notices')
          .insert([noticeData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Notice created successfully",
        });
      }

      setDialogOpen(false);
      setEditingNotice(null);
      setFormData({ title: '', content: '', is_important: false });
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast({
        title: "Error",
        description: "Failed to save notice",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      is_important: notice.is_important,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
      
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notices Management</h1>
          <p className="text-muted-foreground">Manage school notices and announcements</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingNotice(null);
              setFormData({ title: '', content: '', is_important: false });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
              <DialogDescription>
                {editingNotice ? 'Update the notice details.' : 'Create a new notice for the school.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_important"
                  checked={formData.is_important}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_important: !!checked })}
                />
                <Label htmlFor="is_important" className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>Mark as important</span>
                </Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNotice ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {notices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notices found. Create your first notice!</p>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className={notice.is_important ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-xl">{notice.title}</CardTitle>
                  {notice.is_important && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Important
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(notice)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(notice.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  Created {new Date(notice.created_at).toLocaleDateString()} • 
                  Last updated {new Date(notice.updated_at).toLocaleDateString()}
                </CardDescription>
                <p className="text-sm whitespace-pre-wrap">{notice.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}