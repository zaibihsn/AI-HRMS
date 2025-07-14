# AIHR Evolution

AIHR Evolution is a modern, AI-powered Human Resource Management System (HRMS) built with React, Express, and Groq's LLM APIs. It provides intelligent HR automation, employee self-service, and real-time chat assistance for HR queries, leave requests, claims, and more.

---

## Features

- **AI Chatbot (Zeus AI Assistant):**  
  Smart, conversational HR assistant powered by Groq LLMs (Llama 3, Mistral, etc.)
- **Employee Self-Service:**  
  Leave requests, expense claims, payslips, benefits, and ticketing.
- **Automated Approvals:**  
  AI-driven analysis for leave and claim approvals based on company policies.
- **Dashboard & Analytics:**  
  Real-time stats for HR, recruitment, and employee management.
- **Dark Mode & Timezone Support:**  
  User-friendly UI with theme and timezone preferences.
- **Secure Authentication:**  
  User sign-in/sign-out with chat history isolation.
- **RESTful API:**  
  Modular Express backend with clear endpoints for chat, employees, claims, and more.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite, React Query, Wouter
- **Backend:** Node.js, Express, TypeScript, Groq API (LLM)
- **Database:** (Your choice: SQLite, PostgreSQL, etc.)
- **AI Models:** Llama 3, Mistral, and others via Groq API

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- Groq API Key ([Get one here](https://console.groq.com/))

### Installation

```bash
git clone https://github.com/<your-username>/AIHR-Evolution.git
cd AIHR-Evolution
npm install
cd client
npm install
```

### Configuration

1. **Backend:**  
   - Set your Groq API key in `.env`:
     ```
     GROQ_API_KEY=your_groq_api_key
     ```
2. **Frontend:**  
   - Update API endpoints in `client/src/lib/apiRequest.ts` if needed.

### Running Locally

**Start the backend:**
```bash
npm run dev
```

**Start the frontend:**
```bash
cd client
npm run dev
```

---

## Usage

- **Chat Widget:**  
  Open the chat widget to interact with Zeus AI for HR queries.
- **Employee Dashboard:**  
  View stats, manage employees, and track recruitment.
- **Leave & Claims:**  
  Submit requests and get instant AI-powered feedback.

---

## API Endpoints

- `POST /api/chat` — Send a message to Zeus AI Assistant
- `GET /api/chat/history/:userId` — Fetch chat history for a user
- `POST /api/leave/analyze` — AI-powered leave approval analysis
- `POST /api/claim/analyze` — AI-powered claim approval analysis
- `GET /api/employees` — List employees
- ...and more

---

## Customization

- **AI Personality:**  
  Change the system prompt in `server/ai-service.ts` to customize the assistant.
- **Models:**  
  Use any Groq-supported model by updating the `model` field in API calls.
- **Themes & Settings:**  
  Edit `client/src/pages/Settings.tsx` for UI preferences.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT

---

## Credits

- [Groq](https://groq.com/) for blazing-fast LLM APIs
- [React](https://react.dev/), [Express](https://expressjs.com/), [Tailwind CSS](https://tailwindcss.com/)

---

## Contact

For questions or support, open an issue or contact [your-email@example.com](mailto:your-email@example.com)
