# VisionAssist – Real-Time Video Support Platform

## Overview

VisionAssist is a browser-based real-time video support platform built for **AtomQuest Hackathon 2026**.

It helps customer support agents resolve visual issues by allowing them to create secure video support sessions, invite customers using a link, communicate through audio/video, chat in real time, share screens, end sessions, and view session history.

---

## Features

- Agent can create a support session
- Customer joins using secure invite link
- One Agent + One Customer per session
- Browser-based video calling
- Audio calling
- Mute / unmute microphone
- Turn camera on / off
- Real-time in-call chat
- Screen sharing
- End session functionality
- Session history tracking
- Role-based access control
- Duplicate customer/agent join prevention

---

## Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router
- LiveKit React Components

### Backend

- Node.js
- Express.js
- LiveKit Server SDK
- UUID
- dotenv
- CORS

### Communication

- WebRTC
- LiveKit Cloud

---

## Project Structure

```text
vision_assist/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AgentPage.jsx
│   │   │   ├── CustomerPage.jsx
│   │   │   └── CallRoom.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Architecture

```text
┌────────────────────┐
│   Agent Browser    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   React Frontend   │
└─────────┬──────────┘
          │ REST APIs
          ▼
┌────────────────────┐
│  Node.js Backend   │
│  Session Manager   │
└─────────┬──────────┘
          │ Token Generation
          ▼
┌────────────────────┐
│   LiveKit Cloud    │
│ WebRTC Media Layer │
└─────────┬──────────┘
          ▲
          │
┌─────────┴──────────┐
│ Customer Browser   │
└────────────────────┘
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd vision_assist
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Demo Flow

1. Open Agent Dashboard.
2. Click **Create Support Session**.
3. Copy/open the generated customer invite link.
4. Customer enters name and joins call.
5. Agent clicks **Join as Agent**.
6. Both participants join the same video room.
7. Test video and audio communication.
8. Send messages using real-time chat.
9. Test screen sharing.
10. Agent clicks **End Session**.
11. Both users are disconnected.
12. Agent clicks **View History** to see session details.

---

## API Endpoints

### Create Session

```http
POST /api/sessions/create
```

### Generate LiveKit Token

```http
POST /api/livekit/token
```

### End Session

```http
POST /api/sessions/:id/end
```

### View Session History

```http
GET /api/sessions/:id/history
```

---

## Access Control

| Role | Permissions |
|---|---|
| Agent | Create session, join call, end session, view history |
| Customer | Join only through valid invite link |
| Unauthorized User | Access denied |

---

## Key Functional Requirements Covered

| Requirement | Status |
|---|---|
| Agent creates session | Completed |
| Customer joins through invite link | Completed |
| Browser-based video call | Completed |
| Audio calling | Completed |
| Server-routed media | Completed using LiveKit |
| Mute / unmute | Completed |
| Camera on / off | Completed |
| Real-time chat | Completed |
| Role-based access | Completed |
| End session | Completed |
| Session history | Completed |
| Screen sharing | Completed |

---

## Known Limitations

- Session data is stored in backend memory for hackathon demo.
- Data resets when backend server restarts.
- Recording is not implemented in the current version.
- File sharing is not implemented in the current version.
- Current version supports one agent and one customer per session.
- For hackathon speed, LiveKit Cloud is used as the media infrastructure. In production, the same architecture can be deployed with a self-hosted LiveKit server.

---

## Future Improvements

- Persistent database storage using MongoDB/Firebase/PostgreSQL
- Call recording
- File sharing inside chat
- Admin dashboard
- Reconnect handling
- Observability metrics
- Session reports
- AI-powered call summary
- Self-hosted LiveKit deployment
- Multi-agent support

---

## Author

### Parv Gupta

B.Tech Electrical Engineering  
Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat

### Connect With Me

- GitHub: https://github.com/Parv-Gpu

---

## Hackathon Details

**Event:** AtomQuest Hackathon 2026  
**Problem Statement:** Real-Time Video Support Platform  
**Built By:** Parv Gupta  
**GitHub Repository:** https://github.com/Parv-Gpu/VisionAssist


---


