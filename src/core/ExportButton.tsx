import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import type { FC, MouseEventHandler } from 'react';
import React from 'react';

interface ExportButtonProps {
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ExportButton: FC<ExportButtonProps> = ({ title, onClick }) => {
  return (
    <Button title={ title } size="sm" isIconOnly variant="light" onClick={ onClick }>
      <ArrowUpOnSquareIcon className="w-4 h-4"/>
    </Button>
  );
};

export default ExportButton;
