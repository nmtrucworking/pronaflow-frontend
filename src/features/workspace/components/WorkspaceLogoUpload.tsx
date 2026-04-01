/**
 * Workspace Logo Upload Component
 * Handles file upload and preview for workspace branding
 */
import React, { useState, useRef } from 'react';
import { Upload, Loader, AlertCircle, Check } from 'lucide-react';
import workspaceService from '@/services/workspaceService';
import { Workspace } from '@/types/workspace';

interface WorkspaceLogoUploadProps {
  workspace: Workspace;
  onUploadSuccess: (workspace: Workspace) => void;
  onUploadError?: (error: string) => void;
}

export const WorkspaceLogoUpload: React.FC<WorkspaceLogoUploadProps> = ({
  workspace,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(workspace.logo_url || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      const errorMsg = 'File size must be less than 5MB';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Only JPG, PNG, GIF, and WebP formats are supported';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const updatedWorkspace = await workspaceService.uploadLogo(
        workspace.id,
        file
      );

      onUploadSuccess(updatedWorkspace);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      setPreview(workspace.logo_url || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Workspace logo"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Click to upload logo</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</p>
          </button>

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">Logo updated successfully</span>
        </div>
      )}
    </div>
  );
};

export default WorkspaceLogoUpload;
