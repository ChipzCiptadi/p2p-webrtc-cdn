import { type CoreConfig } from "p2p-media-loader-core";

// Reference: https://novage.github.io/p2p-media-loader/docs/latest/types/p2p-media-loader-core.StreamConfig.html
export const config: Partial<CoreConfig> = {
    // Controls if peer-to-peer upload is disabled for the stream. If true, the stream only downloads segments without uploading to peers.
    // Default: false
    isP2PUploadDisabled: false,

    // Controls whether peer-to-peer functionality is disabled for the stream.
    // Default: false
    isP2PDisabled: false,

    // Defines the duration of the time window, in seconds, during which segments are pre-loaded to ensure smooth playback. 
    // This window helps prioritize the fetching of media segments that are imminent to playback.
    // Default: 15
    highDemandTimeWindow: 15,

    // Defines the time window, in seconds, for HTTP segment downloads. This property specifies the duration over which media segments are pre-fetched using HTTP requests.
    // For a better P2P ratio, it is recommended to set this httpDownloadTimeWindow to be lower than p2pDownloadTimeWindow.
    // NOTE: This setting only takes effect if there is at least one peer connection and the connected peer does not have the requested segments available to share via P2P.
    // Default: 3000
    httpDownloadTimeWindow: 300,

    // Defines the time window, in seconds, dedicated to pre-fetching media segments via Peer-to-Peer (P2P) downloads. 
    // This duration determines how much content is downloaded in advance using P2P connections to ensure smooth playback and reduce reliance on HTTP downloads.
    // For a better P2P ratio, it is recommended to set this time window to be greater than httpDownloadTimeWindow to maximize P2P usage.
    // Default: 6000
    p2pDownloadTimeWindow: 600,

    // Maximum number of simultaneous HTTP downloads allowed.
    // Default: 2
    simultaneousHttpDownloads: 2,

    // Maximum number of simultaneous P2P downloads allowed.
    // Default: 3
    simultaneousP2PDownloads: 5,

    // Maximum message size for WebRTC communications, in bytes.
    // Default: 64 * 1024 - 1
    webRtcMaxMessageSize: 64 * 1024 - 1,

    // Timeout for not receiving bytes from P2P, in milliseconds.
    // Default: 2000
    p2pNotReceivingBytesTimeoutMs: 2 * 1000,

    // Timeout for destroying the P2P loader if inactive, in milliseconds.
    // Default: 30 * 1000
    p2pInactiveLoaderDestroyTimeoutMs: 30 * 1000,

    // Timeout for not receiving bytes from HTTP downloads, in milliseconds.
    // Default: 3000
    httpNotReceivingBytesTimeoutMs: 3 * 1000,

    // Number of retries allowed after an HTTP error.
    // Default: 3
    httpErrorRetries: 3,

    // Number of retries allowed after a P2P error.
    // Default: 3
    p2pErrorRetries: 3,

    // List of URLs to the WebTorrent trackers used for announcing and discovering peers (i.e. WebRTC signaling).
    // WARNING: In the Safari browser, only the first tracker will be used. Safari has issues with multiple trackers, 
    // leading to problems with sending SDP messages for WebRTC signaling.
    announceTrackers: [
        // "ws://192.168.0.180:8000",
        "wss://tracker.novage.com.ua",
        "wss://tracker.webtorrent.dev",
        "wss://tracker.openwebtorrent.com",
    ],

    // Configuration for the RTC layer, used in WebRTC communication. 
    // This configuration specifies the STUN/TURN servers used by WebRTC to establish connections through NATs and firewalls.
    rtcConfig: {
        iceServers: [
            { "urls": "stun:stun.l.google.com:19302" },
            { "urls": "stun:global.stun.twilio.com:3478" }
        ]
    }
}