import { createContext, useContext, useEffect } from 'react';

interface PageContextType {
  document: Document;
}

export const PageContext = createContext<PageContextType>({
  document,
});

export const useWindowSize = (width: number, height: number) => {
  const { document } = useContext(PageContext);
  useEffect(() => {
    document.documentElement.style.width = `${ width }px`;
    document.documentElement.style.height = `${ height }px`;
  }, [document]);
};
