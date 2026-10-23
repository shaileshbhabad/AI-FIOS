"""
AI-FIOS Backend Core Application (v2.0 PRO Flagship Edition)
FastAPI Server with WebSockets, Real-time Market Feeds (INR ₹ & USD), Causal Knowledge Graph,
Interactive Shock Simulator, Hybrid LLM Engine, Multi-Agent Debate, and Explainable AI.
"""

import asyncio
import json
import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from config import WATCHLIST, AGENT_ROSTER
from services.market_data import market_service
from services.knowledge_graph import knowledge_graph_service
from services.historical_analogs import historical_analog_engine
from services.scenario_simulator import scenario_simulator
from services.explainability import explainability_engine
from services.portfolio_engine import portfolio_engine
from services.hybrid_llm import hybrid_llm_engine
from agents.debate_engine import debate_engine
from agents.autonomous_research import autonomous_research_agent


app = FastAPI(
    title="AI-FIOS API",
    description="AI Financial Intelligence Operating System - Institutional Multi-Agent Research Platform",
    version="2.0.0"
)

# Enable CORS for local and web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Request Models
class ScenarioRequest(BaseModel):
    oil_price: float = 78.0
    rate_shift_bps: int = 0
    inflation_rate: float = 3.0
    geo_tension: float = 5.0
    tariff_rate: float = 10.0


class ShockSimRequest(BaseModel):
    node_id: str
    intensity: float = 1.0


class LLMConfigRequest(BaseModel):
    provider: str
    api_key: str
    model: Optional[str] = None


class PortfolioHolding(BaseModel):
    symbol: str
    shares: float
    cost_basis: float


class PortfolioRequest(BaseModel):
    holdings: List[PortfolioHolding]
    currency: str = "INR"


# REST Endpoints

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "AI-FIOS",
        "version": "2.0.0",
        "currency_base": "INR",
        "architecture_layers": 8,
        "agents_active": 11,
        "total_assets_tracked": len(WATCHLIST),
        "hybrid_llm": hybrid_llm_engine.get_status()
    }


@app.get("/api/watchlist")
def get_watchlist(
    category: Optional[str] = Query(None),
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Returns the full tracked universe (40+ assets) with prices in INR ₹ (or USD)."""
    return market_service.get_watchlist(category=category, currency=currency)


@app.get("/api/asset/{symbol}/summary")
def get_asset_summary(
    symbol: str,
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Returns detailed real-time market data, indicators, and metrics in chosen currency."""
    return market_service.get_asset_summary(symbol, currency=currency)


@app.get("/api/asset/{symbol}/candles")
def get_asset_candles(
    symbol: str,
    timeframe: str = Query("1M", pattern="^(1D|5D|1M|6M|1Y)$"),
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Returns candlestick data with technical indicator overlays."""
    return market_service.get_historical_candles(symbol, timeframe, currency=currency)


@app.get("/api/asset/{symbol}/orderbook")
def get_order_book(
    symbol: str,
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Level-2 order book depth formatted in ₹ INR or $ USD."""
    return market_service.get_order_book_depth(symbol, currency=currency)


@app.get("/api/asset/{symbol}/debate")
def get_agent_debate(
    symbol: str,
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Executes multi-agent cross-verification, debate, and judge verdict."""
    return debate_engine.run_full_debate(symbol, currency=currency)


@app.get("/api/asset/{symbol}/explainability")
def get_explainability(
    symbol: str,
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Returns feature attribution and evidence cards for transparency."""
    debate = debate_engine.run_full_debate(symbol, currency=currency)
    return debate["explainability"]


@app.get("/api/asset/{symbol}/report")
def get_autonomous_research_report(
    symbol: str,
    currency: str = Query("INR", pattern="^(INR|USD)$")
):
    """Autonomous institutional research briefing generator formatted in ₹ INR."""
    return autonomous_research_agent.generate_institutional_report(symbol, currency=currency)


@app.get("/api/knowledge-graph")
def get_knowledge_graph():
    """Returns all entities, causal links, and impact weights for graph rendering."""
    return knowledge_graph_service.get_full_graph()


@app.post("/api/knowledge-graph/simulate-shock")
def simulate_causal_shock(req: ShockSimRequest):
    """Interactive Causal Shock Simulator: Propagates disruption from any node."""
    return knowledge_graph_service.simulate_node_shock(req.node_id, req.intensity)


@app.get("/api/knowledge-graph/asset/{symbol}")
def get_asset_causal_neighborhood(symbol: str):
    """Returns direct upstream causal events and drivers impacting a specific asset."""
    return knowledge_graph_service.get_asset_causal_neighborhood(symbol)


@app.get("/api/historical-analogs")
def get_historical_analogs(
    vix: float = 22.5,
    pe: float = 27.0,
    rate_regime: str = "restrictive",
    inflation: float = 3.2,
    geo_stress: float = 7.5
):
    """Matches current conditions against COVID 2020, GFC 2008, 1973 Oil Shock, etc."""
    return historical_analog_engine.match_regime(
        current_vix=vix,
        current_pe=pe,
        rate_environment=rate_regime,
        inflation_level=inflation,
        geopolitical_stress=geo_stress
    )


@app.post("/api/scenario-simulator/run")
def run_scenario_simulation(req: ScenarioRequest):
    """Runs what-if macroeconomic shock calculations."""
    return scenario_simulator.simulate(
        oil_price=req.oil_price,
        rate_shift_bps=req.rate_shift_bps,
        inflation_rate=req.inflation_rate,
        geo_tension=req.geo_tension,
        tariff_rate=req.tariff_rate
    )


@app.get("/api/scenario-simulator/presets")
def get_scenario_presets():
    return scenario_simulator.get_presets()


@app.get("/api/portfolio")
def get_default_portfolio(currency: str = Query("INR", pattern="^(INR|USD)$")):
    """Returns risk and allocation breakdown of institutional portfolio in ₹ INR."""
    return portfolio_engine.analyze_portfolio(currency=currency)


@app.post("/api/portfolio/analyze")
def analyze_custom_portfolio(req: PortfolioRequest):
    """Evaluates user-uploaded portfolio positions."""
    holdings = [h.dict() for h in req.holdings]
    return portfolio_engine.analyze_portfolio(holdings, currency=req.currency)


@app.get("/api/settings/llm")
def get_llm_settings():
    """Returns active hybrid LLM provider status."""
    return hybrid_llm_engine.get_status()


@app.post("/api/settings/llm")
def configure_llm(req: LLMConfigRequest):
    """Allows user to enter an API key for Groq, OpenAI, or DeepSeek."""
    return hybrid_llm_engine.set_config(req.provider, req.api_key, req.model)


@app.get("/api/agents")
def get_agent_roster():
    return AGENT_ROSTER


# WebSocket for Live Market & Terminal Updates
@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            snapshot = market_service.get_watchlist(currency="INR")
            await websocket.send_text(json.dumps({
                "type": "TICKER_STREAM",
                "timestamp": asyncio.get_event_loop().time(),
                "data": snapshot[:16]
            }))
            await asyncio.sleep(4)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass


# Static Files Serving for Full-Stack Unified Deployment
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
