import { useGetUser } from '@/features/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { Loader } from '@/components/ui/Loader';
import { UserNavigation } from '@/components/ui/UserNavigation';

import { getNotes } from '../api/getNotes';
import { CreateNoteButton } from '../components/CreateNoteButton';

export const Notes = () => {
  const user = useGetUser();
  const notes = useQuery({ queryKey: ['notes'], queryFn: getNotes });

  if (!user.isSuccess) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-screen h-16 p-4 backdrop-blur-md">
        <div className="md:w-5/12 h-full mx-auto flex items-center">
          <UserNavigation className="ml-auto" />
        </div>
      </header>
      {(notes.isPending || notes.isFetching) && <Loader />}
      {!notes.isFetching && notes.isSuccess && (
        <div className="h-screen py-16">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="grid">
            {notes.data.map((note) => (
              <Link to={`/users/me/notes/${note.id}`} key={note.id}>
                {note.id}
              </Link>
            ))}
          </div>
        </div>
      )}
      <footer className="fixed bottom-0 left-0 w-screen h-16 p-4 backdrop-blur-md">
        <div className="md:w-5/12 h-full mx-auto grid grid-cols-3 items-center">
          <div className="text-sm text-center col-start-2">
            {notes.data?.length} {notes.data?.length === 1 ? 'Note' : 'Notes'}
          </div>
          <CreateNoteButton className="ml-auto" />
        </div>
      </footer>
    </>
  );
};
