const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);

export const isSupportedUrl = (url: string | null | undefined): boolean => {
  if (!url) {
    return false;
  }

  try {
    return SUPPORTED_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
};
