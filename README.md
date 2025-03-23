# Vendoract

This project is a full-stack AI assistant that helps tech owners and decision-makers **research external/vendor products** based on user preferences. It uses **Gemini LLM** + web search + user-friendly interface to generate comprehensive product reports including:

- 📊 Stability  
- ⚖️ Scalability  
- 🔐 Security  
- 🧱 Technical Dependencies  
- 🗣 Public Opinion  
- 💰 Cost  
- 🌱 Long-Term Benefits  

Users answer a few simple questions (mostly dropdowns and checkboxes), and the app does the heavy lifting.

---

## 🧰 Tech Stack

| Layer      | Tech                |
|------------|---------------------|
| Frontend   | Next.js (JavaScript) + Tailwind CSS |
| Backend    | FastAPI (Python)    |
| LLM Agent  | Google Gemini API (via `google-generativeai`) |
| Web Search | DuckDuckGo Scraping with BeautifulSoup |
| Deployment | Docker + Docker Compose |

---

## 🚀 Features

- 🤖 Uses Gemini LLM for content generation
- 🔎 Scrapes top search results using DuckDuckGo (TrustPilot, G2, Docs)
- 📄 Generates individual or comparison reports
- 🧠 Minimal user input (step-by-step questions)
- 🖨 Download report via **Print as PDF**
- 🌐 CORS-ready backend for cross-origin requests
- 🐳 Fully Dockerized

---


## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js (18+)
- Docker & Docker Compose
- Python 3.10+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

---

### 🔑 Step 1: Set Gemini API Key

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your Gemini key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 🐳 Step 2: Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:8000

---

### 🧪 Step 3: Try It Out

1. Open [http://localhost:3000](http://localhost:3000)
2. Choose your preferences step-by-step
3. Click **Generate Report**
4. Click **Download as PDF** to save it

---

## 🧪 Example Report Factors

- ⚡️ Stability
- 🧱 Technical Dependencies
- 🔐 Security
- 🧠 Public Opinion
- 💸 Cost
- ♻️ Long-Term Benefits

---

## 🧑‍💻 Development Tips

### Rebuild Just Backend
```bash
docker-compose build backend
docker-compose up backend
```

### Rebuild Just Frontend
```bash
docker-compose build frontend
docker-compose up frontend
```

---

## 🧾 Environment Variables

| Variable         | Description                   |
|------------------|-------------------------------|
| `GEMINI_API_KEY` | Google Gemini LLM API Key     |
| `NEXT_PUBLIC_API_URL` | Frontend access to backend (`http://localhost:8000`) |

---

## 📜 License

MIT License.  
Free to use, modify, and build upon.

---

## 🙌 Acknowledgments

- Google Gemini API
- DuckDuckGo HTML Search
- FastAPI & Next.js
- Tailwind CSS
