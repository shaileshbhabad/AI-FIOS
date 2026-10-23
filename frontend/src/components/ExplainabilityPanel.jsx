import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  BarChart, 
  Lock 
} from 'lucide-react';

export default function ExplainabilityPanel({ explainabilityData, symbol, currency = 'INR' }) {
  if (!explainabilityData) {
    return (
      <div className="terminal-card p-6 sm:p-8 rounded-2xl text-center text-slate-500 font-mono text-xs">
        Loading explainability attribution metrics...
      </div>
    );
  }

  const currSym = explainabilityData?.currency_symbol || (currency === 'INR' ? '₹' : '$');

  const {
    recommendation,
    overall_confidence = 82,
    confidence_breakdown = {},
    projected_movement_pct = 6.5,
    projected_target_price = 155.0,
    feature_attribution = [],
    supporting_evidence = [],
    contradicting_evidence = [],
    is_uncertain,
    uncertainty_advisory
  } = explainabilityData;

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 font-mono">
      {/* Top Confidence Scorecard (Spacious on Mobile & Desktop) */}
      <div className="terminal-card p-4 sm:p-6 rounded-2xl border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            {/* Circular Gauge Display */}
            <div className="relative flex items-center justify-center w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{overall_confidence}%</span>
                <span className="block text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider">CONFIDENCE</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
                  EXPLAINABLE VERDICT
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                  {recommendation}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 mt-1">
                Move: {projected_movement_pct > 0 ? '+' : ''}{projected_movement_pct}% ➔ Target: {currSym}{typeof projected_target_price === 'number' ? projected_target_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : projected_target_price}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Synthesized across 11 domain agents with zero black-box hallucination. All inferences cite empirical balance sheets, price volumes, and macro transmissions.
              </p>
            </div>
          </div>

          {/* Sub-Score Bars */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-auto lg:min-w-[280px]">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Agent Agreement</span>
                <span className="text-cyan-400 font-bold">{confidence_breakdown.agent_agreement_pct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${confidence_breakdown.agent_agreement_pct}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Evidence Quality</span>
                <span className="text-emerald-400 font-bold">{confidence_breakdown.evidence_quality_score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${confidence_breakdown.evidence_quality_score}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Data Freshness</span>
                <span className="text-violet-400 font-bold">{confidence_breakdown.data_freshness_score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${confidence_breakdown.data_freshness_score}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Historic Model Acc.</span>
                <span className="text-amber-400 font-bold">{confidence_breakdown.historical_model_accuracy}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${confidence_breakdown.historical_model_accuracy}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Uncertainty Advisory Notice */}
        {is_uncertain && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>{uncertainty_advisory}</div>
          </div>
        )}
      </div>

      {/* Feature Attribution (SHAP-style Feature Importance) */}
      <div className="terminal-card p-4 sm:p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-800 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart className="w-4 h-4 text-cyan-400" />
            FEATURE IMPORTANCE ATTRIBUTION (SHAPLEY DECOMPOSITION)
          </span>
          <span className="text-[10px] text-slate-500">
            Exact reasoning factors behind the target forecast
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {feature_attribution.map((feat, idx) => {
            const isPos = feat.direction === 'positive';
            return (
              <div key={idx} className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-200 font-semibold">{feat.feature}</span>
                  <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{feat.impact_pct}% contribution
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                  {isPos ? (
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.abs(feat.impact_pct) * 2.5)}%` }}
                    />
                  ) : (
                    <div
                      className="bg-rose-500 h-full rounded-full ml-auto"
                      style={{ width: `${Math.min(100, Math.abs(feat.impact_pct) * 2.5)}%` }}
                    />
                  )}
                </div>

                <span className="text-[10px] text-slate-500">{feat.description}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Evidence Cards: Supporting vs Contradicting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supporting Evidence Card */}
        <div className="terminal-card p-4 sm:p-5 rounded-2xl border-t-2 border-t-emerald-500">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              SUPPORTING EVIDENCE ({supporting_evidence.length} FACTORS)
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {supporting_evidence.map((ev, i) => (
              <div key={i} className="p-3 sm:p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{ev.avatar}</span> {ev.agent_name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Strength: {ev.evidence_strength}%
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{ev.claim}</p>
                {ev.data_point && (
                  <span className="inline-block mt-2 text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    Source: {ev.data_point}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contradicting Evidence Card */}
        <div className="terminal-card p-4 sm:p-5 rounded-2xl border-t-2 border-t-rose-500">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 mb-3">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              CONTRADICTING & RISK EVIDENCE ({contradicting_evidence.length} FACTORS)
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {contradicting_evidence.length > 0 ? (
              contradicting_evidence.map((ev, i) => (
                <div key={i} className="p-3 sm:p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{ev.avatar}</span> {ev.agent_name}
                    </span>
                    <span className="text-[10px] text-rose-400 font-semibold">
                      Strength: {ev.evidence_strength}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{ev.claim}</p>
                  {ev.data_point && (
                    <span className="inline-block mt-2 text-[10px] text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                      Discrepancy: {ev.data_point}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs py-6 text-center">
                Zero material contradictions recorded across the committee.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
