import React, { useState } from 'react';
import { 
  Compass, 
  TrendingDown, 
  RotateCcw, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  AlertOctagon 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export default function HistoricalAnalogMatcher({ analogsData }) {
  const allAnalogs = analogsData?.all_analogs || [];
  const [selectedCrisis, setSelectedCrisis] = useState(
    analogsData?.top_match || (allAnalogs.length > 0 ? allAnalogs[0] : null)
  );

  if (!allAnalogs.length) {
    return (
      <div className="terminal-card p-8 rounded-xl text-center text-slate-500 font-mono text-xs">
        Matching current macro regime against historic crisis templates...
      </div>
    );
  }

  const active = selectedCrisis || allAnalogs[0];

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Top Header Card */}
      <div className="terminal-card p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-slate-100 tracking-wider">
              HISTORICAL ANALOG REGIME MATCHER · LAYER 6
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates current cross-asset volatility, inflation, and rates against 6 historic market dislocations.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs text-amber-300">
          Top Match: <span className="font-bold">{analogsData?.top_match?.name}</span> ({analogsData?.top_match?.similarity_score}% Structural Match)
        </div>
      </div>

      {/* Grid: Crisis Selector & Trajectory Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Ranked Crisis Analogs */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Ranked Macro Analog Regimes
          </span>

          <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
            {allAnalogs.map((crisis) => {
              const isSelected = active?.id === crisis.id;
              const sim = crisis.similarity_score;

              return (
                <div
                  key={crisis.id}
                  onClick={() => setSelectedCrisis(crisis)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0b101c]/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{crisis.name}</span>
                    <span className="text-xs font-black text-amber-400">{sim}% Match</span>
                  </div>

                  {/* Similarity Progress Bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${sim}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Drawdown: <span className="text-rose-400 font-bold">{crisis.max_drawdown}%</span></span>
                    <span>Recovery: <span className="text-emerald-400 font-bold">{crisis.recovery_months} Mos</span></span>
                    <span>Peak VIX: <span className="text-violet-400 font-bold">{crisis.volatility_vix}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Trajectory & Regime Comparison */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {active && (
            <>
              {/* Drawdown Curve Simulation */}
              <div className="terminal-card p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                    Historic Drawdown & Recovery Path ({active.name})
                  </span>
                  <span className="text-[10px] text-slate-500">Base = 100 Index Units</span>
                </div>

                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={active.recovery_trajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                      <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                      />
                      <ReferenceLine y={100} stroke="#475569" strokeDasharray="2 2" />
                      <Line
                        type="monotone"
                        dataKey="index_level"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#f59e0b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Regime Parameters Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">PEAK VIX</span>
                  <div className="text-violet-400 font-bold text-sm mt-0.5">{active.volatility_vix}</div>
                  <span className="text-[10px] text-slate-400">Current: 22.5</span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">MAX DRAWDOWN</span>
                  <div className="text-rose-400 font-bold text-sm mt-0.5">{active.max_drawdown}%</div>
                  <span className="text-[10px] text-slate-400">Trough: ~3-5 Mos</span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">RECOVERY SPAN</span>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{active.recovery_months} Months</div>
                  <span className="text-[10px] text-slate-400">Mean Reversion</span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">ERA PERIOD</span>
                  <div className="text-slate-200 font-bold text-xs mt-0.5">{active.period}</div>
                </div>
              </div>

              {/* Tactical Takeaway & Institutional Playbook */}
              <div className="terminal-card p-3.5 rounded-xl border-l-4 border-l-amber-500 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5">
                  <BookOpen className="w-4 h-4" />
                  TACTICAL PORTFOLIO PLAYBOOK FROM THIS ANALOG
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {active.tactical_implication}
                </p>

                {active.key_drivers && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block mb-1">Key Historical Catalysts:</span>
                    <div className="flex flex-wrap gap-1">
                      {active.key_drivers.map((kd, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {kd}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
