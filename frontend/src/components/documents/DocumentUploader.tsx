import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, Check, Loader2 } from 'lucide-react';
import { documentService } from '@/services/documents.service';

interface DocumentUploaderProps {
  onUploadSuccess?: () => void;
}

export function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.pdf') || 
      file.name.endsWith('.doc') || 
      file.name.endsWith('.docx')
    );

    if (validFiles.length > 0) {
      setStagedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert('Only PDF and DOC/DOCX files are supported.');
    }
  };

  const startUpload = async () => {
    if (stagedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      for (const file of stagedFiles) {
        // Set basic metadata based on filename for now
        const title = file.name.split('.').slice(0, -1).join('.') || file.name;
        const subject = 'General'; // Default
        const type = 'textbook'; // Default

        await documentService.upload(file, title, subject, type);
      }
      
      setStagedFiles([]);
      if (onUploadSuccess) onUploadSuccess();
      alert('Processing started! Your documents will appear in the library shortly.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload some documents. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className={`w-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ease-in-out cursor-pointer ${isDragging ? 'bg-medical-teal-light border-medical-teal' : 'bg-parchment border-gray-300 hover:border-medical-teal hover:bg-[#f3f6f6]'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="w-12 h-12 mb-4 text-medical-teal animate-spin" />
        ) : (
          <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-medical-teal' : 'text-gray-400'}`} />
        )}
        <h3 className="font-serif text-xl font-bold text-medical-brown mb-2">
          {isUploading ? 'Uploading & Processing...' : 'Upload your medical textbooks or notes'}
        </h3>
        <p className="text-sm text-medical-muted mb-4 text-center max-w-md">
          Drag and drop PDF or DOC files here, or click to browse. Content will be analyzed exclusively for your AI Tutor and quizzes.
        </p>
        <button disabled={isUploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <FileType className="w-4 h-4" />
          Select Files
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          className="hidden" 
          multiple 
          accept=".pdf,.doc,.docx" 
        />
      </div>

      {stagedFiles.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-white border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
          <h4 className="text-sm font-semibold text-medical-brown mb-2 border-b pb-2 flex justify-between">
            <span>Ready to upload ({stagedFiles.length})</span>
            <button onClick={() => setStagedFiles([])} className="text-xs text-red-500 hover:underline">Clear all</button>
          </h4>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {stagedFiles.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate max-w-[80%] flex items-center gap-2">
                  <FileType className="w-4 h-4 text-medical-teal" />
                  {f.name}
                </span>
                <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
             <button 
               disabled={isUploading}
               className="bg-medical-teal text-white px-6 py-2 rounded shadow hover:bg-medical-teal-dark transition text-sm font-medium flex items-center gap-2 disabled:bg-gray-400"
               onClick={(e) => {
                 e.stopPropagation();
                 startUpload();
               }}
             >
               {isUploading ? (
                 <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
               ) : (
                 <><Check className="w-4 h-4" /> Start Upload</>
               )}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
