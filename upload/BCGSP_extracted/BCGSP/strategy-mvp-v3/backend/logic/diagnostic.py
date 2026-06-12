"""Very simple rule-based diagnostic engine (MVP).
In later phases, replace with weighted rubric + ML/LLM.
"""

def analyze_strategy(data):
    score = 60
    key_failures = []
    bottlenecks = []

    bm = (data.get("business_model") or "").lower()
    mk = (data.get("market_position") or "").lower()
    ops = (data.get("operations") or "").lower()
    fin = (data.get("finance") or "").lower()

    # Business model clarity
    if any(k in bm for k in ["نامشخص", "مبهم", "unclear", "undefined"]):
        score -= 15
        key_failures.append("مدل کسبوکار نامشخص/مبهم است")

    # Market understanding
    if any(k in mk for k in ["رقیب نداریم", "no competitors", "بدون رقیب"]):
        score -= 10
        key_failures.append("تحلیل رقبا/جایگاه بازار کافی نیست")

    # Operations maturity
    if any(k in ops for k in ["دستی", "manual", "اکسل", "excel"]):
        score -= 10
        bottlenecks.append("عملیات/فرایندها بیش از حد دستی هستند")

    # Finance health
    if any(k in fin for k in ["زیان", "loss", "کاهش سود", "low margin", "حاشیه کم"]):
        score -= 20
        bottlenecks.append("سودآوری/واحد اقتصاد (Unit Economics) ضعیف است")

    # Basic guardrails
    score = max(min(score, 100), 0)

    return {
        "score": score,
        "key_failures": key_failures or ["نقطه شکست بحرانی شناسایی نشد"],
        "bottlenecks": bottlenecks or ["گلوگاه رشد بحرانی شناسایی نشد"],
    }
