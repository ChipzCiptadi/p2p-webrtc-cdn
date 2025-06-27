export type DownloadStats = {
    httpDownloaded: number;
    p2pDownloaded: number;
    p2pUploaded: number;
}

export type TimedDownloadStats = {
    seconds: number;
} & DownloadStats;