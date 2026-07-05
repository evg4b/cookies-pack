import { useCallback, useEffect, useState } from 'react';

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (value: string) => Promise<void>;
}

export const useCopyToClipboard = (timeoutMs = 1500): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const id = setTimeout(() => { setCopied(false); }, timeoutMs);
    return () => { clearTimeout(id); };
  }, [copied, timeoutMs]);

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  return { copied, copy };
};
