from app.utils.normalization import clamp


def interpret_score(score: float) -> str:
    if score >= 78:
        return "oportunidade forte para testar agora"
    if score >= 62:
        return "boa oportunidade com validacao controlada"
    if score >= 45:
        return "oportunidade mediana; exige teste cuidadoso"
    return "oportunidade fraca para este perfil"


def safe_percent(value: float) -> float:
    return round(clamp(value, 0, 100), 2)
