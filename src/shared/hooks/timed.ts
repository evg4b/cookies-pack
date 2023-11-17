import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

export const useTimedValue = (defaultValue: boolean, timing: number): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [timedValue, setTimedValue] = useState(defaultValue);

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (timedValue) {
      id = setTimeout(() => setTimedValue(defaultValue), timing);
    }

    return () => {
      id && clearInterval(id);
    };
  }, [timedValue, setTimedValue]);

  return [timedValue, setTimedValue];
};
