import React, { useState } from 'react';
import { Bot, Send, X, ShieldAlert, Sparkles, Loader2, Pill } from 'lucide-react';
import type { AiChatMessage } from '../../types';
import { aiService } from '../../services/api';
import { Link } from 'react-router-dom';

export const AiMedicineAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your **MediPlus AI Medicine Assistant** 🤖. Ask me about medicine formulation, common uses, categories, storage, precautions, or prescription requirements from our database.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'This information is for educational purposes only and is not a substitute for advice from a qualified doctor or pharmacist.'
    }
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.ask(userText);
      const assistantMsg: AiChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: res.disclaimer,
        relatedMedicines: res.relatedMedicines
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue connecting to the medicine knowledge server. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'This information is for educational purposes only and is not a substitute for advice from a qualified doctor or pharmacist.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-teal-400/40"
        >
          <Bot size={20} className="animate-bounce text-emerald-200" />
          <span>AI Medicine Assistant</span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  AI Medicine Assistant
                  <Sparkles size={12} className="text-teal-400" />
                </h3>
                <p className="text-[10px] text-teal-300">Database-Verified Educational Helper</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                  {/* Related Medicines Tags */}
                  {m.relatedMedicines && m.relatedMedicines.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Database Matches:</p>
                      <div className="flex flex-wrap gap-1">
                        {m.relatedMedicines.map(rm => (
                          <Link
                            key={rm.id}
                            to={`/medicines/${rm.id}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold hover:underline"
                          >
                            <Pill size={10} />
                            {rm.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety Disclaimer */}
                  {m.disclaimer && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[10px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                      <ShieldAlert size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{m.disclaimer}</span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <Loader2 size={16} className="animate-spin text-teal-600" />
                <span>Searching verified medicine database...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions & Input */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                onClick={() => setInputQuery('What is Paracetamol used for?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 whitespace-nowrap text-[10px] font-semibold transition-colors cursor-pointer shrink-0"
              >
                Paracetamol Uses?
              </button>
              <button
                onClick={() => setInputQuery('What precautions for Pantoprazole?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 whitespace-nowrap text-[10px] font-semibold transition-colors cursor-pointer shrink-0"
              >
                Pantoprazole Precautions?
              </button>
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about a medicine in database..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiMedicineAssistant;
