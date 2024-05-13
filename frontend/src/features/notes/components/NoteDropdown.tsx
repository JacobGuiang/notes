import { useState } from 'react';
import { Ellipsis, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/utils/cn';

import { useDeleteNote } from '../hooks/useDeleteNote';

interface DeleteDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteNote: () => void;
}

const DeleteDialog = ({
  showDeleteDialog,
  setShowDeleteDialog,
  deleteNote,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={(event) => {
              event.stopPropagation();
              deleteNote();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface NoteDropdownProps {
  className?: string;
  id: number;
}

interface NoteDropdownItem {
  name: string;
  icon?: React.ReactElement;
  onClick?: (event?: React.MouseEvent) => void;
  className?: string;
}

export const NoteDropdown = ({ className, id }: NoteDropdownProps) => {
  const noteDropdownItems: NoteDropdownItem[] = [
    {
      name: 'Delete',
      icon: <Trash2 />,
      onClick: () => setShowDeleteDialog(true),
      className: 'text-red-500',
    },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteNote = useDeleteNote();

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={className}
            aria-label="More actions. Popup button."
          >
            <Ellipsis />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
          {noteDropdownItems.map((item, index, arr) => (
            <div key={item.name}>
              <DropdownMenuItem
                className={cn('px-8', item.className)}
                onClick={(event) => {
                  event.stopPropagation();
                  item.onClick?.();
                }}
              >
                <span className="mr-auto">{item.name}</span>
                {item.icon}
              </DropdownMenuItem>
              {index < arr.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        deleteNote={() => deleteNote.mutate(id)}
      />
    </div>
  );
};
