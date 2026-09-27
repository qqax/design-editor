import React from 'react';

import { ExitButton } from './ExitButton';
import { useMessages } from '../../../messages';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../primitives';

interface UnsavedChangesProtectorProps {
  hasUnsavedChanges: boolean;
  onBack: () => void;
}

export const UnsavedChangesProtector = ({
  hasUnsavedChanges,
  onBack,
}: UnsavedChangesProtectorProps) => {
  const m = useMessages().leaveDialog;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ExitButton hasUnsavedChanges={hasUnsavedChanges} onBack={onBack} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{m.title}</DialogTitle>
        <DialogDescription>{m.description}</DialogDescription>
        <div className="de-dialog-actions">
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              {m.stay}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onBack} size="md" variant="primary">
              {m.leave}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
