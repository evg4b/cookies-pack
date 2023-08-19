import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useTabs } from '@shared/hooks/with-chrome';
import { NotSupportingBanner } from './NotSupportingBanner';

export const SupportingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const tabs = useTabs();
  const [enabled, setEnabled] = useState(true);
  useEffect(
    () =>
      tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        setEnabled(!!tab.url);
      }),
    [tabs],
  );

  return enabled ? children : <NotSupportingBanner/>;
};
