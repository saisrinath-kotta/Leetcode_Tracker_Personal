# 🚀 DSA Master — Master 500 LeetCode Problems

Tagline: *"Understand. Solve. Review. Master DSA."*

**DSA Master** is a production-quality full-stack web application designed for personal Data Structures & Algorithms learning. It provides an all-in-one suite to browse problems, understand core patterns, view step-by-step visualizations, access progressive hints, watch video walkthroughs, edit code with Monaco Editor, consult AI DSA Mentors, track spaced repetition reviews, and analyze topic mastery.

---

## 🌟 Key Features

1. **Problem Library**: Structured catalog built to scale up to **500 LeetCode problems**. Search by problem number, title, topic, or pattern with debounced instant search and filter controls.
2. **Pedagogical Problem Learning Suite**:
   - **Understand**: Concise, beginner-friendly explanations ("What is this asking?", "Why tricky?", "Key observation").
   - **Step-by-Step Visualizer**: Dynamic visual representation of array pointers, sliding windows, stacks, linked lists, and tree traversals.
   - **Progressive Hint System**: 3-stage hint unlocks revealing subtle clues before spoiling full algorithms.
   - **YouTube Walkthrough Embed**: Verified video explanations embedded directly.
   - **Approaches & Complexity**: Multi-tier breakdown (**Brute Force → Better → Optimal**) with inline time/space complexity explanations.
   - **Reference Solutions**: Code implementations in **C++, Java, Python, JavaScript, TypeScript** with line-by-line explanations.
3. **Monaco Code Editor**: Full Monaco Editor integration supporting multiple languages, auto-save, formatting, and theme sync.
4. **Code Execution Abstraction Service**: Safe server abstraction executing dry-run tests and calculating runtime/memory metrics without unsafe eval or direct shell subprocesses.
5. **AI DSA Mentor**: Server-side OpenAI-compatible AI assistant offering hint-first coaching, pattern explanation, code debugging, and logic reviews. Includes automatic pedagogical fallback if an API key is not configured.
6. **Spaced Repetition Review System**: Smart review queue prioritizing problems based on low confidence ratings, previous wrong answers, and old solved dates.
7. **Custom Practice Sessions**: Generator for custom test sets by topic, difficulty, pattern, and problem count.
8. **Progress Analytics**: Visual metrics including total solved, topic mastery bars, streak counter, and accuracy rate.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Monaco Editor (`@monaco-editor/react`), TanStack React Query, React Router DOM, Zod.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), JWT, BcryptJS, Cookie Parser, Zod.
- **Database**: MongoDB (Local MongoDB or MongoDB Atlas cluster).
- **AI**: OpenAI API compatible REST endpoint wrapper with server-side secret isolation and pedagogical fallback engine.

---

## 📁 Folder Structure

```
dsa-master/
├── package.json               # Root workspace configuration
├── .env.example               # Environment template
├── .gitignore
├── README.md                  # Comprehensive documentation
├── server/                    # Node.js + Express + TypeScript backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts           # Express server bootstrap
│       ├── config/            # DB and environment configuration
│       ├── controllers/       # Auth, Problems, Progress, Submissions, AI, Dashboard, Review, Practice
│       ├── middleware/        # JWT Auth and Error handling
│       ├── models/            # Mongoose Schemas (User, Problem, UserProgress, Submission, Note, PracticeSession)
│       ├── routes/            # REST API Routes
│       ├── services/          # Safe Code Execution Service & AI Service
│       └── seed/              # Problem seed dataset (problems.json & seedProblems.ts)
└── client/                    # React 18 + TypeScript + Vite frontend
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── App.tsx            # Routes & Query Provider
        ├── main.tsx
        ├── types/             # TypeScript type declarations
        ├── services/          # API fetch wrapper
        ├── components/
        │   ├── layout/        # AppShell, Sidebar, Header, MobileDrawer, CommandSearchModal
        │   ├── problem/       # Visualizer, HintSystem, YouTubeEmbed, ApproachesTab, ReferenceSolutions, AIMentorPanel
        │   ├── editor/        # Monaco CodeEditor
        │   └── ui/            # Button, Badge, Card
        └── pages/             # Dashboard, Problems, ProblemDetail, Review, Practice, Progress, Notes, Submissions, Settings, Profile, Login, Register
```

---

## 🔑 Environment Variables

Create `.env` files in root or `server/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/dsa_master
JWT_SECRET=your_super_secret_jwt_key_change_in_production
OPENAI_API_KEY=your_openai_api_key_optional
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
In the root directory, run:
```bash
npm install
```

### 2. Seed Data
Seed the core problem set and initial demo progress into MongoDB or memory cache:
```bash
npm run seed
```

### 3. Run Development Server
Launch both the Express backend (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 🧪 Testing & Verification

Run tests across server and client workspaces:
```bash
npm run test
```

Build production distribution packages:
```bash
npm run build
```

---

## 🚢 Deployment Instructions

- **Frontend (Vercel / Netlify)**: Deploy `client/` workspace. Set Root Directory to `client` and Build Command to `npm run build`.
- **Backend (Render / Railway)**: Deploy `server/` workspace. Set Start Command to `npm run start` and configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`).
- **Database (MongoDB Atlas)**: Provision a free M0 cluster and set `MONGODB_URI` connection string in server configuration.
