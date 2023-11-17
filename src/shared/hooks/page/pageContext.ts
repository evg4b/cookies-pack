import { createContext, useContext, useEffect } from 'react';
import { isNil } from "@shared/helpres";

const saveFile = async (data: string, options: SaveFilePickerOptions) => {
  try {
    const handler = await window.showSaveFilePicker(options);
    const writable = await handler.createWritable();
    await writable.write(data);
    await writable.close();
  } catch (err) {
    console.error(err);
  }
};

const defaultContext = {
  document,
  clipboard: navigator.clipboard,
  saveFile,
};


export const PageContext = createContext(defaultContext);

export const useWindowSize = (width: number | null, height: number | null) => {
  const { document } = useContext(PageContext);
  useEffect(() => {
    document.documentElement.style.width = isNil(width) ? '' : `${ width }px`;
    document.documentElement.style.height = isNil(height) ? '' : `${ height }px`;
  }, [document, width, height]);
};
