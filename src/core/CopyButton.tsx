import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import { If } from '@shared/components';
import { useTimedValue } from '@shared/hooks';
import type { FC, MouseEventHandler } from 'react';
import { useCallback } from 'react';

interface CopyButtonProps {
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const CopyButton: FC<CopyButtonProps> = ({ title, onClick }) => {
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal: MouseEventHandler<HTMLButtonElement> = useCallback(event => {
    onClick?.(event);
    setCopied(true);
  }, [setCopied, onClick]);

  return (
    <Button title={title} size="sm" isIconOnly variant="secondary" disabled={copied} onPress={onClickInternal}>
      <If condition={!copied}>
        <ClipboardIcon className="w-4 h-4"/>
      </If>
      <If condition={copied}>
        <CheckIcon className="w-4 h-4"/>
      </If>
    </Button>
  );
};

export default CopyButton;
