import { useEffect, useState } from "react";
import type { DownloadStats, TimedDownloadStats } from "./types";
import { LineChart } from "@mui/x-charts";

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

function byteToMiB(bytes: number): number {
  return bytes / (1024 * 1024);
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
          httpDownloaded: byteToMiB(httpDownloaded),
          p2pDownloaded: byteToMiB(p2pDownloaded),
          p2pUploaded: -byteToMiB(p2pUploaded),
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
            label: "HTTP downloaded",
            data: timedDownloadStats.map((stat) => stat.httpDownloaded),
            showMark: false,
            area: true,
          },
          {
            label: "P2P downloaded",
            data: timedDownloadStats.map((stat) => stat.p2pDownloaded),
            showMark: false,
            area: true,
          },
          {
            label: "P2P uploaded",
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
