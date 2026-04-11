import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button, PressEvent } from '@heroui/react';
import type { FC } from 'react';

interface ExportButtonProps {
  title?: string;
  onClick?: (e: PressEvent) => void;
}

const ExportButton: FC<ExportButtonProps> = ({ title, onClick }) => {
  return (
    <Button title={title} size="sm" isIconOnly variant="ghost" onPress={onClick}>
      <ArrowDownTrayIcon className="w-4 h-4"/>
    </Button>
  );
};

export default ExportButton;
