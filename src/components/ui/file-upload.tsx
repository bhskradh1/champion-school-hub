import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
  url?: string;
  error?: string;
}

export function FileUpload({
  bucket,
  folder = '',
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5,
  onUploadComplete,
  onUploadError,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = [];
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    Array.from(selectedFiles).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSize}MB limit`,
          variant: "destructive"
        });
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        file,
        preview,
        progress: 0,
        uploaded: false
      });
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        if (fileData.uploaded) {
          if (fileData.url) uploadedUrls.push(fileData.url);
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const fileExtension = fileData.file.name.split('.').pop();
        const fileName = `${folder ? folder + '/' : ''}${timestamp}-${randomStr}.${fileExtension}`;

        try {
          // Update progress
          setFiles(prev => prev.map((f, index) => 
            index === i ? { ...f, progress: 50 } : f
          ));

          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileData.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

          uploadedUrls.push(publicUrl);

          // Update file status
          setFiles(prev => prev.map((f, index) => 
            index === i 
              ? { ...f, progress: 100, uploaded: true, url: publicUrl }
              : f
          ));

        } catch (error) {
          console.error(`Error uploading ${fileData.file.name}:`, error);
          setFiles(prev => prev.map((f, index) => 
            index === i 
              ? { ...f, error: `Failed to upload: ${error.message}` }
              : f
          ));
        }
      }

      onUploadComplete(uploadedUrls);
      
      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} file(s) uploaded successfully`
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMsg);
      toast({
        title: "Upload failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAll = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const isImageFile = (file: File) => file.type.startsWith('image/');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label>Upload Files</Label>
        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          {files.length > 0 && (
            <Button
              type="button"
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.uploaded)}
            >
              Upload {files.filter(f => !f.uploaded).length} Files
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Max {maxFiles} files, up to {maxSize}MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
          
          <div className="grid gap-3">
            {files.map((fileData, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {isImageFile(fileData.file) ? (
                    <img
                      src={fileData.preview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileData.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {fileData.progress > 0 && !fileData.uploaded && (
                    <Progress value={fileData.progress} className="h-1 mt-1" />
                  )}
                  
                  {fileData.error && (
                    <p className="text-xs text-destructive mt-1">{fileData.error}</p>
                  )}
                  
                  {fileData.uploaded && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}