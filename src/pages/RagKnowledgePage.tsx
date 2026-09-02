import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  BookOpen,
  Filter,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { MedicalDocument } from '../types';
import { api } from '../services/api';

interface RagKnowledgePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const RagKnowledgePage: React.FC<RagKnowledgePageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'All Categories',
    'Cardiology',
    'Endocrinology',
    'Pulmonology',
    'Neurology',
    'Emergency Medicine',
    'General Health',
  ];

  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  const handleSearch = async (queryText?: string) => {
    setLoading(true);
    try {
      const q = queryText !== undefined ? queryText : searchTerm;
      const data = await api.queryRagKnowledge(q, selectedCategory === 'All Categories' ? '' : selectedCategory);
      setDocuments(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Embedded Vector & Knowledge Corpus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            RAG Clinical Medical Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Explore verified clinical guidelines, pharmacology guides, and emergency procedures used by our Retrieval-Augmented Generation (RAG) engine.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Triage Chat</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clinical topics (e.g. Hypertension stages, Type 2 Diabetes, Migraine)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
            >
              {categories.map((c, i) => (
                <option key={i} value={c === 'All Categories' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Query
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Document Index (5 cols) & Full Document Reader (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Document List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Matching Reference Documents ({documents.length})</span>
            </h3>
            {loading && <span className="text-xs text-teal-600 animate-pulse">Searching...</span>}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded shrink-0">
                      {doc.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{doc.content}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200">
                    <span className="truncate">Ref: {doc.source}</span>
                    {doc.similarity && (
                      <span className="font-bold text-emerald-600">Sim: {doc.similarity}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Document Reader */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md space-y-6">
              <div className="border-b border-slate-200 pb-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {selectedDoc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">DOC-ID: #{selectedDoc.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedDoc.title}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authority Source: <strong>{selectedDoc.source}</strong></span>
                </p>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
                {selectedDoc.content}
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Grounding weight: <strong className="text-slate-800">High (1.00)</strong>
                </span>
                <button
                  onClick={() =>
                    onNavigate('ai-assistant', {
                      initialQuery: `Based on your guidelines for "${selectedDoc.title}", what are the key symptoms and first aid steps?`,
                    })
                  }
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant About This Topic</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a document to inspect clinical reference guidelines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
