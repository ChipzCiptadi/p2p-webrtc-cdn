import { useEffect, useState } from "react";
import type { DownloadStats, TimedDownloadStats } from "./types";
import { LineChart } from "@mui/x-charts";
import { byteToKiB } from "../utils";

const ARRAY_SIZE = 60;

function initTimedDownloadStats(): TimedDownloadStats[] {
  const nowInSeconds = Math.floor(performance.now() / 1000);
  return Array.from({ length: ARRAY_SIZE }, (_, i) => ({
    seconds: nowInSeconds - (ARRAY_SIZE - i),
    httpDownloaded: 0,
    p2pDownloaded: 0,
    p2pUploaded: 0,
  }));
}

export default function Chart({
  downloadStatsRef,
}: {
  downloadStatsRef: React.RefObject<DownloadStats>;
}) {
  const [timedDownloadStats, setTimedDownloadStats] = useState<
    TimedDownloadStats[]
  >(initTimedDownloadStats());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTimedDownloadStats((prevStats) => {
        const { httpDownloaded, p2pDownloaded, p2pUploaded } =
          downloadStatsRef.current;

        const newTimedDownloadStats: TimedDownloadStats = {
          seconds: Math.floor(performance.now() / 1000),
          httpDownloaded: byteToKiB(httpDownloaded),
          p2pDownloaded: byteToKiB(p2pDownloaded),
          p2pUploaded: -byteToKiB(p2pUploaded),
        };

        return [...prevStats.slice(1), newTimedDownloadStats];
      });

      downloadStatsRef.current.httpDownloaded = 0;
      downloadStatsRef.current.p2pDownloaded = 0;
      downloadStatsRef.current.p2pUploaded = 0;
    }, 1000);

    return () => clearInterval(intervalID);
  }, [downloadStatsRef]);

  return (
    <>
      <LineChart
        skipAnimation
        xAxis={[{ data: timedDownloadStats.map((stat) => stat.seconds) }]}
        series={[
          {
            label: "HTTP download (KiB/s)",
            data: timedDownloadStats.map((stat) => stat.httpDownloaded),
            showMark: false,
            area: true,
            stack: "total",
          },
          {
            label: "P2P download (KiB/s)",
            data: timedDownloadStats.map((stat) => stat.p2pDownloaded),
            showMark: false,
            area: true,
            stack: "total",
          },
          {
            label: "P2P upload (KiB/s)",
            data: timedDownloadStats.map((stat) => stat.p2pUploaded),
            showMark: false,
            area: true,
          },
        ]}
        height={300}
      />
    </>
  );
}
