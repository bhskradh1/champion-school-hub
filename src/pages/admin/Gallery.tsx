import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/ui/file-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
  });
  const [uploadTab, setUploadTab] = useState('url');
  
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'events', label: 'Events' },
    { value: 'sports', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (urls: string[]) => {
    if (!user) return;

    try {
      // Create gallery items for each uploaded image
      const galleryItems = urls.map(url => ({
        title: formData.title || 'Uploaded Image',
        description: formData.description || null,
        image_url: url,
        category: formData.category,
        created_by: user.id,
      }));

      const { error } = await supabase
        .from('gallery')
        .insert(galleryItems);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${urls.length} image(s) uploaded successfully`,
      });

      setDialogOpen(false);
      setFormData({ title: '', description: '', image_url: '', category: 'general' });
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to save gallery items",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const itemData = {
        ...formData,
        created_by: user.id,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Gallery item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([itemData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Gallery item added successfully",
        });
      }

      setDialogOpen(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', image_url: '', category: 'general' });
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category || 'general',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      
      fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    }
  };

  const openPreview = (item: GalleryItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Manage school gallery images and media</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingItem(null);
              setFormData({ title: '', description: '', image_url: '', category: 'general' });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the gallery item details.' : 'Add a new image to the gallery.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={editingItem ? "Title" : "Image Title (for file upload)"}
                  required={!!editingItem}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description for the image"
                />
              </div>

              {/* Image Source Selection */}
              {!editingItem && (
                <Tabs value={uploadTab} onValueChange={setUploadTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload
                      bucket="gallery-images"
                      folder="gallery"
                      accept="image/*"
                      multiple={true}
                      maxFiles={10}
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

              {/* For editing existing items */}
              {editingItem && (
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              )}
              
              {/* Only show submit button for URL uploads or editing */}
              {(editingItem || uploadTab === 'url') && (
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update' : 'Add'}
                  </Button>
                </div>
              )}

              {/* For file uploads, just show cancel */}
              {!editingItem && uploadTab === 'upload' && (
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No gallery items found. Add your first image!</p>
            </CardContent>
          </Card>
        ) : (
          galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" onClick={() => openPreview(item)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>
                  Category: {categories.find(c => c.value === item.category)?.label || 'General'} • 
                  {new Date(item.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle>{previewItem.title}</DialogTitle>
                <DialogDescription>
                  {categories.find(c => c.value === previewItem.category)?.label} • 
                  {new Date(previewItem.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={previewItem.image_url} 
                  alt={previewItem.title}
                  className="w-full rounded-lg"
                />
                {previewItem.description && (
                  <p className="text-sm">{previewItem.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}