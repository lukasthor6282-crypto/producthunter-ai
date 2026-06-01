from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import (
    routes_auth,
    routes_analytics,
    routes_ml,
    routes_products,
    routes_profit,
    routes_recommendations,
)
from app.core.config import get_settings
from app.db import init_db
from app.utils.constants import (
    EXPERIENCE_LEVELS,
    GOALS,
    INVESTMENT_RANGES,
    MARKETPLACES,
    NICHES,
    OPERATION_TYPES,
    TRAFFIC_TYPES,
)

app = FastAPI(
    title="ProductHunter AI API",
    version="0.1.0",
    description="MVP de recomendacao de produtos para vendedores e afiliados.",
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.exception_handler(RequestValidationError)
def validation_exception_handler(_, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for error in exc.errors():
        clean_error = dict(error)
        if "ctx" in clean_error:
            clean_error["ctx"] = {
                key: str(value) for key, value in clean_error["ctx"].items()
            }
        errors.append(clean_error)

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Dados invalidos na requisicao.",
            "errors": errors,
            "hint": "Verifique operation_type, marketplace, niche, goal, investment_range, experience_level e traffic_type.",
        },
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ProductHunter AI API"}


@app.get("/metadata/options")
def metadata_options() -> dict:
    return {
        "operation_types": OPERATION_TYPES,
        "marketplaces": MARKETPLACES,
        "niches": NICHES,
        "goals": GOALS,
        "investment_ranges": INVESTMENT_RANGES,
        "experience_levels": EXPERIENCE_LEVELS,
        "traffic_types": TRAFFIC_TYPES,
    }


app.include_router(routes_auth.router)
app.include_router(routes_products.router)
app.include_router(routes_recommendations.router)
app.include_router(routes_profit.router)
app.include_router(routes_ml.router)
app.include_router(routes_analytics.router)
