import React from 'react';

import { ExitButton } from './ExitButton';
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
}: UnsavedChangesProtectorProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <ExitButton hasUnsavedChanges={hasUnsavedChanges} onBack={onBack} />
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Leave without saving?</DialogTitle>
      <DialogDescription>Any unsaved changes will be lost.</DialogDescription>
      <div className="de-dialog-actions">
        <DialogClose asChild>
          <Button size="md" variant="secondary">
            Stay
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onBack} size="md" variant="primary">
            Exit
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);
