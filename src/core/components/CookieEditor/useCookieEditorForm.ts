import { useCallback, useEffect, useRef } from 'react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useActiveTab, useCookies, useTranslation } from '@core/hooks';

type Cookie = chrome.cookies.Cookie;
type SameSite = Cookie['sameSite'];

export interface CookieFormValues {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: SameSite;
  session: boolean;
  expirationDate: Date | null;
}

export interface UseCookieEditorFormProps {
  cookie?: Cookie;
  onClose: () => void;
}

export interface UseCookieEditorFormReturn {
  form: UseFormReturnType<CookieFormValues>;
  submit: (values: CookieFormValues) => void;
}

const defaultExpiration = (): Date => new Date(Date.now() + 24 * 60 * 60 * 1000);

const buildUrl = (domain: string, path: string, secure: boolean): string =>
  `${secure ? 'https' : 'http'}://${domain.replace(/^\./, '')}${path || '/'}`;

const stripWww = (hostname: string): string => hostname.replace(/^www\./, '');

const isDomainAllowed = (tabHostname: string, domain: string): boolean => {
  const normalized = stripWww(domain.trim().replace(/^\./, '').toLowerCase());
  if (!normalized) {
    return false;
  }

  const host = stripWww(tabHostname.toLowerCase());
  return host === normalized || host.endsWith(`.${normalized}`);
};

const emptyValues: CookieFormValues = {
  name: '',
  value: '',
  domain: '',
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: true,
  expirationDate: defaultExpiration(),
};

const cookieToValues = (cookie: Cookie): CookieFormValues => ({
  name: cookie.name,
  value: cookie.value,
  domain: cookie.domain,
  path: cookie.path,
  secure: cookie.secure,
  httpOnly: cookie.httpOnly,
  sameSite: cookie.sameSite,
  session: cookie.session,
  expirationDate: cookie.expirationDate ? new Date(cookie.expirationDate * 1000) : defaultExpiration(),
});

export const useCookieEditorForm = ({ cookie, onClose }: UseCookieEditorFormProps): UseCookieEditorFormReturn => {
  const t = useTranslation('cookie_editor');
  const { url: tabUrl } = useActiveTab();
  const { setCookie, removeCookie } = useCookies();
  const tabHostname = tabUrl ? new URL(tabUrl).hostname : null;
  const prefilledRef = useRef(false);

  const form = useForm<CookieFormValues>({
    initialValues: cookie ? cookieToValues(cookie) : emptyValues,
    validate: {
      name: (value) => (value.trim() ? null : t('error_required')),
      domain: (value) => {
        if (!value.trim()) {
          return t('error_required');
        }

        if (tabHostname && !isDomainAllowed(tabHostname, value)) {
          return t('error_domain_mismatch', tabHostname);
        }

        return null;
      },
      path: (value) => (value.startsWith('/') ? null : t('error_path')),
      expirationDate: (value, values) => (!values.session && !value ? t('error_required') : null),
    },
  });

  useEffect(() => {
    if (cookie || prefilledRef.current || !tabUrl) {
      return;
    }

    prefilledRef.current = true;
    const url = new URL(tabUrl);
    form.setFieldValue('domain', url.hostname);
    form.setFieldValue('path', url.pathname);
    form.setFieldValue('secure', url.protocol === 'https:');
    // Prefills once, the first time the active tab URL becomes available;
    // re-running on a later tab change would clobber user edits.
    // `form.setFieldValue` is a stable reference from @mantine/form, so
    // `form` is intentionally left out of the dependency array.
  }, [tabUrl, cookie]);

  const submit = useCallback(
    (values: CookieFormValues) => void (async () => {
      const url = buildUrl(values.domain, values.path, values.secure);

      if (cookie && (cookie.name !== values.name || cookie.domain !== values.domain || cookie.path !== values.path)) {
        await removeCookie(cookie.name, buildUrl(cookie.domain, cookie.path, cookie.secure));
      }

      await setCookie(values.name, values.value, {
        url,
        domain: values.domain,
        path: values.path,
        secure: values.secure,
        httpOnly: values.httpOnly,
        sameSite: values.sameSite,
        expirationDate: values.session || !values.expirationDate
          ? undefined
          : Math.floor(new Date(values.expirationDate).getTime() / 1000),
        storeId: cookie?.storeId,
      });

      onClose();
    })(),
    [cookie, removeCookie, setCookie, onClose],
  );

  return { form, submit };
};
