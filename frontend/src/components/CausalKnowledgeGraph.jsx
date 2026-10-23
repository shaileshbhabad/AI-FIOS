import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  RotateCcw,
  AlertTriangle,
  Layers,
  Flame
} from 'lucide-react';

export default function CausalKnowledgeGraph({ 
  graphData, 
  selectedAsset, 
  onSelectNode 
}) {
  const [activeNode, setActiveNode] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [shockResult, setShockResult] = useState(null);
  const [shockIntensity, setShockIntensity] = useState(1.0);
  const [loadingShock, setLoadingShock] = useState(false);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  const nodeConfig = {
    geopolitical: { fill: '#ef4444', stroke: '#f87171', label: 'Geopolitical' },
    macro: { fill: '#f59e0b', stroke: '#fbbf24', label: 'Macro Driver' },
    structural: { fill: '#8b5cf6', stroke: '#a78bfa', label: 'Structural' },
    commodities: { fill: '#10b981', stroke: '#34d399', label: 'Commodity' },
    tech_supply: { fill: '#06b6d4', stroke: '#38bdf8', label: 'Tech Supply' },
    channels: { fill: '#6366f1', stroke: '#818cf8', label: 'Transmission' },
    sectors: { fill: '#3b82f6', stroke: '#60a5fa', label: 'Sector' },
    equities: { fill: '#10b981', stroke: '#22c55e', label: 'Asset / Equity' }
  };

  const positions = {
    geo_mideast_conflict: { x: 80, y: 120 },
    geo_red_sea_blockade: { x: 80, y: 220 },
    geo_opec_cut: { x: 80, y: 320 },
    geo_us_china_tariffs: { x: 80, y: 420 },
    macro_fed_rate_hike: { x: 80, y: 520 },
    ai_infrastructure_boom: { x: 80, y: 620 },
    macro_rate_cut: { x: 80, y: 720 },

    comm_crude_oil: { x: 280, y: 200 },
    comm_freight_rates: { x: 280, y: 300 },
    comm_gold: { x: 280, y: 100 },
    comm_semiconductors: { x: 280, y: 500 },

    channel_fuel_costs: { x: 480, y: 220 },
    channel_cloud_capex: { x: 480, y: 580 },
    channel_discount_rate: { x: 480, y: 440 },
    channel_fx_inr_depr: { x: 480, y: 700 },

    sec_airlines: { x: 680, y: 200 },
    sec_energy_refining: { x: 680, y: 300 },
    sec_semiconductors: { x: 680, y: 500 },
    sec_cloud_software: { x: 680, y: 600 },
    sec_indian_it: { x: 680, y: 700 },
    sec_banking: { x: 680, y: 400 },

    NVDA: { x: 880, y: 480 },
    AAPL: { x: 880, y: 380 },
    MSFT: { x: 880, y: 580 },
    TSLA: { x: 880, y: 660 },
    'RELIANCE.NS': { x: 880, y: 280 },
    'TCS.NS': { x: 880, y: 720 },
    'HDFCBANK.NS': { x: 880, y: 180 },
    'CL=F': { x: 880, y: 100 },
    'GC=F': { x: 880, y: 50 }
  };

  const handleNodeClick = (node) => {
    setActiveNode(node);
    if (onSelectNode) onSelectNode(node.id);

    const connected = edges.filter(
      (e) => e.source === node.id || e.target === node.id
    );
    setHighlightedEdges(connected);
  };

  const handleSimulateShock = async () => {
    if (!activeNode) return;
    setLoadingShock(true);
    try {
      const res = await fetch('/api/knowledge-graph/simulate-shock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_id: activeNode.id, intensity: shockIntensity })
      });
      if (res.ok) {
        const data = await res.json();
        setShockResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingShock(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Header */}
      <div className="terminal-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-slate-100 tracking-wider">
              INTERACTIVE CAUSAL KNOWLEDGE GRAPH & SHOCK SIMULATOR · LAYER 3
            </h2>
          </div>
          <p className="text-slate-400 mt-1">
            Click any macroeconomic event or commodity to simulate an exogenous disruption shockwave across the market.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Geopolitical
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Macro Shock
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Commodity
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Target Equity
          </span>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 terminal-card p-4 rounded-2xl overflow-x-auto min-h-[580px] flex items-center justify-center relative bg-[#050913]">
          <svg
            viewBox="0 0 980 800"
            className="w-full h-[620px] select-none"
          >
            <defs>
              <marker
                id="arrowhead-pos"
                markerWidth="8"
                markerHeight="6"
                refX="14"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
              </marker>
              <marker
                id="arrowhead-neg"
                markerWidth="8"
                markerHeight="6"
                refX="14"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
              </marker>
              <marker
                id="arrowhead-hl"
                markerWidth="10"
                markerHeight="8"
                refX="16"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#10b981" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, idx) => {
              const srcPos = positions[e.source] || { x: 100, y: 100 };
              const tgtPos = positions[e.target] || { x: 500, y: 500 };
              const isHl = highlightedEdges.some(
                (h) => h.source === e.source && h.target === e.target
              );

              return (
                <line
                  key={idx}
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke={isHl ? '#10b981' : e.polarity > 0 ? '#1e3a5f' : '#4a1d24'}
                  strokeWidth={isHl ? 3.0 : 1.2}
                  strokeDasharray={isHl ? 'none' : '4 2'}
                  markerEnd={isHl ? 'url(#arrowhead-hl)' : e.polarity > 0 ? 'url(#arrowhead-pos)' : 'url(#arrowhead-neg)'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const pos = positions[n.id] || { x: 450, y: 400 };
              const config = nodeConfig[n.group] || { fill: '#64748b', stroke: '#94a3b8' };
              const isSelected = activeNode?.id === n.id;
              const isTargetAsset = n.id === selectedAsset;

              return (
                <g
                  key={n.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => handleNodeClick(n)}
                  className="cursor-pointer group"
                >
                  {(isSelected || isTargetAsset) && (
                    <circle
                      r="24"
                      fill="none"
                      stroke={isSelected ? '#06b6d4' : '#10b981'}
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                    />
                  )}

                  <circle
                    r={isSelected ? '16' : '12'}
                    fill={config.fill}
                    stroke={isSelected ? '#ffffff' : config.stroke}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="transition-all duration-200 group-hover:scale-125 shadow-lg"
                  />

                  <text
                    y="24"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : isTargetAsset ? '#4ade80' : '#cbd5e1'}
                    fontSize={isSelected ? '11' : '10'}
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Column: Interactive Shock Simulator Panel */}
        <div className="lg:col-span-4 terminal-card p-5 rounded-2xl flex flex-col gap-4">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              CAUSAL SHOCKWAVE SIMULATOR
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              {activeNode ? `Origin: ${activeNode.label}` : 'Select any node on the graph to inject a supply or geopolitical shock.'}
            </div>
          </div>

          {activeNode ? (
            <div className="flex flex-col gap-4">
              {/* Trigger Button & Slider */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Shock Intensity:</span>
                  <span className="text-cyan-400 font-bold">{shockIntensity}x Severity</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.5"
                  value={shockIntensity}
                  onChange={(e) => setShockIntensity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />

                <button
                  onClick={handleSimulateShock}
                  disabled={loadingShock}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <Flame className="w-4 h-4 fill-current" />
                  {loadingShock ? 'Propagating Shockwave...' : 'SIMULATE SHOCKWAVE'}
                </button>
              </div>

              {/* Shock Output Results */}
              {shockResult && (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-cyan-400 font-bold block mb-1">Causal Cascade Summary:</span>
                    {shockResult.executive_summary}
                  </div>

                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Impacted Sectors & Equities ({shockResult.impacted_entities?.length || 0})
                  </span>

                  <div className="flex flex-col gap-2">
                    {shockResult.impacted_entities?.map((item, idx) => {
                      const isPos = item.estimated_delta_pct >= 0;
                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-200">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block">{item.transmission_mechanism}</span>
                          </div>
                          <span className={`font-bold font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPos ? '+' : ''}{item.estimated_delta_pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 gap-2">
              <Network className="w-8 h-8 opacity-40 text-cyan-400" />
              <p>Click any node on the left canvas to begin causal shock modeling.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
