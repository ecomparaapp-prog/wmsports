export function driveUrlToImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  let fileId: string | null = null;

  const fileViewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileViewMatch) {
    fileId = fileViewMatch[1];
  }

  const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) {
    fileId = ucMatch[1];
  }

  const openMatch = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) {
    fileId = openMatch[1];
  }

  if (!fileId) return url;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
}

export function isDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (isDriveUrl(url)) return driveUrlToImageUrl(url);
  return url;
}
