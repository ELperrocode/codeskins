import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { IconTrash, IconGripVertical, IconUpload } from '@tabler/icons-react';
import { uploadTemplateImage } from '../../lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TemplateImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export const TemplateImageUploader: React.FC<TemplateImageUploaderProps> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadTemplateImage(file);
        // Convert relative URL to absolute URL
        const absoluteUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        urls.push(absoluteUrl);
      } catch (error) {
        console.error('Upload error:', error);
        // Optionally show error toast
      }
    }
    onChange([...value, ...urls]);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = (index: number) => {
    const newArr = [...value];
    newArr.splice(index, 1);
    onChange(newArr);
  };

  // Simple reordering (move up/down)
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const arr = [...value];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onChange(arr);
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <IconUpload className="mx-auto w-8 h-8 text-primary-500 mb-2" />
        <p className="text-gray-700">Drag & drop images here, or <span className="text-primary-600 underline">click to select</span></p>
        <p className="text-xs text-gray-400 mt-1">You can upload multiple images. Max size: 5MB each.</p>
        {uploading && <div className="mt-2 text-primary-500">Uploading...</div>}
      </div>
      {/* Previews */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, idx) => (
            <div key={url} className="relative group border rounded-lg overflow-hidden">
              <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
                onClick={e => { e.stopPropagation(); handleRemove(idx); }}
              >
                <IconTrash className="w-4 h-4 text-red-500" />
              </button>
              {/* Reorder buttons */}
              <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                <button type="button" onClick={e => { e.stopPropagation(); moveImage(idx, idx - 1); }} disabled={idx === 0} className="bg-white/80 rounded-full p-1 mb-1 disabled:opacity-50">
                  <span className="text-xs">↑</span>
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); moveImage(idx, idx + 1); }} disabled={idx === value.length - 1} className="bg-white/80 rounded-full p-1 disabled:opacity-50">
                  <span className="text-xs">↓</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 