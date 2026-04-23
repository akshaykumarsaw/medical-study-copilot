'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { DocumentList, DocumentRecord } from '@/components/documents/DocumentList';
import { documentService } from '@/services/documents.service';
import { BookMarked, RefreshCw } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDocuments = useCallback(async (showIndicator = true) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    
    // Simple polling for "processing" or "uploaded" status
    const interval = setInterval(() => {
      const hasProcessing = documents.some(d => d.status === 'processing' || d.status === 'uploaded');
      if (hasProcessing) {
        fetchDocuments(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDocuments, documents]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this document? The AI will no longer be able to reference it.')) {
      try {
        await documentService.delete(id);
        fetchDocuments();
      } catch (error) {
        alert('Failed to delete document');
      }
    }
  };

  return (
    <main className="min-h-screen bg-parchment py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-medical-teal-light rounded-lg">
                <BookMarked className="w-6 h-6 text-medical-teal" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-medical-brown">My Documents</h1>
            </div>
            <button 
              onClick={() => fetchDocuments()} 
              disabled={isRefreshing}
              className="p-2 text-medical-teal hover:bg-medical-teal-light rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Library
            </button>
          </div>
          <p className="text-medical-muted text-lg max-w-2xl">
            Upload your core medical textbooks, faculty notes, and past question papers. 
            ARIVU's AI will read and cite these specific files when answering your questions or generating quizzes.
          </p>
        </header>

        <section aria-label="Upload New Document">
          <DocumentUploader onUploadSuccess={fetchDocuments} />
        </section>

        <section aria-label="Your Document Library">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 w-full skeleton"></div>
              ))}
            </div>
          ) : (
            <DocumentList 
              documents={documents.map(d => ({
                id: d.id,
                title: d.title,
                subject: d.subject,
                type: d.type,
                fileSize: `${(d.file_size_bytes / 1024 / 1024).toFixed(1)} MB`,
                status: d.status,
                dateStr: new Date(d.created_at).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric'
                })
              }))} 
              onDelete={handleDelete} 
            />
          )}
        </section>

      </div>
    </main>
  );
}
