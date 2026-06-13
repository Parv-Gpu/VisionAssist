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
    setHistory(null);
  };

  const joinAsAgent = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/livekit/token", {
        sessionId: session.sessionId,
        name: "Agent",
        role: "agent",
      });
      setRoomData(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Unable to join as agent");
    }
  };

  const endSession = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/sessions/${session.sessionId}/end`
    );
    alert("Session ended successfully");
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

  const copyLink = () => {
    navigator.clipboard.writeText(session.customerLink);
    alert("Invite link copied");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.logo}>VisionAssist</h1>
        <p style={styles.subtitle}>Real-Time Video Support Platform</p>
      </div>

      <div style={styles.container}>
        <div style={styles.features}>
          <div style={styles.featureCard}>📹 Video Calling</div>
          <div style={styles.featureCard}>💬 Real-Time Chat</div>
          <div style={styles.featureCard}>🖥️ Screen Sharing</div>
          <div style={styles.featureCard}>🔒 Secure Invite Links</div>
        </div>

        <div style={styles.card}>
          <h2>Agent Dashboard</h2>
          <p style={styles.muted}>
            Create a secure support session and invite a customer to join
            directly from their browser.
          </p>

          {!session && (
            <button style={styles.primaryBtn} onClick={createSession}>
              Create Support Session
            </button>
          )}

          {session && (
            <>
              <div style={styles.sessionBox}>
                <div style={styles.statusBadge}>
                  {history?.status === "ended" ? "ENDED" : "ACTIVE"}
                </div>

                <h3>Active Session</h3>

                <p>
                  <strong>Session ID:</strong>
                </p>
                <code style={styles.code}>{session.sessionId}</code>

                <p style={{ marginTop: "15px" }}>
                  <strong>Customer Invite Link:</strong>
                </p>

                <a
                  href={session.customerLink}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Open Customer Invite Link
                </a>

                <br />

                <button style={styles.secondaryBtn} onClick={copyLink}>
                  Copy Invite Link
                </button>
              </div>

              <div style={styles.actions}>
                <button style={styles.primaryBtn} onClick={joinAsAgent}>
                  Join as Agent
                </button>

                <button style={styles.dangerBtn} onClick={endSession}>
                  End Session
                </button>

                <button style={styles.secondaryBtn} onClick={viewHistory}>
                  View History
                </button>

                <button style={styles.lightBtn} onClick={clearSession}>
                  Clear Session
                </button>
              </div>
            </>
          )}
        </div>

        {history && (
          <div style={styles.card}>
            <h2>Session History</h2>

            <table style={styles.table}>
              <tbody>
                <tr>
                  <td>Status</td>
                  <td>
                    <strong>{history.status}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Session ID</td>
                  <td>{history.sessionId}</td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>{new Date(history.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Ended At</td>
                  <td>
                    {history.endedAt
                      ? new Date(history.endedAt).toLocaleString()
                      : "Not ended yet"}
                  </td>
                </tr>
                <tr>
                  <td>Participants</td>
                  <td>{history.participants?.length || 0}</td>
                </tr>
              </tbody>
            </table>

            {history.participants?.length > 0 && (
              <>
                <h3>Participant Log</h3>
                <ul>
                  {history.participants.map((p, index) => (
                    <li key={index}>
                      <strong>{p.role}</strong> - {p.name} joined at{" "}
                      {new Date(p.joinedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {roomData && (
          <div style={styles.callCard}>
            <h2>Live Support Call</h2>
            <div style={styles.callBox}>
              <CallRoom token={roomData.token} serverUrl={roomData.url} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
  },
  header: {
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    padding: "35px 50px",
    textAlign: "center",
  },
  logo: {
    margin: 0,
    fontSize: "42px",
  },
  subtitle: {
    marginTop: "8px",
    fontSize: "18px",
    opacity: 0.95,
  },
  container: {
    maxWidth: "1100px",
    margin: "30px auto",
    padding: "0 20px",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },
  featureCard: {
    background: "white",
    padding: "18px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
  },
  card: {
    background: "white",
    borderRadius: "14px",
    padding: "28px",
    marginBottom: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  muted: {
    color: "#6b7280",
    marginBottom: "20px",
  },
  sessionBox: {
    background: "#eef4ff",
    border: "1px solid #bfdbfe",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    textAlign: "center",
  },
  statusBadge: {
    display: "inline-block",
    background: "#22c55e",
    color: "white",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px",
  },
  code: {
    display: "inline-block",
    background: "#111827",
    color: "white",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  actions: {
    marginTop: "25px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  primaryBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryBtn: {
    background: "#e0ecff",
    color: "#1e40af",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "12px",
  },
  dangerBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  lightBtn: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  callCard: {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  callBox: {
    height: "650px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
  },
};

export default AgentPage;