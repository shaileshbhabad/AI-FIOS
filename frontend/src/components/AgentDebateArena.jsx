import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Cpu, 
  Scale, 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  RefreshCw, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Vote,
  Gavel,
  Volume2,
  VolumeX,
  FastForward,
  CheckCircle2
} from 'lucide-react';

export default function AgentDebateArena({ 
  symbol, 
  debateData, 
  loading, 
  onRunDebate,
  currency = 'INR'
}) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeRound, setActiveRound] = useState(0);

  // Live Streaming States
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x or 2x
  const [allMessages, setAllMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const opinions = debateData?.independent_agent_opinions || [];
  const transcript = debateData?.debate_transcript || [];
  const verdict = debateData?.judge_verdict || {};
  const voting = debateData?.voting_breakdown || {
    bullish: { count: 8, agents: [] },
    bearish: { count: 1, agents: [] },
    neutral: { count: 2, agents: [] }
  };

  const currSym = debateData?.currency_symbol || (currency === 'INR' ? '₹' : '$');

  // Flatten messages for streaming
  useEffect(() => {
    if (transcript.length > 0) {
      const flattened = [];
      transcript.forEach((round) => {
        round.messages.forEach((msg) => {
          flattened.push({
            ...msg,
            round_title: round.round_title,
            round_number: round.round_number
          });
        });
      });
      setAllMessages(flattened);
    }
  }, [transcript]);

  // Live Streaming Playback Timer
  useEffect(() => {
    let timer;
    if (isStreaming && allMessages.length > 0) {
      if (streamIndex < allMessages.length) {
        const delay = playbackSpeed === 2 ? 1100 : 2200;
        timer = setTimeout(() => {
          setStreamIndex((prev) => prev + 1);
        }, delay);
      } else {
        setIsStreaming(false);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.35 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6']
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isStreaming, streamIndex, allMessages, playbackSpeed]);

  const handleStartStream = () => {
    setStreamIndex(0);
    setIsStreaming(true);
  };

  const handleSkipToJudge = () => {
    setStreamIndex(allMessages.length);
    setIsStreaming(false);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.3 }
    });
  };

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = (
      `AI-FIOS Financial Intelligence Operating System committee ruling on ${symbol}. ` +
      `Consensus verdict: ${verdict.verdict || 'Strong Buy'}. ` +
      `Recommended action: ${verdict.action_code || 'Accumulate'}. ` +
      `Target objective: ${verdict.recommended_positioning?.target_objective || 'Target objective confirmed'}. ` +
      `Stop loss protection: ${verdict.recommended_positioning?.stop_loss_protection || 'Protected'}. ` +
      `${verdict.judge_synthesis || ''}`
    );

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getStanceColor = (stance) => {
    if (stance === 'BULLISH') return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (stance === 'BEARISH') return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const visibleMessages = isStreaming
    ? allMessages.slice(0, streamIndex + 1)
    : transcript[activeRound]?.messages || [];

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 font-mono text-xs">
      {/* Top Banner: Judge Agent Synthesis Ruling */}
      <div className="terminal-card p-4 sm:p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0a1222] via-[#080d19] to-[#0a1222] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Gavel className="w-4 h-4" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-cyan-400 uppercase">
                JUDGE AGENT SYNTHESIS RULING · LAYER 5
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-3xl font-black text-slate-100 tracking-wide">
                VERDICT: {verdict.verdict || 'STRONG BUY'}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-bold">
                ACTION: {verdict.action_code || 'ACCUMULATE'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                CONVICTION: {verdict.conviction_tier || 'HIGH'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 max-w-4xl leading-relaxed">
              {verdict.judge_synthesis || 'Presiding over 3 rounds of multi-agent debate across Financial, Technical, Risk, Macro, and Geopolitical squads.'}
            </p>
          </div>

          {/* Trigger Streaming & Voice Controls (Spacious Mobile Grid) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            {/* AI Voice Briefing Button */}
            <button
              onClick={handleToggleVoice}
              className={`px-3 py-2.5 sm:py-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer active:scale-95 ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-slate-900 border-slate-700 hover:border-cyan-500 text-cyan-300'
              }`}
              title="Listen to Judge Agent Audio Verdict"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
            </button>

            {/* Stream Play/Pause */}
            <button
              onClick={isStreaming ? () => setIsStreaming(false) : handleStartStream}
              className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95"
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  STREAM
                </>
              )}
            </button>

            {/* Speed Toggle */}
            {isStreaming && (
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
                className="px-2.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold hover:text-white"
                title="Toggle playback speed"
              >
                {playbackSpeed}x
              </button>
            )}

            {isStreaming && (
              <button
                onClick={handleSkipToJudge}
                className="px-3 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold hover:text-cyan-400 flex items-center justify-center gap-1"
                title="Skip to Judge verdict"
              >
                <FastForward className="w-3.5 h-3.5" />
                Skip
              </button>
            )}

            <button
              onClick={onRunDebate}
              disabled={loading}
              className="col-span-2 sm:col-span-1 px-3 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              title="Re-compute all agent metrics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sm:hidden">Re-compute Debate</span>
            </button>
          </div>
        </div>

        {/* Positioning Parameters in ₹ INR */}
        {verdict.recommended_positioning && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-900/70 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold">ENTRY BENCHMARK</span>
              <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5 truncate">{verdict.recommended_positioning.entry_level}</div>
            </div>
            <div className="bg-slate-900/70 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold">PRICE TARGET</span>
              <div className="text-emerald-400 font-bold text-sm sm:text-base mt-0.5 truncate">{verdict.recommended_positioning.target_objective}</div>
            </div>
            <div className="bg-slate-900/70 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold">STOP-LOSS GUARD</span>
              <div className="text-rose-400 font-bold text-sm sm:text-base mt-0.5 truncate">{verdict.recommended_positioning.stop_loss_protection}</div>
            </div>
            <div className="bg-slate-900/70 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold">RISK / REWARD</span>
              <div className="text-cyan-400 font-bold text-sm sm:text-base mt-0.5">{verdict.recommended_positioning.risk_reward_ratio}x</div>
            </div>
          </div>
        )}
      </div>

      {/* Live Committee Voting Distribution (Spacious Grid on Mobile) */}
      <div className="terminal-card p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d17]">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-300 uppercase tracking-wider text-xs">
            Committee Voting Consensus ({opinions.length} Agents)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center">
          <span className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="truncate">Bull: {voting.bullish?.count || 0}</span>
          </span>
          <span className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-center">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span className="truncate">Neut: {voting.neutral?.count || 0}</span>
          </span>
          <span className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-center">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
            <span className="truncate">Bear: {voting.bearish?.count || 0}</span>
          </span>
        </div>
      </div>

      {/* Main Deliberation Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: All 11 Specialized Agents Roster */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            SPECIALIZED AGENT SQUADS (11 AGENTS)
          </span>

          <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
            {opinions.map((agent) => {
              const isSelected = selectedAgent?.agent_id === agent.agent_id;
              const stanceStyle = getStanceColor(agent.stance);

              return (
                <div
                  key={agent.agent_id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/70 shadow-[0_0_14px_rgba(6,182,212,0.25)]'
                      : 'bg-[#090e1a]/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{agent.avatar}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-200">{agent.agent_name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{agent.squad?.replace('_', ' & ')}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${stanceStyle}`}>
                        {agent.stance}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {agent.confidence}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {agent.summary_claim}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span>{agent.key_metric}</span>
                    <span className="text-cyan-400 flex items-center gap-0.5 font-bold">
                      Audit <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Live Stream Transcript */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="terminal-card p-4 sm:p-5 rounded-2xl flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                {isStreaming ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    STREAMING DEBATE ({streamIndex + 1}/{allMessages.length})
                  </span>
                ) : (
                  'MULTI-ROUND CROSS-EXAMINATION LOG'
                )}
              </span>

              {!isStreaming && (
                <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto scrollbar-none py-0.5">
                  {transcript.map((rd, idx) => (
                    <button
                      key={rd.round_number}
                      onClick={() => setActiveRound(idx)}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        activeRound === idx
                          ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-500 hover:text-slate-300 bg-slate-900'
                      }`}
                    >
                      Round {rd.round_number}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {visibleMessages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs transition-all animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{msg.avatar}</span>
                      <span className="font-bold text-slate-200">{msg.speaker}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {msg.role}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStanceColor(msg.stance)}`}>
                      {msg.stance}
                    </span>
                  </div>

                  {msg.thought_process && (
                    <div className="mb-2 p-2.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-cyan-400 flex items-start gap-1.5 leading-relaxed">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{msg.thought_process}</span>
                    </div>
                  )}

                  <p className="text-slate-300 text-xs sm:text-xs leading-relaxed">
                    "{msg.statement}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedAgent && (
            <div className="terminal-card p-4 rounded-xl border-l-4 border-l-cyan-500 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedAgent.avatar}</span>
                  <div>
                    <span className="font-bold text-slate-200">{selectedAgent.agent_name}</span>
                    <span className="text-slate-400 text-[10px] ml-2">Conviction: {selectedAgent.confidence}%</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer p-1"
                >
                  ✕ Close
                </button>
              </div>

              <div className="mt-2 text-slate-300 leading-relaxed text-xs">
                {selectedAgent.reasoning}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
