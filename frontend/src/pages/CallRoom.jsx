import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

function CallRoom({ token, serverUrl }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}

export default CallRoom;