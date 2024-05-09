import * as React from 'react';
import { Ellipsis, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/cn';

import { useDeleteNote } from '../hooks/useDeleteNote';

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
  const deleteNote = useDeleteNote();

  const noteDropdownItems: NoteDropdownItem[] = [
    {
      name: 'Delete',
      icon: <Trash2 />,
      onClick: (event) => {
        event?.stopPropagation();
        deleteNote.mutate(id);
      },
      className: 'text-red-500',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={className} aria-label="More actions. Popup button.">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        {noteDropdownItems.map((item, index, arr) => (
          <div key={item.name}>
            <DropdownMenuItem
              className={cn('px-8', item.className)}
              onClick={item.onClick}
            >
              <span className="mr-auto">{item.name}</span>
              {item.icon}
            </DropdownMenuItem>
            {index < arr.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
