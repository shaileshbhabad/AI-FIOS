# AI-FIOS Startup Script for PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " AI-FIOS: AI FINANCIAL INTELLIGENCE OPERATING SYSTEM (v2.0 PRO)" -ForegroundColor Green
Write-Host " 8-Layer Architecture - 11 Domain Agents - Causal Knowledge Graph" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan

Write-Host "`nLaunching Unified Server on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:8000"

Set-Location -Path "$PSScriptRoot\backend"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
