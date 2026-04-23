import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Trash2, BookOpen } from 'lucide-react';

export interface DocumentRecord {
  id: string;
  title: string;
  subject: string;
  type: 'textbook' | 'notes' | 'question_paper';
  fileSize: string;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  dateStr: string;
}

interface DocumentListProps {
  documents: DocumentRecord[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  
  const getStatusBadge = (status: DocumentRecord['status']) => {
    switch(status) {
      case 'ready':
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3"/> Ready</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Clock className="w-3 h-3 animate-spin-slow"/> Processing</span>;
      case 'uploaded':
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"><Clock className="w-3 h-3"/> Queued</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3 h-3"/> Failed</span>;
    }
  };

  const getTypeStr = (type: DocumentRecord['type']) => {
    switch(type) {
      case 'textbook': return 'Textbook';
      case 'notes': return 'Notes';
      case 'question_paper': return 'Past Paper';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="medical-card p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-medical-teal-light flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-medical-teal" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-medical-brown">No documents yet</h3>
        <p className="text-medical-muted mt-2 max-w-md">
          Upload your core textbooks and handwritten notes above to teach your AI Tutor exactly what you need to study.
        </p>
      </div>
    );
  }

  return (
    <div className="medical-card overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-white">
        <h3 className="font-serif text-xl font-bold text-medical-brown">Your Library</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-parchment-light border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4 pl-6">Document Info</th>
              <th className="p-4">Subject</th>
              <th className="p-4 hidden md:table-cell">Details</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-parchment-light transition-colors group">
                <td className="p-4 pl-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-gray-50 rounded text-medical-teal border border-gray-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{doc.title}</p>
                      <p className="text-xs text-medical-muted mt-0.5">{getTypeStr(doc.type)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-700 font-medium">
                  {doc.subject}
                </td>
                <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                  <div>{doc.fileSize}</div>
                  <div className="text-xs mt-0.5">{doc.dateStr}</div>
                </td>
                <td className="p-4">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="p-4 pr-6 text-right">
                  <button 
                    onClick={() => onDelete && onDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
