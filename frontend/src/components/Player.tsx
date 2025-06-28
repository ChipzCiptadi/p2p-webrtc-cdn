import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";

import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useCallback } from "react";
import { HlsJsP2PEngine, type HlsWithP2PConfig } from "p2p-media-loader-hlsjs";
import type { CoreConfig } from "p2p-media-loader-core";
import Hls from "hls.js";

import type { DownloadStats } from "./types";
import { logger } from "../utils";

function Player({
  downloadStatsRef,
  setTotalDownloadStats,
  setPeers,
  config,
}: {
  downloadStatsRef: React.RefObject<DownloadStats>;
  setTotalDownloadStats: React.Dispatch<React.SetStateAction<DownloadStats>>;
  setPeers: React.Dispatch<React.SetStateAction<string[]>>;
  config: CoreConfig;
}) {
  const url =
    "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

  const onProviderChange = useCallback(
    (provider: MediaProviderAdapter | null, _: MediaProviderChangeEvent) => {
      if (!isHLSProvider(provider)) return;

      const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls);

      provider.library = HlsWithP2P as unknown as typeof Hls;
      const hlsConfig: HlsWithP2PConfig<typeof Hls> = {
        p2p: {
          core: config,
          onHlsJsCreated: (hls) => {
            const engine = hls.p2pEngine;

            engine.addEventListener("onPeerConnect", (peer) => {
              if (peer.streamType !== "main") return;

              logger("onPeerConnect", peer);

              setPeers((prevPeers) => {
                return [...prevPeers, peer.peerId];
              });
            });

            engine.addEventListener("onPeerClose", (peer) => {
              if (peer.streamType !== "main") return;

              logger("onPeerClose", peer);

              setPeers((prevPeers) => {
                return prevPeers.filter((peerId) => peerId !== peer.peerId);
              });
            });

            engine.addEventListener("onPeerError", (params) => {
              logger("onPeerError", params);
            });

            engine.addEventListener(
              "onChunkDownloaded",
              (bytesLength: number, downloadSource: string, _?: string) => {
                switch (downloadSource) {
                  case "http":
                    downloadStatsRef.current.httpDownloaded += bytesLength;
                    setTotalDownloadStats((prevStats) => ({
                      ...prevStats,
                      httpDownloaded: prevStats.httpDownloaded + bytesLength,
                    }));
                    break;
                  case "p2p":
                    downloadStatsRef.current.p2pDownloaded += bytesLength;
                    setTotalDownloadStats((prevStats) => ({
                      ...prevStats,
                      p2pDownloaded: prevStats.p2pDownloaded + bytesLength,
                    }));
                    break;
                }
              }
            );

            engine.addEventListener(
              "onChunkUploaded",
              (bytesLength: number, _: string) => {
                downloadStatsRef.current.p2pUploaded += bytesLength;
                setTotalDownloadStats((prevStats) => ({
                  ...prevStats,
                  p2pUploaded: prevStats.p2pUploaded + bytesLength,
                }));
              }
            );

            engine.addEventListener("onTrackerError", (params) => {
              console.error("Tracker error:", params);
            });

            engine.addEventListener("onTrackerWarning", (params) => {
              console.warn("Tracker warning:", params);
            });
          },
        },
      };

      provider.config = hlsConfig;
    },
    []
  );

  return (
    <>
      <MediaPlayer muted autoPlay src={url} onProviderChange={onProviderChange}>
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </>
  );
}

export default Player;
