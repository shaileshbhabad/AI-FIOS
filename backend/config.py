"""
AI-FIOS Configuration & Expansive Multi-Asset Universe
Includes Nifty 50 Leaders, US Tech Giants, Global Commodities, Crypto, and Forex
All calibrated with dual currency support (INR ₹ default, USD $).
"""

# Default Exchange Rate fallback (USD to INR)
DEFAULT_USD_INR = 84.50

WATCHLIST = [
    # ==========================================
    # 🇮🇳 INDIAN EQUITIES (NSE / BSE BLUECHIPS)
    # ==========================================
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "category": "Indian Equities", "sector": "Energy & Telecom", "currency": "INR", "country": "IN"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "category": "Indian Equities", "sector": "IT Services", "currency": "INR", "country": "IN"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Ltd", "category": "Indian Equities", "sector": "Banking & Finance", "currency": "INR", "country": "IN"},
    {"symbol": "INFY.NS", "name": "Infosys Ltd", "category": "Indian Equities", "sector": "IT Services", "currency": "INR", "country": "IN"},
    {"symbol": "ICICIBANK.NS", "name": "ICICI Bank Ltd", "category": "Indian Equities", "sector": "Banking & Finance", "currency": "INR", "country": "IN"},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "category": "Indian Equities", "sector": "Public Sector Banking", "currency": "INR", "country": "IN"},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel Ltd", "category": "Indian Equities", "sector": "Telecommunications", "currency": "INR", "country": "IN"},
    {"symbol": "ITC.NS", "name": "ITC Limited", "category": "Indian Equities", "sector": "Consumer Goods (FMCG)", "currency": "INR", "country": "IN"},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "category": "Indian Equities", "sector": "Engineering & Infra", "currency": "INR", "country": "IN"},
    {"symbol": "AXISBANK.NS", "name": "Axis Bank Ltd", "category": "Indian Equities", "sector": "Banking & Finance", "currency": "INR", "country": "IN"},
    {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "category": "Indian Equities", "sector": "Banking & Finance", "currency": "INR", "country": "IN"},
    {"symbol": "MARUTI.NS", "name": "Maruti Suzuki India", "category": "Indian Equities", "sector": "Automotive", "currency": "INR", "country": "IN"},
    {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "category": "Indian Equities", "sector": "Pharmaceuticals", "currency": "INR", "country": "IN"},
    {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance Ltd", "category": "Indian Equities", "sector": "Non-Banking Finance (NBFC)", "currency": "INR", "country": "IN"},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "category": "Indian Equities", "sector": "Consumer Goods (FMCG)", "currency": "INR", "country": "IN"},
    {"symbol": "ADANIENT.NS", "name": "Adani Enterprises", "category": "Indian Equities", "sector": "Conglomerate & Mining", "currency": "INR", "country": "IN"},
    {"symbol": "ADANIPORTS.NS", "name": "Adani Ports & SEZ", "category": "Indian Equities", "sector": "Ports & Logistics", "currency": "INR", "country": "IN"},
    {"symbol": "TATASTEEL.NS", "name": "Tata Steel Ltd", "category": "Indian Equities", "sector": "Metals & Mining", "currency": "INR", "country": "IN"},
    {"symbol": "M&M.NS", "name": "Mahindra & Mahindra", "category": "Indian Equities", "sector": "Automotive & Farm", "currency": "INR", "country": "IN"},
    {"symbol": "NTPC.NS", "name": "NTPC Limited", "category": "Indian Equities", "sector": "Power & Renewable", "currency": "INR", "country": "IN"},
    {"symbol": "TITAN.NS", "name": "Titan Company Ltd", "category": "Indian Equities", "sector": "Consumer Discretionary", "currency": "INR", "country": "IN"},
    {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "category": "Indian Equities", "sector": "IT Services", "currency": "INR", "country": "IN"},
    {"symbol": "ASIANPAINT.NS", "name": "Asian Paints Ltd", "category": "Indian Equities", "sector": "Paints & Chemicals", "currency": "INR", "country": "IN"},
    {"symbol": "JIOFIN.NS", "name": "Jio Financial Services", "category": "Indian Equities", "sector": "Fintech & Services", "currency": "INR", "country": "IN"},
    {"symbol": "^NSEI", "name": "NIFTY 50 Index", "category": "Indian Equities", "sector": "Benchmark Index", "currency": "INR", "country": "IN"},
    {"symbol": "^BSESN", "name": "BSE SENSEX Index", "category": "Indian Equities", "sector": "Benchmark Index", "currency": "INR", "country": "IN"},

    # ==========================================
    # 🇺🇸 US MEGA-CAPS & TECH GIANTS
    # ==========================================
    {"symbol": "NVDA", "name": "NVIDIA Corporation", "category": "US Equities", "sector": "Semiconductors & AI", "currency": "USD", "country": "US"},
    {"symbol": "AAPL", "name": "Apple Inc.", "category": "US Equities", "sector": "Consumer Electronics", "currency": "USD", "country": "US"},
    {"symbol": "MSFT", "name": "Microsoft Corp.", "category": "US Equities", "sector": "Software & Cloud", "currency": "USD", "country": "US"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "category": "US Equities", "sector": "Automotive / EV", "currency": "USD", "country": "US"},
    {"symbol": "GOOGL", "name": "Alphabet Inc.", "category": "US Equities", "sector": "Internet & AI", "currency": "USD", "country": "US"},
    {"symbol": "AMZN", "name": "Amazon.com Inc.", "category": "US Equities", "sector": "E-Commerce & Cloud", "currency": "USD", "country": "US"},
    {"symbol": "META", "name": "Meta Platforms Inc.", "category": "US Equities", "sector": "Social & AI Hardware", "currency": "USD", "country": "US"},
    {"symbol": "AVGO", "name": "Broadcom Inc.", "category": "US Equities", "sector": "Custom Silicon & Comms", "currency": "USD", "country": "US"},
    {"symbol": "AMD", "name": "Advanced Micro Devices", "category": "US Equities", "sector": "Semiconductors", "currency": "USD", "country": "US"},

    # ==========================================
    # 🌐 GLOBAL COMMODITIES, FOREX & MACRO
    # ==========================================
    {"symbol": "CL=F", "name": "Crude Oil (WTI)", "category": "Commodities", "sector": "Energy", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "BZ=F", "name": "Brent Crude Oil", "category": "Commodities", "sector": "Energy", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "GC=F", "name": "Gold Futures", "category": "Commodities", "sector": "Precious Metals", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "SI=F", "name": "Silver Futures", "category": "Commodities", "sector": "Precious Metals", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "NG=F", "name": "Natural Gas", "category": "Commodities", "sector": "Energy", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "^TNX", "name": "US 10-Yr Treasury Yield", "category": "Bonds / Macro", "sector": "Fixed Income", "currency": "%", "country": "US"},
    {"symbol": "INR=X", "name": "USD / INR Exchange Rate", "category": "Currencies", "sector": "Forex", "currency": "INR", "country": "GLOBAL"},
    {"symbol": "BTC-USD", "name": "Bitcoin (USD)", "category": "Digital Assets", "sector": "Crypto", "currency": "USD", "country": "GLOBAL"},
    {"symbol": "ETH-USD", "name": "Ethereum (USD)", "category": "Digital Assets", "sector": "Crypto", "currency": "USD", "country": "GLOBAL"}
]

# Agent Squads Definition according to AI-FIOS Architecture
AGENT_ROSTER = {
    "market_technical": [
        {"id": "financial_analysis", "name": "Financial Analysis Agent", "role": "Fundamentals, Ratios & Earnings", "avatar": "📊", "weight": 0.20},
        {"id": "technical_analysis", "name": "Technical Analysis Agent", "role": "Price Action, Indicators & Momentum", "avatar": "📈", "weight": 0.20},
        {"id": "risk_assessment", "name": "Risk Assessment Agent", "role": "Volatility, VaR & Tail-Risk Warnings", "avatar": "🛡️", "weight": 0.15}
    ],
    "macro_geopolitical": [
        {"id": "macroeconomic", "name": "Macroeconomic Agent", "role": "Rates, Inflation, Yield Curve & Central Banks", "avatar": "🌐", "weight": 0.15},
        {"id": "geopolitical", "name": "Geopolitical Intelligence Agent", "role": "Wars, Sanctions, Trade Routes & Energy Shocks", "avatar": "🗺️", "weight": 0.15},
        {"id": "portfolio_optimization", "name": "Portfolio Optimization Agent", "role": "Asset Allocation, Hedging & Diversification", "avatar": "⚖️", "weight": 0.10}
    ],
    "information": [
        {"id": "news_intelligence", "name": "News Analysis Agent", "role": "Breaking Headlines, Catalysts & Filings", "avatar": "📰", "weight": 0.10},
        {"id": "sentiment_analysis", "name": "Sentiment Analysis Agent", "role": "Multi-Source Sentiment & Mood Index", "avatar": "🎭", "weight": 0.10},
        {"id": "fact_verification", "name": "Fact Verification Agent", "role": "Cross-Checking & Rumor Filtering", "avatar": "🔍", "weight": 0.10}
    ],
    "prediction_research": [
        {"id": "prediction", "name": "Prediction Agent", "role": "Quantitative Probabilistic Forecasting", "avatar": "🔮", "weight": 0.25},
        {"id": "autonomous_research", "name": "Autonomous Research Agent", "role": "Institutional Synthesis & Report Authoring", "avatar": "📑", "weight": 0.15},
        {"id": "judge", "name": "Judge Agent", "role": "Consensus Deliberation & Final Verdict", "avatar": "⚖️", "weight": 0.30}
    ]
}

HISTORICAL_CRISES = [
    {
        "id": "covid_2020",
        "name": "COVID-19 Flash Crash (2020)",
        "period": "Feb 2020 - Apr 2020",
        "max_drawdown": -34.0,
        "recovery_months": 5,
        "volatility_vix": 82.7,
        "key_drivers": ["Pandemic lockdowns", "Global supply chain paralysis", "Emergency Fed liquidity zero-rate bazooka"],
        "analog_triggers": ["Pandemic", "Supply chain", "Emergency stimulus", "High volatility"]
    },
    {
        "id": "gfc_2008",
        "name": "Great Financial Crisis (2008)",
        "period": "Oct 2007 - Mar 2009",
        "max_drawdown": -56.8,
        "recovery_months": 49,
        "volatility_vix": 80.86,
        "key_drivers": ["Subprime mortgage crisis", "Lehman Brothers collapse", "Credit market freeze", "Systemic bank insolvency"],
        "analog_triggers": ["Credit squeeze", "Banking crisis", "Deleveraging", "Liquidity freeze"]
    },
    {
        "id": "inflation_ukraine_2022",
        "name": "Post-Ukraine Energy & Rate Shock (2022)",
        "period": "Jan 2022 - Oct 2022",
        "max_drawdown": -25.4,
        "recovery_months": 18,
        "volatility_vix": 38.9,
        "key_drivers": ["Russia-Ukraine war", "Crude oil spiked to $130", "Global 40-year high inflation", "Aggressive Fed 75bps rate hikes"],
        "analog_triggers": ["Energy shock", "Rate hikes", "War in Europe", "Supply squeeze", "Inflation"]
    },
    {
        "id": "dotcom_2000",
        "name": "Dot-Com Tech Bubble Burst (2000)",
        "period": "Mar 2000 - Oct 2002",
        "max_drawdown": -49.1,
        "recovery_months": 84,
        "volatility_vix": 45.1,
        "key_drivers": ["Tech valuation bubble collapse", "Unprofitable internet companies", "Fed tightening", "Accounting scandals"],
        "analog_triggers": ["Extreme valuations", "Tech bubble", "Unprofitable growth", "Overheating"]
    },
    {
        "id": "oil_shock_1973",
        "name": "OPEC Oil Embargo & Stagflation (1973)",
        "period": "Oct 1973 - Dec 1974",
        "max_drawdown": -48.2,
        "recovery_months": 69,
        "volatility_vix": 48.0,
        "key_drivers": ["Yom Kippur War", "OPEC oil export embargo quadrupled oil", "Double-digit stagflation", "Price controls"],
        "analog_triggers": ["Middle East war", "Oil embargo", "Stagflation", "Supply disruption"]
    },
    {
        "id": "asian_crisis_1997",
        "name": "Asian Financial Contagion (1997)",
        "period": "Jul 1997 - Dec 1998",
        "max_drawdown": -30.0,
        "recovery_months": 24,
        "volatility_vix": 44.0,
        "key_drivers": ["Thai Baht peg collapse", "Sovereign debt currency flight", "IMF bailouts", "Russian debt default / LTCM collapse"],
        "analog_triggers": ["Currency depreciation", "Emerging market debt", "Capital flight"]
    }
]
