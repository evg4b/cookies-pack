const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);

export const isSupportedUrl = (url: URL | null | undefined): boolean => {
  return SUPPORTED_PROTOCOLS.has(url?.protocol ?? '');
};
