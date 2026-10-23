import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck,
  Award
} from 'lucide-react';

export default function ResearchMemoViewer({ symbol, currency = 'INR' }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/asset/${symbol}/report?currency=${currency}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchReport();
    }
  }, [symbol, currency]);

  const handleCopy = () => {
    if (report?.markdown_content) {
      navigator.clipboard.writeText(report.markdown_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Top Action Bar */}
      <div className="terminal-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100 tracking-wider">
              AUTONOMOUS RESEARCH AGENT BRIEFING · STEP 10
            </h2>
            <p className="text-[11px] text-slate-400">
              Institutional Investment Briefing with Native {currency} (₹) Valuation Modeling. Boardroom-ready printable briefing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Institutional Briefing
          </button>
        </div>
      </div>

      {/* Main Memo Paper Container (Boardroom Print Styling) */}
      <div className="terminal-card p-6 sm:p-12 rounded-2xl border border-slate-700/60 bg-[#060a14] max-w-5xl mx-auto w-full shadow-2xl relative">
        {/* Subtle Watermark */}
        <div className="absolute top-10 right-10 text-[60px] font-black text-slate-800/10 select-none pointer-events-none">
          AI-FIOS PRO
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            <span>Autonomous Research Agent synthesizing 10-step institutional intelligence memo...</span>
          </div>
        ) : report ? (
          <article className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed font-mono">
            <div className="whitespace-pre-wrap leading-relaxed">
              {report.markdown_content}
            </div>
          </article>
        ) : (
          <div className="py-16 text-center text-slate-500">
            Select an asset to generate an autonomous research memo.
          </div>
        )}
      </div>
    </div>
  );
}
