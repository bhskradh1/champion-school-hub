import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MailOpen, Trash2, Phone, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
      
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== messageId));
      setDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage contact form submissions
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages found.</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !message.is_read ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => openMessage(message)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  {message.is_read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <CardTitle className="text-lg">{message.subject}</CardTitle>
                  {!message.is_read && (
                    <Badge variant="destructive" className="text-xs">New</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    {message.phone && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Phone className="mr-1 h-3 w-3" />
                        {message.phone}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{message.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessage.name} • {new Date(selectedMessage.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div className="md:col-span-2">
                      <p className="font-medium text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="font-medium text-sm text-muted-foreground mb-2">Message</p>
                  <div className="p-4 bg-background border rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`);
                    }}
                  >
                    Reply via Email
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}