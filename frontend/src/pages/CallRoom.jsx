import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

function CallRoom({ token, serverUrl }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        video={true}
        audio={true}
        style={{ height: "100%", width: "100%" }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}

export default CallRoom;