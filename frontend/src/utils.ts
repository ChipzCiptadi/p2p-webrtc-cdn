export function byteToKiB(bytes: number): number {
    return bytes / 1024;
}

export function byteToMiB(bytes: number): number {
    return bytes / 1024 / 1024;
}

export function logger(...args: any[]) {
    const dt = new Date();
    console.log(`%c[${dt.toISOString()}]`, "background:#eee;color:#222", ...args);
}