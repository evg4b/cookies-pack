import { format } from 'date-fns';

export class JetbrainsCookies {
  private static readonly valueSeparator = '\t';
  private static readonly lineSeparator = '\n';
  private static readonly fileHeader = '# domain\tpath\tname\tvalue\tdate';

  public static encode(cookies: Cookie[]): string {
    return [this.fileHeader, ...cookies.map(this.encodeCookie)]
      .join(this.lineSeparator);
  }

  private static encodeCookie = (cookie: Cookie): string => {
    const { domain, path, name, value, expirationDate } = cookie;

    return [domain, path, name, value, this.formatDate(expirationDate)]
      .join(this.valueSeparator);
  };

  private static formatDate(date: number | undefined): string {
    if (!date) {
      return '-1';
    }

    return format(date * 1000, 'eee, dd-MMM-yyyy HH:mm:ss');
  }
}