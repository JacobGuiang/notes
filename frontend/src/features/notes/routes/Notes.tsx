import { useGetUser } from '@/features/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { Loader } from '@/components/ui/Loader';
import { UserNavigation } from '@/components/ui/UserNavigation';

import { getNotes } from '../api/getNotes';
import { CreateNoteButton } from '../components/CreateNoteButton';
import { NoteDropdown } from '../components/NoteDropdown';

const getTitleAndPreview = (content: string) => {
  const dom = new DOMParser().parseFromString(content, 'text/html');
  const textContent = [...dom.body.children]
    .filter((element) => element.textContent)
    .map((element) => element.textContent);

  return {
    title: textContent[0] || 'New Note',
    preview: textContent[1] || 'No additional text',
  };
};

export const Notes = () => {
  const user = useGetUser();
  const notes = useQuery({ queryKey: ['notes'], queryFn: getNotes });

  if (!user.isSuccess) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-screen h-16 backdrop-blur-md">
        <div className="lg:w-1/2 h-full mx-auto p-4 flex items-center">
          <UserNavigation className="ml-auto" />
        </div>
      </header>
      {(notes.isPending || notes.isFetching) && <Loader />}
      {!notes.isFetching && notes.isSuccess && (
        <div className="min-h-screen py-16">
          <h1 className="text-3xl font-bold mb-4">Notes</h1>
          <div className="rounded-lg bg-secondary">
            {notes.data.map((note, index, array) => {
              const { title, preview } = getTitleAndPreview(note.content);

              return (
                <div
                  className={
                    index !== array.length - 1
                      ? 'border-b-[1px] border-b-accent'
                      : ''
                  }
                  key={note.id}
                >
                  <Link to={`/users/me/notes/${note.id}`}>
                    <div className="py-2 px-6">
                      <div className="flex justify-between">
                        <h2 className="font-bold overflow-x-hidden overflow-ellipsis whitespace-nowrap mr-4">
                          {title}
                        </h2>
                        <NoteDropdown className="flex-shrink-0" id={note.id} />
                      </div>
                      <p className="text-muted-foreground overflow-x-hidden overflow-ellipsis whitespace-nowrap">
                        <span>
                          {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'short',
                          }).format(new Date(note.updated_at))}
                        </span>{' '}
                        {preview}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <footer className="fixed bottom-0 left-0 w-screen h-16 backdrop-blur-md">
        <div className="lg:w-1/2 h-full mx-auto p-4 grid grid-cols-3 items-center">
          <div className="text-sm text-center col-start-2">
            {notes.data?.length} {notes.data?.length === 1 ? 'Note' : 'Notes'}
          </div>
          <CreateNoteButton className="ml-auto" />
        </div>
      </footer>
    </>
  );
};
