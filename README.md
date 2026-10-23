# AI-FIOS: AI Financial Intelligence Operating System
> **A Next-Generation Multi-Agent Platform for Real-Time Market Research, Geopolitical Causal Analysis, and Explainable AI Predictions.**

![AI-FIOS Terminal](https://img.shields.io/badge/Architecture-8--Layer%20Dual%20Engine-10b981?style=for-the-badge)
![Multi-Agent AI](https://img.shields.io/badge/Agents-11%20Specialized%20Domain%20Agents-06b6d4?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Institutional%20Production%20Ready-8b5cf6?style=for-the-badge)

---

## 🏛️ Executive Summary

Modern financial decision-making requires synthesizing streaming prices, financial statements, technical indicators, geopolitical conflicts, central bank policies, macroeconomic data, news flow, social sentiment, and historical crises. Existing platforms display these datasets in silos, forcing human analysts to manually connect the dots. General-purpose LLMs generate text without continuous real-time data, evidence-backed grounding, or causal reasoning.

**AI-FIOS** closes this gap. It is an open, institutional-grade Financial Intelligence Operating System combining:
1. **Real-time multi-asset market data** (US & Indian equities, global commodities, crypto, forex, yields).
2. **11 specialized domain AI agents** collaborating in multi-round cross-examination debates.
3. **Causal Knowledge Graph** mapping world events into corporate gross margin impacts.
4. **Historical Analog Engine** matching current macro regimes against 6 historical crises (2008 GFC, COVID 2020, 1973 Oil Shock, 2022 Ukraine Inflation, etc.).
5. **Interactive Scenario Simulation ("What-If") Studio** calculating instant re-pricing from macro shocks.
6. **Explainable AI (XAI) Attribution Engine** providing SHAP-style feature importance ("Why" the call was made, not just Buy/Sell).
7. **Autonomous Research Agent** generating institutional memos (Step 10 of the workflow).
8. **Bloomberg-grade Interactive Terminal** with TradingView-style candlestick charts and live ticker tape.

---

## 🏗️ 8-Layer Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ L8: Interactive Financial Terminal (Bloomberg/FactSet-Grade UI)        │
├────────────────────────────────────────────────────────────────────────┤
│ L7: Visualization Dashboard (TradingView Candlesticks, Causal Canvas)  │
├────────────────────────────────────────────────────────────────────────┤
│ L6: Explainable Prediction Engine (SHAP Attribution & Historical Match)│
├────────────────────────────────────────────────────────────────────────┤
│ L5: Reasoning & Debate Engine (Multi-Round Inter-Agent Debate & Judge) │
├────────────────────────────────────────────────────────────────────────┤
│ L4: Multi-Agent Intelligence Layer (11 Domain Specialized Agents)      │
├────────────────────────────────────────────────────────────────────────┤
│ L3: Knowledge Graph + Vector DB (Entity Links & Causal Transmissions)  │
├────────────────────────────────────────────────────────────────────────┤
│ L2: Data Processing Pipeline (Feature Eng, SMA/BB/RSI/MACD Indicators) │
├────────────────────────────────────────────────────────────────────────┤
│ L1: Real-Time Data Acquisition (Live Market Streams US/IN/FX/Crypto)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The 11-Agent Intelligence Committee

| Squad | Agent | Primary Role | Avatar |
| :--- | :--- | :--- | :---: |
| **Market & Technical** | **Financial Analysis Agent** | Fundamentals, P/E multiples, FCF yield, debt solvency | 📊 |
| | **Technical Analysis Agent** | RSI(14), MACD confluence, Bollinger Bands, trend channels | 📈 |
| | **Risk Assessment Agent** | Value at Risk (95% VaR), beta sensitivity, tail-risk warning | 🛡️ |
| **Macro & Geopolitical** | **Macroeconomic Agent** | Fed/RBI rates, CPI inflation trajectory, yield curve | 🌐 |
| | **Geopolitical Intelligence Agent** | Conflict hotspots, sanctions, shipping routes, energy shocks | 🗺️ |
| | **Portfolio Optimization Agent** | Mean-variance allocation, sector concentration, Sharpe ratio | ⚖️ |
| **Information Intelligence** | **News Analysis Agent** | Earnings transcripts, SEC/SEBI filings, breaking catalysts | 📰 |
| | **Sentiment Analysis Agent** | Market mood (Bullish, Bearish, Fear, Greed, Optimism) | 🎭 |
| | **Fact Verification Agent** | Cross-checking corporate claims, discounting rumors | 🔍 |
| **Prediction & Research** | **Prediction Agent** | Quantitative probability forecasting & price targets | 🔮 |
| | **Autonomous Research Agent** | Step 10: Institutional briefing memos & morning notes | 📑 |
| **Synthesis Authority** | **Judge Agent** | Presides over multi-agent debate, issues final verdict & stop-loss | ⚖️ |

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (optional, frontend is already built into `frontend/dist`)

### Option A: 1-Click Launch (Recommended)
Simply double-click:
```cmd
run.bat
```
*(or run `./run.ps1` in PowerShell)*

This starts the unified FastAPI server and automatically opens your browser to:
**`http://127.0.0.1:8000`**

### Option B: Manual Launch
1. **Start Backend Server:**
   ```bash
   cd backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Access Terminal UI:**
   Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

3. *(Optional) Frontend Development Hot-Reload:*
   ```bash
   cd frontend
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

---

## 🌐 Core Terminal Modules

1. **Terminal Overview (`/terminal`):**
   - High-definition candlestick & area charts with timeframe toggles (1D, 5D, 1M, 6M, 1Y).
   - Technical overlays: SMA 20, SMA 50, Bollinger Bands, Volume.
   - Oscillator sub-panels: 14-period RSI and MACD histogram.
   - Real-time ticker tape covering US Mega-caps, Indian Bluechips, Gold, WTI Crude Oil, US 10-Yr Yield, USD/INR, and Bitcoin.
2. **Agent Debate Arena (`/debate`):**
   - Live multi-round cross-examination between the 11 agents.
   - Interactive transcript detailing thesis formulation, devil's advocate risk challenges, and fact verification.
   - Authoritative Judge Agent synthesis with conviction rating, target objective, stop-loss, and risk/reward ratio.
3. **Causal Knowledge Graph (`/graph`):**
   - Interactive force-directed canvas.
   - Trace geopolitical shocks (e.g. *Middle East Conflict ➔ Crude Oil ➔ Jet Fuel Costs ➔ Airline Operating Margins*).
4. **Trust & Explainability Panel (`/explainability`):**
   - Trust confidence dial (0-100%).
   - SHAP-style feature attribution waterfall.
   - Side-by-side supporting vs contradicting evidence cards.
5. **Historical Analog Matcher (`/analogs`):**
   - Dynamic similarity scoring against COVID 2020, 2008 GFC, 1973 Oil Shock, 2000 Dot-com crash, 2022 Ukraine rate shock, and 1997 Asian crisis.
   - Historic drawdown and recovery curve overlay.
6. **Scenario Simulation Studio (`/scenario`):**
   - Interactive sliders for crude oil ($50-$150), Fed rates (-150 to +200 bps), inflation (1.5-9%), and tariffs (0-50%).
   - Instant re-pricing matrix across equities and commodities.
7. **Portfolio Risk & Stress Tester (`/portfolio`):**
   - Multi-asset mark-to-market valuation, sector weights, daily 95% Value at Risk (VaR), and dynamic hedging recommendations.
8. **Autonomous Research Memos (`/report`):**
   - Proactive institutional research briefing memos with 1-click Markdown copy and printable executive layout.

---

## 🔮 Suggested Enhancements for Future Exploration
1. **Local Fine-Tuned Financial SLMs:** Connect local quantized models like `Fin-R1` or `FinGPT` using Ollama or vLLM for zero-latency offline generation.
2. **Graph Neural Networks (GNNs):** Run link-prediction algorithms over the Neo4j/NetworkX graph to discover non-obvious second-order supplier vulnerabilities.
3. **Automated Trade Execution Sandbox:** Integrate paper trading via Alpaca / Zerodha Kite Connect APIs to test autonomous agent strategy execution.
4. **Voice Briefings:** Text-to-speech institutional morning briefings for analysts on the go.
