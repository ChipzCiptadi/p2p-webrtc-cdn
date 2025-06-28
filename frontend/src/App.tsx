import { useRef, useState } from "react";
import "./App.css";
import Player from "./components/Player";
import type { DownloadStats } from "./components/types";
import Chart from "./components/Chart";
import { byteToMiB } from "./utils";
import { config } from "./config";

function App() {
  const downloadStats = useRef<DownloadStats>({
    httpDownloaded: 0,
    p2pDownloaded: 0,
    p2pUploaded: 0,
  });

  const [totalDownloadStats, setTotalDownloadStats] = useState<DownloadStats>({
    httpDownloaded: 0,
    p2pDownloaded: 0,
    p2pUploaded: 0,
  });

  const [peers, setPeers] = useState<string[]>([]);

  return (
    <>
      <Player
        downloadStatsRef={downloadStats}
        setTotalDownloadStats={setTotalDownloadStats}
        setPeers={setPeers}
        config={config}
      />
      <Chart downloadStatsRef={downloadStats} />

      <div className="peers">Total peers connected: {peers.length}</div>

      <div className="totalStats">
        <h2>Total Download Stats</h2>
        <ul>
          <li>
            Total Downloaded: {}
            {byteToMiB(
              totalDownloadStats.httpDownloaded +
                totalDownloadStats.p2pDownloaded
            ).toFixed(2)}{" "}
            MiB
          </li>
          <li>
            HTTP Downloaded:{" "}
            {byteToMiB(totalDownloadStats.httpDownloaded).toFixed(2)} MiB (
            {(
              (totalDownloadStats.httpDownloaded /
                (totalDownloadStats.httpDownloaded +
                  totalDownloadStats.p2pDownloaded)) *
              100
            ).toFixed(2)}
            %)
          </li>
          <li>
            P2P Downloaded:{" "}
            {byteToMiB(totalDownloadStats.p2pDownloaded).toFixed(2)} MiB (
            {(
              (totalDownloadStats.p2pDownloaded /
                (totalDownloadStats.httpDownloaded +
                  totalDownloadStats.p2pDownloaded)) *
              100
            ).toFixed(2)}
            %)
          </li>
          <li>
            P2P Uploaded: {byteToMiB(totalDownloadStats.p2pUploaded).toFixed(2)}{" "}
            MiB
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
