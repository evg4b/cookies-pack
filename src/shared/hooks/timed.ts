import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useTimedValue = (
  defaultValue: boolean,
  timing: number,
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [timedValue, setTimedValue] = useState(defaultValue);

  useEffect(() => {
    if (timedValue) {
      setTimeout(() => setTimedValue(defaultValue), timing);
    }
  }, [timedValue, setTimedValue]);

  return [timedValue, setTimedValue];
};
