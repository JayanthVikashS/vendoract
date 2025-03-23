from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro-002")

# === Updated Payload Classes ===

class PreferencePayload(BaseModel):
    purpose: str
    deployment: str
    factors: List[str]
    industry: str
    organization_size: str
    tech_dependencies: List[str] = []
    budget_model: str
    reliability_needs: str
    disaster_tolerance: str
    drilldown: str = ''

class ReportPayload(PreferencePayload):
    report_type: str
    selected_products: List[str]

class ToolSuggestionRequest(BaseModel):
    purpose: str

# === Prompt Generators ===

def suggestion_prompt(prefs: PreferencePayload):
    return f"""
You're a smart tech recommender.

User's Context:
- Domain: {prefs.purpose}
- Deployment: {prefs.deployment}
- Priority Factors: {", ".join(prefs.factors)}
- Industry: {prefs.industry}
- Organization Size: {prefs.organization_size}
- Budget Model: {prefs.budget_model}
- Reliability Requirement: {prefs.reliability_needs}
- Disaster Tolerance: {prefs.disaster_tolerance}
- Tech Dependencies: {", ".join(prefs.tech_dependencies) if prefs.tech_dependencies else "None"}
- Additional Requirements: {prefs.drilldown or "None"}

Please recommend 3–5 software products or platforms that meet these criteria.

Return ONLY the product names — one per line, no extra text.
"""

def report_prompt(prefs: ReportPayload):
    product_list = "\n".join(f"- {p}" for p in prefs.selected_products)
    report_kind = "comprehensive individual report" if prefs.report_type == "individual" else "technical comparison report"

    return f"""
You are a technical analyst creating a {report_kind}.

Selected Product(s):
{product_list}

User Profile:
- Purpose: {prefs.purpose}
- Deployment: {prefs.deployment}
- Industry: {prefs.industry}
- Organization Size: {prefs.organization_size}
- Priority Factors: {", ".join(prefs.factors)}
- Budget Model: {prefs.budget_model}
- Reliability Requirement: {prefs.reliability_needs}
- Disaster Tolerance: {prefs.disaster_tolerance}
- Tech Dependencies: {prefs.tech_dependencies or "None"}
- Additional Notes: {prefs.drilldown or "None"}

Generate a detailed {report_kind} that covers:
1. Stability
2. Scalability
3. Security
4. Technical Dependencies
5. Public Opinion
6. Cost
7. Long-term Benefits
8. References

Conclude with a recommendation.
"""

# === Endpoints ===

@app.post("/suggest-products")
async def suggest_products(prefs: PreferencePayload):
    prompt = suggestion_prompt(prefs)
    print("--- GEMINI SUGGESTION PROMPT ---")
    print(prompt)
    response = model.generate_content(prompt)
    lines = [line.strip() for line in response.text.splitlines() if line.strip()]
    return {"products": lines or ["No suggestions generated."]}

@app.post("/generate-report")
async def generate_report(prefs: ReportPayload):
    prompt = report_prompt(prefs)
    print("--- GEMINI REPORT PROMPT ---")
    print(prompt)
    response = model.generate_content(prompt)
    return {"report": response.text}

@app.post("/suggest-tech-options")
async def suggest_tech_options(payload: ToolSuggestionRequest):
    prompt = f"""
You're an expert in {payload.purpose} technologies.

List 5 to 10 specific tools, platforms, or libraries that are commonly used in this area.

Return only tool names, one per line.
"""
    response = model.generate_content(prompt)
    tools = [line.strip("-• ").strip() for line in response.text.splitlines() if line.strip()]
    return {"tools": tools}
