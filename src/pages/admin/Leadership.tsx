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
import { Plus, Edit, Trash2, Users, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/ui/file-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  message: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminLeadership() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    message: '',
    image_url: '',
    is_active: true,
    display_order: 1,
  });
  const [uploadTab, setUploadTab] = useState('url');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching leadership members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leadership members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (urls: string[]) => {
    if (!user || urls.length === 0) return;

    // Use the first uploaded image for the member profile
    const imageUrl = urls[0];
    
    try {
      const memberData = {
        name: formData.name,
        position: formData.position,
        message: formData.message,
        image_url: imageUrl,
        is_active: formData.is_active,
        display_order: formData.display_order,
        created_by: user.id,
      };

      const { error } = await supabase
        .from('leadership')
        .insert([memberData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leadership member added successfully with uploaded image",
      });

      setDialogOpen(false);
      setFormData({ name: '', position: '', message: '', image_url: '', is_active: true, display_order: 1 });
      fetchMembers();
    } catch (error) {
      console.error('Error saving leadership member:', error);
      toast({
        title: "Error",
        description: "Failed to save leadership member",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const memberData = {
        ...formData,
        created_by: user.id,
      };

      if (editingMember) {
        const { error } = await supabase
          .from('leadership')
          .update(memberData)
          .eq('id', editingMember.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Leadership member updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('leadership')
          .insert([memberData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Leadership member added successfully",
        });
      }

      setDialogOpen(false);
      setEditingMember(null);
      setFormData({ name: '', position: '', message: '', image_url: '', is_active: true, display_order: 1 });
      fetchMembers();
    } catch (error) {
      console.error('Error saving leadership member:', error);
      toast({
        title: "Error",
        description: "Failed to save leadership member",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: LeadershipMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      message: member.message,
      image_url: member.image_url || '',
      is_active: member.is_active,
      display_order: member.display_order,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this leadership member?')) return;

    try {
      const { error } = await supabase
        .from('leadership')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leadership member deleted successfully",
      });
      
      fetchMembers();
    } catch (error) {
      console.error('Error deleting leadership member:', error);
      toast({
        title: "Error",
        description: "Failed to delete leadership member",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (memberId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('leadership')
        .update({ is_active: !isActive })
        .eq('id', memberId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Member ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchMembers();
    } catch (error) {
      console.error('Error toggling member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive",
      });
    }
  };

  const updateDisplayOrder = async (memberId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('leadership')
        .update({ display_order: newOrder })
        .eq('id', memberId);
      
      if (error) throw error;
      
      fetchMembers();
    } catch (error) {
      console.error('Error updating display order:', error);
      toast({
        title: "Error",
        description: "Failed to update display order",
        variant: "destructive",
      });
    }
  };

  const moveUp = (member: LeadershipMember) => {
    const currentIndex = members.findIndex(m => m.id === member.id);
    if (currentIndex > 0) {
      const prevMember = members[currentIndex - 1];
      updateDisplayOrder(member.id, prevMember.display_order);
      updateDisplayOrder(prevMember.id, member.display_order);
    }
  };

  const moveDown = (member: LeadershipMember) => {
    const currentIndex = members.findIndex(m => m.id === member.id);
    if (currentIndex < members.length - 1) {
      const nextMember = members[currentIndex + 1];
      updateDisplayOrder(member.id, nextMember.display_order);
      updateDisplayOrder(nextMember.id, member.display_order);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leadership Management</h1>
          <p className="text-muted-foreground">Manage school leadership team and staff</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMember(null);
              const maxOrder = Math.max(...members.map(m => m.display_order), 0);
              setFormData({ name: '', position: '', message: '', image_url: '', is_active: true, display_order: maxOrder + 1 });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Leadership Member' : 'Add New Leadership Member'}</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Update the member details.' : 'Add a new member to the leadership team.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position/Title</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Principal, Vice Principal, Head of Academics"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message/Description</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Brief message or description about the member"
                  required
                />
              </div>
              
              {/* Profile Image Source Selection */}
              {!editingMember && (
                <Tabs value={uploadTab} onValueChange={setUploadTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Profile Image URL (optional)</Label>
                      <Input
                        id="image_url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload
                      bucket="leadership-images"
                      folder="profiles"
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      maxSize={5}
                      onUploadComplete={handleFileUpload}
                      onUploadError={(error) => {
                        toast({
                          title: "Upload Error",
                          description: error,
                          variant: "destructive"
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}

              {/* For editing existing members */}
              {editingMember && (
                <div className="space-y-2">
                  <Label htmlFor="image_url">Profile Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                  />
                  <Label htmlFor="is_active">Active member</Label>
                </div>
              </div>
              
              {/* Only show submit button for URL uploads or editing */}
              {(editingMember || uploadTab === 'url') && (
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMember ? 'Update' : 'Add'}
                  </Button>
                </div>
              )}

              {/* For file uploads, just show cancel */}
              {!editingMember && uploadTab === 'upload' && (
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {members.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No leadership members found. Add your first member!</p>
            </CardContent>
          </Card>
        ) : (
          members.map((member, index) => (
            <Card key={member.id} className={!member.is_active ? 'opacity-60' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  {member.image_url && (
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <span>{member.name}</span>
                      {!member.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{member.position}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveUp(member)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(member)}
                    disabled={index === members.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(member.id, member.is_active)}
                  >
                    {member.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Order: {member.display_order} • Created {new Date(member.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm whitespace-pre-wrap">{member.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}