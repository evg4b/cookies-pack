import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { useTimedValue } from '@shared/hooks';
import type { FC, MouseEventHandler } from 'react';
import React, { useCallback } from 'react';

interface CopyButtonProps {
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CopyButton: FC<CopyButtonProps> = ({ title, onClick }) => {
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal: MouseEventHandler<HTMLButtonElement> = useCallback(event => {
    onClick?.(event);
    setCopied(true);
  }, [setCopied, onClick]);

  return (
    <Button title={ title } size="sm" isIconOnly variant="light" disabled={ copied } onClick={ onClickInternal }>
      { !copied &&
        <ClipboardIcon className="w-4 h-4"/>
      }
      { copied &&
        <CheckIcon className="w-4 h-4"/>
      }
    </Button>
  );
};
