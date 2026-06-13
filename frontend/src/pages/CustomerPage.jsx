import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import CallRoom from "./CallRoom";

function CustomerPage() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();

  const inviteToken = searchParams.get("token");

  const [name, setName] = useState("Customer");
  const [roomData, setRoomData] = useState(null);

  const joinCall = async () => {
    const res = await axios.post("http://localhost:5000/api/livekit/token", {
      sessionId,
      name,
      role: "customer",
      inviteToken,
    });

    setRoomData(res.data);
  };

  if (roomData) {
    return <CallRoom token={roomData.token} serverUrl={roomData.url} />;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Customer Join Page</h1>

      <p>
        <strong>Session ID:</strong> {sessionId}
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />

      <br />
      <br />

      <button onClick={joinCall}>Join Video Call</button>
    </div>
  );
}

export default CustomerPage;