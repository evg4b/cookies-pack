import { useCallback } from 'react';

export interface UseSaveFileReturn {
  saveFile: (data: string, options: SaveFilePickerOptions) => Promise<void>;
}

export const useSaveFile = (): UseSaveFileReturn => {
  const saveFile = useCallback(async (data: string, options: SaveFilePickerOptions) => {
    try {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, []);

  return { saveFile };
};
