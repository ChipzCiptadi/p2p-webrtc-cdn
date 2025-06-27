import { useRef, useState } from "react";
import "./App.css";
import Player from "./components/Player";
import type { DownloadStats } from "./components/types";
import Chart from "./components/Chart";

function App() {
  const trackers = [
    // "wss://tracker.novage.com.ua",
    // "wss://tracker.webtorrent.dev",
    // "wss://tracker.openwebtorrent.com",
    "ws://192.168.0.180:8000",
  ];
  const downloadStats = useRef<DownloadStats>({
    httpDownloaded: 0,
    p2pDownloaded: 0,
    p2pUploaded: 0,
  });

  const [peers, setPeers] = useState<string[]>([]);

  return (
    <>
      <Player
        downloadStatsRef={downloadStats}
        setPeers={setPeers}
        trackers={trackers}
      />
      <Chart downloadStatsRef={downloadStats} />
      <div className="peers">
        <h2>Peers ({peers.length})</h2>
        <ul>
          {peers.map((peerId) => (
            <li key={peerId}>{peerId}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
