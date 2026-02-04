import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, addCustomAvatar } from '../lib/supabase';

interface AvatarUploadProps {
  onUploadSuccess: () => void;
}

export function AvatarUpload({ onUploadSuccess }: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const ALLOWED_TYPES = ['.glb', '.gltf'];

  function getFileType(filename: string): 'glb' | 'gltf' | null {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'glb' || ext === 'gltf') return ext;
    return null;
  }

  function validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    const fileType = getFileType(file.name);
    if (!fileType) {
      return `Only ${ALLOWED_TYPES.join(', ')} files are allowed`;
    }

    return null;
  }

  async function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setMessage(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }

      const fileType = getFileType(file.name) as 'glb' | 'gltf';
      const timestamp = Date.now();
      const storagePath = `user-uploads/${user.id}/${timestamp}-${file.name}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(70);

      const result = await addCustomAvatar(
        file.name,
        storagePath,
        fileType,
        file.size
      );

      if (!result) {
        setMessage({ type: 'error', text: 'Failed to save avatar information' });
        return;
      }

      setUploadProgress(100);
      setMessage({
        type: 'success',
        text: `${file.name} uploaded successfully!`
      });

      setTimeout(() => {
        setMessage(null);
        setUploadProgress(0);
        onUploadSuccess();
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className={`relative p-8 rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleInputChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">
            {isUploading ? 'Uploading...' : 'Drop your avatar file here'}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            or click to browse for a file
          </p>
          <p className="text-xs text-gray-500">
            GLB or GLTF files up to {MAX_FILE_SIZE / (1024 * 1024)}MB
          </p>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`flex gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}
