import { useNavigate } from 'react-router-dom';
import { SquarePen } from 'lucide-react';

import { useCreateNote } from '../hooks/useCreateNote';

interface CreateNoteButtonProps {
  className?: string;
}

export const CreateNoteButton = ({ className }: CreateNoteButtonProps) => {
  const createNote = useCreateNote();
  const navigate = useNavigate();

  const handleCreateNote = () => {
    createNote.mutate(undefined, {
      onSuccess: ({ id }) => navigate(`/users/me/notes/${id}`),
    });
  };

  return (
    <button
      className={className}
      onClick={handleCreateNote}
      aria-label="Create new note"
    >
      <SquarePen className="text-primary w-7 h-7" />
    </button>
  );
};
