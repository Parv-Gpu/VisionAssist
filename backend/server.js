const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { AccessToken, RoomServiceClient } = require("livekit-server-sdk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const sessions = {};

app.get("/", (req, res) => {
  res.send("VisionAssist backend running");
});

app.post("/api/sessions/create", (req, res) => {
  const sessionId = uuidv4();
  const inviteToken = uuidv4();

  sessions[sessionId] = {
    sessionId,
    inviteToken,
    status: "active",
    createdAt: new Date(),
    endedAt: null,
    participants: [],
    messages: [],
  };

  res.json({
    sessionId,
    inviteToken,
    customerLink: `http://localhost:5173/customer/${sessionId}?token=${inviteToken}`,
  });
});

app.post("/api/livekit/token", async (req, res) => {
  try {
    const { sessionId, name, role, inviteToken } = req.body;

    const session = sessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(403).json({ error: "Session already ended" });
    }

    if (role === "customer" && session.inviteToken !== inviteToken) {
      return res.status(403).json({ error: "Invalid invite token" });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: `${role}-${name}-${Date.now()}`,
        name,
      }
    );

    at.addGrant({
      roomJoin: true,
      room: sessionId,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    session.participants.push({
      name,
      role,
      joinedAt: new Date(),
    });

    res.json({
      token,
      url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.log("Token error:", error.message);
    res.status(500).json({ error: "Token generation failed" });
  }
});

app.post("/api/sessions/:id/end", async (req, res) => {
  const session = sessions[req.params.id];

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    const roomService = new RoomServiceClient(
      process.env.LIVEKIT_URL.replace("wss://", "https://"),
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    await roomService.deleteRoom(req.params.id);

    session.status = "ended";
    session.endedAt = new Date();

    res.json({
      message: "Session ended and LiveKit room closed",
      session,
    });
  } catch (error) {
    console.log("End session error:", error.message);

    session.status = "ended";
    session.endedAt = new Date();

    res.json({
      message: "Session marked ended",
      warning: "Room may already be closed",
      session,
    });
  }
});

app.get("/api/sessions/:id/history", (req, res) => {
  const session = sessions[req.params.id];

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json(session);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`VisionAssist backend running on port ${PORT}`);
});