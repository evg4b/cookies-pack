type Cookie = chrome.cookies.Cookie;

const FILE_HEADER = '# domain\tpath\tname\tvalue\tdate';
const VALUE_SEPARATOR = '\t';
const LINE_SEPARATOR = '\n';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (value: number): string => value.toString().padStart(2, '0');

const formatExpirationDate = (date: number | undefined): string => {
  if (!date) {
    return '-1';
  }

  const value = new Date(date * 1000);
  const day = DAY_NAMES[value.getDay()];
  const month = MONTH_NAMES[value.getMonth()];

  return `${day}, ${pad(value.getDate())}-${month}-${pad(value.getFullYear())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
};

const encodeCookie = (cookie: Cookie): string => {
  const { domain, path, name, value, expirationDate } = cookie;

  return [domain, path, name, value, formatExpirationDate(expirationDate)].join(VALUE_SEPARATOR);
};

export const encodeJetbrainsCookies = (cookies: Cookie[]): string =>
  [FILE_HEADER, ...cookies.map(encodeCookie)].join(LINE_SEPARATOR);
