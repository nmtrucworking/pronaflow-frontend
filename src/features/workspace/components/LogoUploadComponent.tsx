import React, { useEffect, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { Camera, CheckCircle, Palette, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { workspaceService } from '../../../services/workspaceService';

interface LogoUploadComponentProps {
  workspaceId: string;
  currentLogoUrl?: string;
  onUploadSuccess?: (logoUrl: string) => void;
}

type PresetLogo = {
  id: string;
  name: string;
  initials: string;
  from: string;
  to: string;
};

const PRESET_LOGOS: PresetLogo[] = [
  { id: 'aurora', name: 'Aurora', initials: 'AU', from: '#06b6d4', to: '#2563eb' },
  { id: 'pulse', name: 'Pulse', initials: 'PL', from: '#8b5cf6', to: '#ec4899' },
  { id: 'forest', name: 'Forest', initials: 'FR', from: '#10b981', to: '#0f766e' },
  { id: 'ember', name: 'Ember', initials: 'EM', from: '#f97316', to: '#ef4444' },
  { id: 'midnight', name: 'Midnight', initials: 'MN', from: '#0f172a', to: '#334155' },
  { id: 'sunrise', name: 'Sunrise', initials: 'SR', from: '#f59e0b', to: '#f43f5e' },
  { id: 'sky', name: 'Sky', initials: 'SK', from: '#38bdf8', to: '#6366f1' },
  { id: 'mono', name: 'Mono', initials: 'PF', from: '#475569', to: '#0f172a' },
];

const createPresetSvg = (preset: PresetLogo) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="grad-${preset.id}" x1="48" y1="44" x2="468" y2="470" gradientUnits="userSpaceOnUse">
      <stop stop-color="${preset.from}" />
      <stop offset="1" stop-color="${preset.to}" />
    </linearGradient>
  </defs>
  <rect x="24" y="24" width="464" height="464" rx="96" fill="url(#grad-${preset.id})" />
  <circle cx="384" cy="136" r="56" fill="white" fill-opacity="0.12" />
  <circle cx="132" cy="360" r="72" fill="white" fill-opacity="0.10" />
  <text x="256" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="132" font-weight="700" letter-spacing="4" fill="white">${preset.initials}</text>
  <text x="256" y="350" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600" letter-spacing="4" fill="white" fill-opacity="0.90">PRONAFLOW</text>
</svg>`;

const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const createFileFromSvg = (svg: string, filename: string) =>
  new File([svg], filename, { type: 'image/svg+xml' });

export const LogoUploadComponent: React.FC<LogoUploadComponentProps> = ({
  workspaceId,
  currentLogoUrl,
  onUploadSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentLogoUrl || '');
  }, [currentLogoUrl]);

  const uploadFile = async (file: File) => {
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setError('Only PNG, JPEG, GIF, WebP, and SVG formats are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const logoUrl = await workspaceService.uploadLogo(workspaceId, file);
      setPreviewUrl(logoUrl);
      setSuccess(true);
      onUploadSuccess?.(logoUrl);
      window.setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handlePresetSelect = async (preset: PresetLogo) => {
    const svg = createPresetSvg(preset);
    const file = createFileFromSvg(svg, `${preset.id}.svg`);
    await uploadFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      await workspaceService.removeLogo(workspaceId);
      setPreviewUrl('');
      setSuccess(true);
      onUploadSuccess?.('');
      window.setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove logo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group relative shrink-0 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white transition-transform duration-200 hover:scale-[1.02] dark:ring-slate-900"
        >
          <div className="flex h-24 w-24 items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Workspace logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-black tracking-tight">PF</span>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/35 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
            <Camera className="mb-1 h-5 w-5 text-white drop-shadow" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              Change logo
            </span>
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          align="start"
          className="z-50 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-900"
        >
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
              <Tabs.Trigger
                value="upload"
                className="flex-1 px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
              >
                Upload
              </Tabs.Trigger>
              <Tabs.Trigger
                value="presets"
                className="flex-1 px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
              >
                Presets
              </Tabs.Trigger>
              <Tabs.Trigger
                value="library"
                className="flex-1 px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
              >
                Library
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-4">
              <Tabs.Content value="upload" className="outline-none">
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10'
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isLoading ? 'Uploading...' : 'Drop a logo here'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF, WebP or SVG up to 5MB
                  </p>

                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Choose file
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('presets')}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Use preset
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    className="hidden"
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="presets" className="outline-none">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ready-made logos
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_LOGOS.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      disabled={isLoading}
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                    >
                      <div
                        className="relative flex h-24 items-center justify-center overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_45%)]" />
                        <span className="relative text-3xl font-black tracking-[0.24em] text-white drop-shadow-sm">
                          {preset.initials}
                        </span>
                        <span className="absolute bottom-2 right-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="library" className="outline-none">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <Palette className="h-3.5 w-3.5" />
                  Style library
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_LOGOS.slice(0, 6).map((preset) => {
                    const preview = svgToDataUrl(createPresetSvg(preset));
                    return (
                      <button
                        key={`library-${preset.id}`}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        disabled={isLoading}
                        className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 transition hover:border-indigo-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                      >
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-slate-950">
                          <img src={preview} alt={preset.name} className="h-20 w-full object-cover" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Tabs.Content>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={isLoading || !currentLogoUrl}
                className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove logo
              </button>

              <div className="flex items-center gap-2">
                {success && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
                <span className="text-[11px] text-slate-400">PNG/JPG/GIF/WebP/SVG</span>
              </div>
            </div>
          </Tabs.Root>

          <Popover.Arrow className="fill-white dark:fill-slate-900" />
        </Popover.Content>
      </Popover.Portal>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-300">
          <X className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </Popover.Root>
  );
};
