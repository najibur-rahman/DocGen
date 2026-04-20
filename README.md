# DocGen AI V2 🚀
### Smart Document Generator — Gemini 2.0 Flash + Supabase

---

## ✨ V2 New Features

| Feature | Description |
|---------|-------------|
| 🎯 JD Analyzer | Job description paste করো → CV automatically tailor হবে |
| 🤖 ATS Score | Resume কতটা ATS-friendly — detailed breakdown |
| ✨ 3 Versions | একই info দিয়ে 3টা different tone-এ version |
| 💡 AI Suggestions | Section-by-section improvement tips |
| 🎨 5 Templates | Classic, Modern, Minimal, Creative, ATS-Clean |
| 🎨 6 Color Themes | Purple, Blue, Green, Red, Dark, Teal |
| 💾 Save History | Google login → documents save হবে |
| 🇧🇩 Bangla | Bengali language support |
| ⚡ Gemini 2.0 Flash | Fast + affordable AI |

---

## 🗂️ Project Structure

```
docgen-v2/
├── src/
│   ├── components/
│   │   ├── Landing/         ← Home page with features
│   │   ├── Wizard/          ← Smart multi-step form
│   │   │   ├── index.jsx    ← Wizard container
│   │   │   └── Steps.jsx    ← All step components (incl. JD Analyzer)
│   │   ├── Output/
│   │   │   ├── index.jsx    ← Output + export + save
│   │   │   ├── ATSChecker.jsx
│   │   │   └── Improvements.jsx
│   │   ├── Dashboard/       ← Saved documents
│   │   └── Templates/       ← Template picker
│   ├── hooks/
│   │   ├── useAI.js         ← Gemini API (generate, multiple, ATS, JD, improve)
│   │   ├── useAuth.js       ← Supabase auth context
│   │   └── useExport.js     ← PDF (with templates), DOCX, TXT
│   ├── lib/
│   │   ├── supabase.js      ← Supabase client + document CRUD
│   │   └── templates.js     ← 5 template definitions + styled HTML
│   ├── prompts/index.js     ← All Gemini prompt builders
│   └── App.jsx
├── api/generate.js          ← Vercel serverless — Gemini API (key secure)
├── chrome-extension/        ← Chrome Extension V2
├── supabase-schema.sql      ← Database schema
└── .env.example
```

---

## 🚀 Deployment — Step by Step

### Step 1: API Keys নাও

**Gemini API Key (Free!):**
1. [aistudio.google.com](https://aistudio.google.com/app/apikey) এ যাও
2. "Create API Key" চাপো
3. Key copy করো

**Supabase:**
1. [supabase.com](https://supabase.com) → New project বানাও
2. Settings → API → `Project URL` ও `anon key` copy করো
3. SQL Editor এ `supabase-schema.sql` এর সব SQL run করো
4. Authentication → Providers → Google enable করো
   - Google Cloud Console এ OAuth credentials বানাতে হবে
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Step 2: Local setup

```bash
cd docgen-v2
npm install

# Environment variables set করো
cp .env.example .env
# .env file এ keys দাও
```

`.env` file:
```
GEMINI_API_KEY=your-gemini-key
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
# http://localhost:5173
```

### Step 3: Vercel Deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Vercel Dashboard → Settings → Environment Variables তে add করো:**
```
GEMINI_API_KEY          = your-gemini-key
VITE_SUPABASE_URL       = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY  = your-anon-key
```

### Step 4: Supabase — Vercel URL add করো

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

### Step 5: Chrome Extension

1. `chrome-extension/popup.js` এর শুরুতে:
   ```js
   const WEBAPP_URL = 'https://your-app.vercel.app'
   ```

2. `chrome://extensions/` → Developer mode ON → Load unpacked → `chrome-extension/` folder

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Gemini 2.0 Flash | Free tier: 15 req/min, 1M tokens/day |
| Paid tier per generation | ~$0.0001–0.0003 (10x cheaper than Claude) |
| Vercel | Free hobby plan |
| Supabase | Free: 500MB DB, 50k users |

**1000 generations/month ≈ $0.10–0.30** — প্রায় বিনামূল্যে!

---

## 🛠️ Tech Stack

- Frontend: React 18 + Vite + Tailwind CSS + Framer Motion
- AI: Gemini 2.0 Flash (Google)
- Backend: Vercel Serverless Functions
- Auth + DB: Supabase (Google OAuth + PostgreSQL)
- Export: html2pdf.js + docx.js
- Notifications: react-hot-toast
- Extension: Chrome Manifest V3
