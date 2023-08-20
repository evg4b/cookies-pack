import { createContext, useContext, useEffect } from 'react';

export interface PageContextType {
  document: Document;
  clipboard: Clipboard,
}

export const PageContext = createContext<PageContextType>({
  document,
  clipboard: navigator.clipboard,
});

export const useWindowSize = (width: number, height: number) => {
  const { document } = useContext(PageContext);
  useEffect(() => {
    document.documentElement.style.width = `${ width }px`;
    document.documentElement.style.height = `${ height }px`;
  }, [document, width, height]);
};
