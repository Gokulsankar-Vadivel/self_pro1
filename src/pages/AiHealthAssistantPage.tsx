import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  AlertTriangle,
  FileText,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Database,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';
import { api } from '../services/api';
import { MedicalDocument } from '../types';

interface AiHealthAssistantPageProps {
  initialQuery?: string;
  onNavigate: (page: string, params?: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  suggestedSpecialist?: string;
  retrievedDocs?: MedicalDocument[];
}

export const AiHealthAssistantPage: React.FC<AiHealthAssistantPageProps> = ({
  initialQuery = '',
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am your AI Clinical Triage Assistant powered by Gemini and our local RAG medical knowledge engine. How are you feeling today? You can describe any symptoms, onset duration, or health concerns.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRetrievedDocs, setActiveRetrievedDocs] = useState<MedicalDocument[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const result = await api.askAiSymptomAssistant({
        message: textToSend.trim(),
        conversationHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
      });

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: result.isEmergency,
        suggestedSpecialist: result.suggestedSpecialist,
        retrievedDocs: result.retrievedDocs,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (result.retrievedDocs && result.retrievedDocs.length > 0) {
        setActiveRetrievedDocs(result.retrievedDocs);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: 'I apologize, but I encountered a network error while analyzing your symptoms. Please try again or consult a physician directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleSymptoms = [
    'Throbbing headache and slight sensitivity to light for 2 days',
    'Chest discomfort and shortness of breath when climbing stairs',
    'Persistent dry cough with low-grade fever and fatigue',
    'Elevated fasting blood sugar of 165 mg/dL',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LLM + SQLite RAG Medical Triage</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Health Assistant & Clinical Triage</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time symptoms evaluator grounded in authoritative medical reference documents. Evaluates urgency, explains conditions, and directs you to the appropriate specialist.
          </p>
        </div>

        <button
          onClick={() => onNavigate('rag-knowledge')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Database className="w-4 h-4" />
          <span>Explore Knowledge DB</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chat Window (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Window Top Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Gemini Medical Triage</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <span className="text-[11px] text-slate-500">RAG Document Grounding Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: '1',
                    sender: 'assistant',
                    text: "Conversation refreshed. Please describe your symptoms or medical questions.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
                setActiveRetrievedDocs([]);
              }}
              className="p-2 text-slate-400 hover:text-teal-700 hover:bg-white rounded-lg transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser ? 'bg-slate-900 text-white' : 'bg-teal-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : msg.isEmergency
                          ? 'bg-rose-50 text-rose-900 border-2 border-rose-400 rounded-tl-none font-medium'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.isEmergency && (
                        <div className="flex items-center gap-1.5 text-rose-700 font-extrabold uppercase tracking-wider text-xs mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Emergency Red Flag Detected</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span
                        className={`block text-[10px] mt-2 font-semibold ${
                          isUser ? 'text-slate-400 text-right' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Emergency Quick Action Pill */}
                    {msg.isEmergency && (
                      <div className="bg-rose-600 p-3 rounded-xl text-white text-xs flex items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-2 font-bold">
                          <PhoneCall className="w-4 h-4 text-amber-300 animate-bounce" />
                          <span>Immediate ER Dispatch Required</span>
                        </div>
                        <button
                          onClick={() => onNavigate('emergency')}
                          className="px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-lg font-bold text-xs shrink-0 shadow-xs"
                        >
                          Trigger SOS
                        </button>
                      </div>
                    )}

                    {/* Specialist Suggestion Pill */}
                    {msg.suggestedSpecialist && !msg.isEmergency && (
                      <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                        <span className="text-teal-800 font-semibold flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                          <span>Recommended: <strong>{msg.suggestedSpecialist}</strong></span>
                        </span>
                        <button
                          onClick={() => onNavigate('doctors', { specialization: msg.suggestedSpecialist })}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs"
                        >
                          Book Doctor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-slate-100 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                  <span>Retrieving clinical documents and analyzing symptoms...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-bold shrink-0 text-[11px]">Quick Tests:</span>
            {sampleSymptoms.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-full text-slate-600 whitespace-nowrap shrink-0 transition-colors text-[11px]"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., headache, fever duration, chest tightness)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column: RAG Document Grounding Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                <span>RAG Retrieved Sources</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                SQLite Index
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Below are the clinical knowledge sources dynamically fetched to ground the AI model's response:
            </p>

            {activeRetrievedDocs.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Enter your symptoms to view the matched verified medical references.
              </div>
            ) : (
              <div className="space-y-3">
                {activeRetrievedDocs.map((doc, i) => (
                  <div key={doc.id || i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{doc.title}</span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">{doc.content}</p>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
                      <span>Source: {doc.source}</span>
                      {doc.similarity && (
                        <span className="font-bold text-emerald-600">Relevance Score: {doc.similarity}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Caution Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Medical Safety Protocol</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              AI Triage is designed for preliminary classification and clinical routing. For sudden weakness, acute shortness of breath, or trauma, activate emergency services immediately.
            </p>
            <button
              onClick={() => onNavigate('emergency')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Open Emergency Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
