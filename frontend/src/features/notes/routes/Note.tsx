import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { LoaderFallback } from '@/components/ui/LoaderFallback';
import { UserNavigation } from '@/components/ui/UserNavigation';

import { CreateNoteButton } from '../components/CreateNoteButton';
import { useGetNote } from '../hooks/useGetNote';

export const Note = () => {
  const { noteId } = useParams();
  const note = useGetNote(Number(noteId));

  if (!note.isSuccess) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-screen h-16 p-4 bg-background">
        <div className="h-full flex items-center justify-between">
          <Link to="/users/me/notes" className="text-primary flex items-center">
            <ChevronLeft className="w-7 h-7 -ml-2" />
            Notes
          </Link>
          <UserNavigation />
        </div>
      </header>
      <div className="my-16 md:w-5/12 mx-auto">
        {note.isPending && <LoaderFallback className="h-screen -my-16" />}
        {note.isSuccess && <div>{note.data?.id}</div>}
      </div>
      <footer className="fixed bottom-0 left-0 w-screen h-16 p-4 bg-background">
        <div className="md:w-5/12 h-full mx-auto grid grid-cols-3 items-center">
          <div className="text-sm text-center col-start-2">
            TODO: note footer
          </div>
          <CreateNoteButton className="ml-auto" />
        </div>
      </footer>
    </>
  );
};
