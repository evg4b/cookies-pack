import { CookiesTable } from '@core/CookiesTable';
import { Button, Checkbox, Divider, Input, Textarea } from '@nextui-org/react';
import type { ChangeEvent, FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

interface CookiesParams {
  cookies: Cookie[];
  currentPath: string;
  setCookies(clear: boolean, path: string, cookies: string): void;
}

const join = (cookies: Cookie[]): string => {
  return cookies.map((cookie) => cookie.name + '=' + cookie.value).join(';');
};

const value = (event: Event | React.FormEvent<HTMLElement>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event?.target as any).value;
const checked = (event: ChangeEvent<HTMLInputElement>) => event.target.checked;

export const Cookies: FC<CookiesParams> = ({ currentPath, setCookies, cookies }) => {
  const [customPath, setCustomPath] = useState(false);
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');
  const [clear, setClear] = useState(true);

  useEffect(() => {
    setPath(customPath ? currentPath : '/');
  }, [customPath, currentPath]);

  const updateCookies = useCallback(() => {
    setCookies(clear, path, newCookies);
    setNewCookies('');
  }, [setCookies, clear, path, newCookies, setNewCookies]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(join(cookies));
  }, [cookies]);

  return (
    <div className="flex flex-col gap-2">
      <CookiesTable cookies={ cookies } copyToClipboard={ copyToClipboard }/>
      <Divider className="my-4"/>
      <Textarea rows={ 7 } minRows={ 7 } maxRows={ 7 } value={ newCookies } onInput={ (event) => setNewCookies(value(event)) }
                placeholder="Update cookies with a cookie header, e.g. foo=bar; bat=baz; oof=rab"/>
      <div className="flex flex-row justify-between gap-2">
        <Input
          placeholder="Cookies path"
          disabled={ !customPath }
          value={ customPath ? path : '' }
          onChange={ (event) => setPath(value(event)) }
        />
        <Checkbox isSelected={ customPath } onChange={ (event) => setCustomPath(checked(event)) }>
          <div className="whitespace-nowrap">
            Custom path
          </div>
        </Checkbox>
      </div>
      <div className="flex flex-row justify-between">
        <Checkbox isSelected={ clear } onChange={ (event) => setClear(checked(event)) }>
          Clear existing cookies first
        </Checkbox>
        <Button size="sm" color="primary" variant="solid" onClick={ updateCookies }>
          Set Cookies
        </Button>
      </div>
    </div>
  );
};
