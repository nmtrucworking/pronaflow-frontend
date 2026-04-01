import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { workspaceService } from '../../../services/workspaceService';

interface LogoUploadComponentProps {
  workspaceId: string;
  currentLogoUrl?: string;
  onUploadSuccess?: (logoUrl: string) => void;
}

export const LogoUploadComponent: React.FC<LogoUploadComponentProps> = ({
  workspaceId,
  currentLogoUrl,
  onUploadSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Only PNG, JPEG, GIF, and WebP formats are supported');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const logoUrl = await workspaceService.uploadLogo(workspaceId, file);
      setSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess(logoUrl);
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      await workspaceService.removeLogo(workspaceId);
      setSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess('');
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove logo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Workspace Logo</h3>
          <p className="text-sm text-gray-600 mt-1">
            Upload a logo to personalize your workspace. Supported formats: PNG, JPEG, GIF, WebP (max 5MB)
          </p>
        </div>
      </div>

      {/* Current Logo Preview */}
      {currentLogoUrl && (
        <div className="relative inline-block">
          <img
            src={currentLogoUrl}
            alt="Workspace logo"
            className="h-24 w-24 object-contain bg-gray-100 rounded-lg border border-gray-300 p-2"
          />
          {!isLoading && (
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              title="Remove logo"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="logo-upload"
          className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <input
            ref={fileInputRef}
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {isLoading ? 'Uploading...' : 'Click to upload logo'}
            </span>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <X size={16} className="text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">
            {currentLogoUrl ? 'Logo updated successfully' : 'Logo removed successfully'}
          </span>
        </div>
      )}
    </div>
  );
};
