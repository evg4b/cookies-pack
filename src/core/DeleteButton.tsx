import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import type { FC, MouseEventHandler } from 'react';
import React from 'react';

interface CopyButtonProps {
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const DeleteButton: FC<CopyButtonProps> = ({ title, onClick }) => {
  return (
    <Button title={ title } size="sm" isIconOnly variant="light" onClick={ onClick }>
      <TrashIcon className="w-4 h-4"/>
    </Button>
  );
};

export default DeleteButton;
