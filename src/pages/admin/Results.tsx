import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, FileText, Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/ui/file-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Result {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  result_type: string | null;
  class_grade: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    result_type: 'exam',
    class_grade: '',
  });
  const [uploadTab, setUploadTab] = useState('url');
  
  const { toast } = useToast();
  const { user } = useAuth();

  const resultTypes = [
    { value: 'exam', label: 'Exam Results' },
    { value: 'test', label: 'Test Results' },
    { value: 'assignment', label: 'Assignment Results' },
    { value: 'project', label: 'Project Results' },
    { value: 'annual', label: 'Annual Results' },
  ];

  const grades = [
    { value: 'nursery', label: 'Nursery' },
    { value: 'kg', label: 'KG' },
    { value: 'class-1', label: 'Class 1' },
    { value: 'class-2', label: 'Class 2' },
    { value: 'class-3', label: 'Class 3' },
    { value: 'class-4', label: 'Class 4' },
    { value: 'class-5', label: 'Class 5' },
    { value: 'class-6', label: 'Class 6' },
    { value: 'class-7', label: 'Class 7' },
    { value: 'class-8', label: 'Class 8' },
    { value: 'class-9', label: 'Class 9' },
    { value: 'class-10', label: 'Class 10' },
  ];

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
      toast({
        title: "Error",
        description: "Failed to fetch results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (urls: string[]) => {
    if (!user || urls.length === 0) return;

    // Use the first uploaded file for the result
    const fileUrl = urls[0];
    
    try {
      const resultData = {
        title: formData.title,
        description: formData.description || null,
        file_url: fileUrl,
        result_type: formData.result_type,
        class_grade: formData.class_grade,
        created_by: user.id,
      };

      const { error } = await supabase
        .from('results')
        .insert([resultData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Result uploaded successfully",
      });

      setDialogOpen(false);
      setFormData({ title: '', description: '', file_url: '', result_type: 'exam', class_grade: '' });
      fetchResults();
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: "Error",
        description: "Failed to save result",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const resultData = {
        ...formData,
        created_by: user.id,
      };

      if (editingResult) {
        const { error } = await supabase
          .from('results')
          .update(resultData)
          .eq('id', editingResult.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Result updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('results')
          .insert([resultData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Result added successfully",
        });
      }

      setDialogOpen(false);
      setEditingResult(null);
      setFormData({ title: '', description: '', file_url: '', result_type: 'exam', class_grade: '' });
      fetchResults();
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: "Error",
        description: "Failed to save result",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      title: result.title,
      description: result.description || '',
      file_url: result.file_url,
      result_type: result.result_type || 'exam',
      class_grade: result.class_grade || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (resultId: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      const { error } = await supabase
        .from('results')
        .delete()
        .eq('id', resultId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Result deleted successfully",
      });
      
      fetchResults();
    } catch (error) {
      console.error('Error deleting result:', error);
      toast({
        title: "Error",
        description: "Failed to delete result",
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
          <h1 className="text-3xl font-bold">Results Management</h1>
          <p className="text-muted-foreground">Manage exam results and academic documents</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingResult(null);
              setFormData({ title: '', description: '', file_url: '', result_type: 'exam', class_grade: '' });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
              <DialogDescription>
                {editingResult ? 'Update the result details.' : 'Upload a new result file.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Result Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Mid-term Exam Results - March 2024"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="result_type">Result Type</Label>
                  <Select value={formData.result_type} onValueChange={(value) => setFormData({ ...formData, result_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resultTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class_grade">Class/Grade</Label>
                  <Select value={formData.class_grade} onValueChange={(value) => setFormData({ ...formData, class_grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional information about the results"
                />
              </div>

              {/* File Source Selection */}
              {!editingResult && (
                <Tabs value={uploadTab} onValueChange={setUploadTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">File URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file_url">File URL</Label>
                      <Input
                        id="file_url"
                        type="url"
                        value={formData.file_url}
                        onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                        placeholder="https://example.com/result.pdf"
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload
                      bucket="results-files"
                      folder="results"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      multiple={false}
                      maxFiles={1}
                      maxSize={10}
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

              {/* For editing existing results */}
              {editingResult && (
                <div className="space-y-2">
                  <Label htmlFor="file_url">File URL</Label>
                  <Input
                    id="file_url"
                    type="url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    placeholder="https://example.com/result.pdf"
                    required
                  />
                </div>
              )}
              
              {/* Only show submit button for URL uploads or editing */}
              {(editingResult || uploadTab === 'url') && (
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingResult ? 'Update' : 'Add'}
                  </Button>
                </div>
              )}

              {/* For file uploads, just show cancel */}
              {!editingResult && uploadTab === 'upload' && (
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
        {results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No results found. Add your first result!</p>
            </CardContent>
          </Card>
        ) : (
          results.map((result) => (
            <Card key={result.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">{result.title}</CardTitle>
                  <CardDescription>
                    {resultTypes.find(t => t.value === result.result_type)?.label} • 
                    {grades.find(g => g.value === result.class_grade)?.label} • 
                    {new Date(result.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(result.file_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(result)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(result.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {result.description && (
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                )}
                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                  <Download className="mr-1 h-3 w-3" />
                  <a 
                    href={result.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Download File
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}