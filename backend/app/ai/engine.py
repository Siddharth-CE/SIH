from app.core.config import settings
from app.ai.base import AIProvider
from app.ai.rule_based import RuleBasedAIProvider


def get_ai_provider() -> AIProvider:
    if settings.AI_PROVIDER == "rule_based":
        return RuleBasedAIProvider()
    return RuleBasedAIProvider()


ai_engine = get_ai_provider()
