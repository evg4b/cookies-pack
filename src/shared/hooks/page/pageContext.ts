import { createContext, useContext, useEffect } from 'react';

const defaultContext = {
  document,
  clipboard: navigator.clipboard,
};

export const PageContext = createContext(defaultContext);

export const useWindowSize = (width: number, height: number) => {
  const { document } = useContext(PageContext);
  useEffect(() => {
    document.documentElement.style.width = `${ width }px`;
    document.documentElement.style.height = `${ height }px`;
  }, [document, width, height]);
};
