import { useTabs } from '@shared/hooks/with-chrome';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { NotSupportingBanner } from './NotSupportingBanner';

export const SupportingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const tabs = useTabs();
  const [enabled, setEnabled] = useState(true);
  useEffect(
    () =>
      tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        setEnabled(!!tab.url);
      }),
    [tabs],
  );

  return enabled ? children : <NotSupportingBanner/>;
};
