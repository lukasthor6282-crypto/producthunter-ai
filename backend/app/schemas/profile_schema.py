from pydantic import BaseModel, Field, field_validator

from app.utils.constants import (
    GOAL_ALIASES,
    GOALS,
    EXPERIENCE_LEVELS,
    INVESTMENT_RANGES,
    MARKETPLACE_ALIASES,
    MARKETPLACES,
    NICHE_ALIASES,
    NICHES,
    OPERATION_ALIASES,
    OPERATION_TYPES,
    PROFILE_DEFAULTS,
    TRAFFIC_TYPES,
)
from app.utils.normalization import normalize_alias

VALID_OPERATIONS = {item["value"] for item in OPERATION_TYPES}
VALID_MARKETPLACES = {item["value"] for item in MARKETPLACES}
VALID_NICHES = {item["value"] for item in NICHES}
VALID_GOALS = {item["value"] for item in GOALS}
VALID_INVESTMENTS = {item["value"] for item in INVESTMENT_RANGES}
VALID_EXPERIENCE = {item["value"] for item in EXPERIENCE_LEVELS}
VALID_TRAFFIC = {item["value"] for item in TRAFFIC_TYPES}


class UserProfile(BaseModel):
    operation_type: str = Field(default=PROFILE_DEFAULTS["operation_type"], description="Tipo de operacao do usuario.")
    marketplace: str = Field(default=PROFILE_DEFAULTS["marketplace"], description="Marketplace preferido.")
    niche: str = Field(default=PROFILE_DEFAULTS["niche"], description="Nicho principal.")
    goal: str = Field(default=PROFILE_DEFAULTS["goal"], description="Objetivo comercial mais importante.")
    investment_range: str = Field(default=PROFILE_DEFAULTS["investment_range"], description="Faixa de investimento.")
    experience_level: str = Field(default=PROFILE_DEFAULTS["experience_level"], description="Nivel de experiencia.")
    traffic_type: str = Field(default=PROFILE_DEFAULTS["traffic_type"], description="Origem principal do trafego.")

    @field_validator("operation_type", mode="before")
    @classmethod
    def normalize_operation(cls, value: str) -> str:
        normalized = normalize_alias(str(value), OPERATION_ALIASES)
        if normalized not in VALID_OPERATIONS:
            raise ValueError(f"operation_type invalido: {value}")
        return normalized

    @field_validator("marketplace", mode="before")
    @classmethod
    def normalize_marketplace(cls, value: str) -> str:
        normalized = normalize_alias(str(value), MARKETPLACE_ALIASES)
        if normalized not in VALID_MARKETPLACES:
            raise ValueError(f"marketplace invalido: {value}")
        return normalized

    @field_validator("niche", mode="before")
    @classmethod
    def normalize_niche(cls, value: str) -> str:
        normalized = normalize_alias(str(value), NICHE_ALIASES)
        if normalized not in VALID_NICHES:
            raise ValueError(f"niche invalido: {value}")
        return normalized

    @field_validator("goal", mode="before")
    @classmethod
    def normalize_goal(cls, value: str) -> str:
        normalized = normalize_alias(str(value), GOAL_ALIASES)
        if normalized not in VALID_GOALS:
            raise ValueError(f"goal invalido: {value}")
        return normalized

    @field_validator("investment_range")
    @classmethod
    def validate_investment(cls, value: str) -> str:
        if value not in VALID_INVESTMENTS:
            raise ValueError(f"investment_range invalido: {value}")
        return value

    @field_validator("experience_level")
    @classmethod
    def validate_experience(cls, value: str) -> str:
        if value not in VALID_EXPERIENCE:
            raise ValueError(f"experience_level invalido: {value}")
        return value

    @field_validator("traffic_type")
    @classmethod
    def validate_traffic(cls, value: str) -> str:
        if value not in VALID_TRAFFIC:
            raise ValueError(f"traffic_type invalido: {value}")
        return value
