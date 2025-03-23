from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro-002")

# ✅ Updated model to match flat frontend payload
class PreferencePayload(BaseModel):
    purpose: str
    deployment_type: str
    priority_factors: List[str]
    report_type: str

def fetch_candidate_products(prefs):
    query = f"{prefs.purpose} tools {prefs.report_type} {prefs.deployment_type}"
    url = f"https://html.duckduckgo.com/html/?q={query.replace(' ', '+')}"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")
    results = soup.find_all("a", class_="result__a", limit=5)
    return [r.get_text() for r in results] or ["No results found"]

def create_prompt(prefs, products):
    return f"""
You're an AI Product Analyst.

User Preferences:
- Goal: {prefs.purpose}
- Priority Factors: {", ".join(prefs.priority_factors)}
- Deployment: {prefs.deployment_type}
- Report Type: {prefs.report_type}

Candidate Products:
{chr(10).join(products)}

Generate a {prefs.report_type} report comparing:
1. Stability
2. Scalability
3. Security
4. Technical Dependencies
5. Public Opinion
6. Cost
7. Long-term Benefits

Conclude with the best recommendation.
"""

@app.post("/generate-report")
async def generate_report(prefs: PreferencePayload):
    products = fetch_candidate_products(prefs)
    prompt = create_prompt(prefs, products)
    print("--- PROMPT SENT TO GEMINI ---")
    print(prompt)
    response = model.generate_content(prompt)
    return {
        "report": response.text,
        "products": products,
        "prompt": prompt
    }