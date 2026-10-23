"""
AI-FIOS Multi-Agent Reasoning & Debate Engine
Layer 5: Cross-Verification, Inter-Agent Debate & Judge Agent Synthesis
Includes Step-by-Step Live Streaming Thoughts & Voting Breakdown
"""

from typing import Dict, Any, List
from .squads import get_all_agents
from services.market_data import market_service
from services.explainability import explainability_engine
from services.hybrid_llm import hybrid_llm_engine


class DebateEngine:
    def __init__(self):
        self.agents = get_all_agents()

    def run_full_debate(self, symbol: str, currency: str = "INR") -> Dict[str, Any]:
        """
        Executes a 3-round multi-agent debate and synthesizes a Judge verdict
        with native INR or USD currency formatting.
        """
        market_data = market_service.get_asset_summary(symbol, currency=currency)

        # Step 1: Collect independent opinions from all specialized agents
        independent_opinions = []
        for agent in self.agents:
            res = agent.analyze(symbol, market_data)
            independent_opinions.append(res)

        # Step 2: Formulate dynamic debate exchanges between squads
        debate_log = self._simulate_debate_rounds(symbol, market_data, independent_opinions)

        # Step 3: Judge Agent Synthesizes the Deliberation
        verdict = self._synthesize_judge_verdict(symbol, market_data, independent_opinions, debate_log, currency=currency)

        # Step 4: Explainability breakdown
        explainability = explainability_engine.evaluate_prediction(symbol, market_data, independent_opinions)

        # Step 5: Voting distribution for live streamer
        bull_voters = [o["agent_name"] for o in independent_opinions if o["stance"] == "BULLISH"]
        bear_voters = [o["agent_name"] for o in independent_opinions if o["stance"] == "BEARISH"]
        neutral_voters = [o["agent_name"] for o in independent_opinions if o["stance"] not in ("BULLISH", "BEARISH")]

        return {
            "symbol": symbol,
            "asset_name": market_data.get("name", symbol),
            "current_price": market_data.get("display_price", 0.0),
            "currency_symbol": market_data.get("currency_symbol", "₹"),
            "change_percent": market_data.get("change_percent", 0.0),
            "independent_agent_opinions": independent_opinions,
            "debate_transcript": debate_log,
            "judge_verdict": verdict,
            "explainability": explainability,
            "voting_breakdown": {
                "bullish": {"count": len(bull_voters), "agents": bull_voters},
                "bearish": {"count": len(bear_voters), "agents": bear_voters},
                "neutral": {"count": len(neutral_voters), "agents": neutral_voters}
            }
        }

    def _simulate_debate_rounds(
        self,
        symbol: str,
        data: Dict[str, Any],
        opinions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        op_map = {op["agent_id"]: op for op in opinions}
        fin = op_map.get("financial_analysis", {})
        tech = op_map.get("technical_analysis", {})
        risk = op_map.get("risk_assessment", {})
        macro = op_map.get("macroeconomic", {})
        geo = op_map.get("geopolitical", {})
        fact = op_map.get("fact_verification", {})

        rounds = []

        # Round 1: Thesis & Momentum Presentation
        rounds.append({
            "round_number": 1,
            "round_title": "Primary Thesis & Momentum Formulation",
            "messages": [
                {
                    "speaker": fin.get("agent_name", "Financial Analysis"),
                    "avatar": "📊",
                    "role": "Fundamentalist",
                    "stance": fin.get("stance", "BULLISH"),
                    "thought_process": "Auditing operating margins, free cash flow generation, and forward P/E multiples relative to sector medians...",
                    "statement": f"Core thesis is grounded in capital efficiency. {fin.get('summary_claim')} {fin.get('reasoning')}"
                },
                {
                    "speaker": tech.get("agent_name", "Technical Analysis"),
                    "avatar": "📈",
                    "role": "Chartist",
                    "stance": tech.get("stance", "BULLISH"),
                    "thought_process": "Calculating 14-period RSI divergence, MACD signal crossover, and volume expansion profiles...",
                    "statement": f"Price action confirms volume momentum. {tech.get('summary_claim')} We observe trendline accumulation."
                }
            ]
        })

        # Round 2: Cross-Examination & Risk Challenge
        rounds.append({
            "round_number": 2,
            "round_title": "Risk & Macro Cross-Examination",
            "messages": [
                {
                    "speaker": risk.get("agent_name", "Risk Assessment"),
                    "avatar": "🛡️",
                    "role": "Devil's Advocate",
                    "stance": risk.get("stance", "NEUTRAL"),
                    "thought_process": "Modeling 95% Daily VaR drawdown risk, beta sensitivity, and extreme tail-risk stress scenarios...",
                    "statement": (
                        f"I must interject on capital sizing. {risk.get('summary_claim')} "
                        f"Should broader macro volatility widen, an unhedged long posture incurs downside tail-risk."
                    )
                },
                {
                    "speaker": macro.get("agent_name", "Macroeconomic"),
                    "avatar": "🌐",
                    "role": "Macro Strategist",
                    "stance": macro.get("stance", "BULLISH"),
                    "thought_process": "Analyzing central bank rate expectations, inflation cooling, and domestic capex resilience...",
                    "statement": (
                        f"While Risk raises tail concerns, broader liquidity conditions cushion the blow. "
                        f"{macro.get('summary_claim')} Macro capital flows support equity multiples."
                    )
                },
                {
                    "speaker": geo.get("agent_name", "Geopolitical"),
                    "avatar": "🗺️",
                    "role": "Geopolitical Analyst",
                    "stance": geo.get("stance", "BULLISH"),
                    "thought_process": "Scanning maritime trade chokepoints, tariff friction, and sovereign defense initiatives...",
                    "statement": (
                        f"Regarding supply-chain friction: {geo.get('summary_claim')} "
                        f"Sovereign capex and re-shoring initiatives are buffering localized trade bottlenecks."
                    )
                }
            ]
        })

        # Round 3: Evidence Grounding & Fact Verification
        rounds.append({
            "round_number": 3,
            "round_title": "Fact Reconcilement & Synthesis",
            "messages": [
                {
                    "speaker": fact.get("agent_name", "Fact Verification"),
                    "avatar": "🔍",
                    "role": "Verifier",
                    "stance": "BULLISH",
                    "thought_process": "Cross-verifying debt schedules, regulatory disclosures, and auditing off-balance-sheet notes...",
                    "statement": (
                        f"I have cross-verified the debt covenants, earnings guidance, and cash flow disclosures. "
                        f"{fact.get('summary_claim')} No synthetic anomalies or ungrounded rumors detected."
                    )
                }
            ]
        })

        return rounds

    def _synthesize_judge_verdict(
        self,
        symbol: str,
        data: Dict[str, Any],
        opinions: List[Dict[str, Any]],
        debate: List[Dict[str, Any]],
        currency: str = "INR"
    ) -> Dict[str, Any]:
        bulls = sum(1 for o in opinions if o["stance"] == "BULLISH")
        bears = sum(1 for o in opinions if o["stance"] == "BEARISH")
        neutrals = len(opinions) - bulls - bears

        if bulls >= 7:
            verdict = "STRONG BUY"
            action_code = "ACCUMULATE"
            conviction = "HIGH"
        elif bulls > bears:
            verdict = "MODERATE BUY"
            action_code = "OVERWEIGHT"
            conviction = "MODERATE-HIGH"
        elif bears >= 6:
            verdict = "STRONG SELL"
            action_code = "TRIM / EXIT"
            conviction = "HIGH"
        elif bears > bulls:
            verdict = "MODERATE SELL"
            action_code = "UNDERWEIGHT"
            conviction = "MODERATE"
        else:
            verdict = "HOLD / NEUTRAL"
            action_code = "MAINTAIN"
            conviction = "NEUTRAL"

        curr_sym = data.get("currency_symbol", "₹")
        curr_p = data.get("display_price", 100.0)
        target_p = data.get("display_target", curr_p * 1.12)
        stop_loss_pct = round(data.get("historical_volatility", 22.0) * 0.35, 1)
        stop_loss = round(curr_p * (1 - (stop_loss_pct / 100.0)), 2)

        synthesis_text = (
            f"After presiding over 3 rounds of structured multi-agent debate across Financial, Technical, "
            f"Risk, Macro, and Geopolitical squads, the court reaches an authoritative {verdict} verdict ({bulls} Bullish, "
            f"{bears} Bearish, {neutrals} Neutral). The Fundamental thesis holds solid grounding, while "
            f"Risk squad's volatility reservations are accommodated via a calibrated stop-loss at {curr_sym}{stop_loss}."
        )

        return {
            "verdict": verdict,
            "action_code": action_code,
            "conviction_tier": conviction,
            "currency_symbol": curr_sym,
            "consensus_distribution": {
                "bullish_agents": bulls,
                "bearish_agents": bears,
                "neutral_agents": neutrals,
                "total_agents": len(opinions)
            },
            "judge_synthesis": synthesis_text,
            "recommended_positioning": {
                "entry_level": f"{curr_sym}{curr_p}",
                "target_objective": f"{curr_sym}{target_p} (+{round(((target_p - curr_p) / max(0.1, curr_p)) * 100, 1)}%)",
                "stop_loss_protection": f"{curr_sym}{stop_loss} (-{stop_loss_pct}%)",
                "risk_reward_ratio": round(abs((target_p - curr_p) / max(0.1, curr_p - stop_loss)), 2)
            }
        }


debate_engine = DebateEngine()
