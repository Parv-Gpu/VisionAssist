import { useState } from "react";
import axios from "axios";
import CallRoom from "./CallRoom";

function AgentPage() {
  const [session, setSession] = useState(
    JSON.parse(localStorage.getItem("session"))
  );
  const [roomData, setRoomData] = useState(null);
  const [history, setHistory] = useState(null);

  const createSession = async () => {
    const res = await axios.post("http://localhost:5000/api/sessions/create");
    setSession(res.data);
    localStorage.setItem("session", JSON.stringify(res.data));
  };

  const joinAsAgent = async () => {
    const res = await axios.post("http://localhost:5000/api/livekit/token", {
      sessionId: session.sessionId,
      name: "Agent",
      role: "agent",
    });
    setRoomData(res.data);
  };

  const endSession = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/sessions/${session.sessionId}/end`
    );

    alert("Session ended");
    setHistory(res.data.session);
  };

  const viewHistory = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/sessions/${session.sessionId}/history`
    );
    setHistory(res.data);
  };

  const clearSession = () => {
    localStorage.removeItem("session");
    setSession(null);
    setHistory(null);
    setRoomData(null);
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1>VisionAssist Agent Dashboard</h1>

        {!session && (
          <button onClick={createSession}>Create Support Session</button>
        )}

        {session && (
          <>
            <h3>Session Created</h3>
            <p><strong>Session ID:</strong> {session.sessionId}</p>

            <p><strong>Invite Link:</strong></p>
            <a href={session.customerLink} target="_blank" rel="noreferrer">
              {session.customerLink}
            </a>

            <br /><br />

            <button onClick={joinAsAgent}>Join as Agent</button>
            <button onClick={endSession} style={{ marginLeft: "10px" }}>
              End Session
            </button>
            <button onClick={viewHistory} style={{ marginLeft: "10px" }}>
              View History
            </button>
            <button onClick={clearSession} style={{ marginLeft: "10px" }}>
              Clear Session
            </button>
          </>
        )}

        {history && (
          <div style={{ marginTop: "20px" }}>
            <h2>Session History</h2>
            <p><strong>Status:</strong> {history.status}</p>
            <p><strong>Created At:</strong> {history.createdAt}</p>
            <p><strong>Ended At:</strong> {history.endedAt || "Not ended yet"}</p>
          </div>
        )}
      </div>

      {roomData && (
        <div style={{ height: "600px", border: "2px solid black" }}>
          <CallRoom token={roomData.token} serverUrl={roomData.url} />
        </div>
      )}
    </div>
  );
}

export default AgentPage;