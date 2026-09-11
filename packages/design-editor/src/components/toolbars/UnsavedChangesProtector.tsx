import React from 'react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../primitives';
import { ExitButton } from './ExitButton';

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
    <DialogContent className="max-w-md p-6">
      <DialogTitle className="mb-2 text-lg font-semibold text-(--de-color-text)">
        Leave without saving?
      </DialogTitle>
      <DialogDescription className="mb-6 text-(--de-color-text-muted)">
        Any unsaved changes will be lost.
      </DialogDescription>
      <div className="flex justify-end gap-3">
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
