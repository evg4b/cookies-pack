type Cookie = chrome.cookies.Cookie;
type SetDetails = chrome.cookies.SetDetails;

export const parseCookieHeader = (header: string | null | undefined, url: string, path: string): SetDetails[] => {
  if (!header) {
    return [];
  }

  return header
    .split(/;\n?/)
    .map<SetDetails>((line) => {
      const trimmed = line.trim();
      const eqIdx = trimmed.indexOf('=');
      const name = eqIdx === -1 ? trimmed : trimmed.slice(0, eqIdx);
      const value = eqIdx === -1 ? '' : trimmed.slice(eqIdx + 1);

      return { url, path, name, value };
    })
    .filter(({ name }) => name.length > 0);
};

export const joinCookiesHeader = (cookies: Cookie[]): string =>
  cookies.map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`).join(';\n');
