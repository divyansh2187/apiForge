# 🔥 APIForge — Your Personal Postman Clone

A full-stack API testing tool built with MERN + Tailwind CSS.

## ✨ Features

- 🔐 User authentication (register/login)
- ⚡ Send GET, POST, PUT, PATCH, DELETE requests
- 📁 Organize requests into collections
- 🔑 Custom headers and query params
- 📦 JSON / Raw request body support
- 📊 Response viewer with syntax highlighting
- 🕒 Request history (last 50 requests)
- 💾 Save and reload requests
- 🌐 Backend proxy (avoids CORS issues)

---

## 📁 Project Structure

```
apiforge/
├── backend/          ← Node.js + Express + MongoDB
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/         ← React + Tailwind CSS
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── utils/
```

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

---

### Step 1 — Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/apiforge
JWT_SECRET=mysupersecretkey123
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### Step 2 — Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🧪 Test It

1. Register an account
2. Click **+ NEW** to start a new request
3. Try: `GET https://jsonplaceholder.typicode.com/users`
4. Hit **SEND** — you'll see the JSON response
5. Click **SAVE** to save it to a collection
6. Create a collection in the sidebar first

---

## 🛠 Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 18, Tailwind CSS, Vite  |
| Backend  | Node.js, Express.js           |
| Database | MongoDB + Mongoose            |
| Auth     | JWT + bcryptjs                |
| HTTP     | Axios (proxy requests)        |

---

## 📡 API Endpoints

| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/auth/register     | Register user            |
| POST   | /api/auth/login        | Login user               |
| GET    | /api/collections       | Get all collections      |
| POST   | /api/collections       | Create collection        |
| DELETE | /api/collections/:id   | Delete collection        |
| GET    | /api/requests          | Get saved requests       |
| POST   | /api/requests          | Save a request           |
| DELETE | /api/requests/:id      | Delete saved request     |
| POST   | /api/proxy             | Send HTTP request        |
| GET    | /api/proxy/history     | Get request history      |
| DELETE | /api/proxy/history     | Clear history            |
