"""
AI-FIOS Base Agent Interface
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseFinancialAgent(ABC):
    def __init__(self, agent_id: str, name: str, squad: str, avatar: str, weight: float = 1.0):
        self.agent_id = agent_id
        self.name = name
        self.squad = squad
        self.avatar = avatar
        self.weight = weight

    @abstractmethod
    def analyze(self, symbol: str, market_data: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Executes domain-specific analysis on the target asset.
        Returns stance, confidence, key metric, claim, and detailed reasoning.
        """
        pass
