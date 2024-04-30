import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Undo2, Redo2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Loader } from '@/components/ui/Loader';
import { UserNavigation } from '@/components/ui/UserNavigation';
import { useGetUser } from '@/features/auth';

import { CreateNoteButton } from '../components/CreateNoteButton';
import { useGetNote } from '../hooks/useGetNote';
import { useEffect } from 'react';

const Header = () => {
  const { editor } = useCurrentEditor();

  const done = () => {};

  return (
    <header className="fixed top-0 left-0 w-screen h-16 p-4 z-50 bg-background text-primary">
      <div className="md:w-5/12 h-full mx-auto flex items-center justify-between">
        <Link to="/users/me/notes" className="flex items-center">
          <ChevronLeft className="w-7 h-7 -ml-2" />
          Notes
        </Link>
        <div className="flex gap-4">
          {editor && (
            <>
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className={!editor.can().undo() ? 'brightness-50' : ''}
              >
                <Undo2 className="h-7 w-7" />
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className={!editor.can().redo() ? 'brightness-50' : ''}
              >
                <Redo2 className="h-7 w-7" />
              </button>
            </>
          )}
          <UserNavigation />
          {editor?.isFocused && (
            <button
              onClick={() => {
                editor.commands.blur();
              }}
              className="font-bold"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="fixed bottom-0 left-0 w-screen h-16 p-4 z-50 bg-background">
    <div className="md:w-5/12 h-full mx-auto grid grid-cols-3 items-center">
      <div className="text-sm text-center col-start-2">TODO: note footer</div>
      <CreateNoteButton className="ml-auto" />
    </div>
  </footer>
);

export const Note = () => {
  const user = useGetUser();

  const { noteId } = useParams();
  const note = useGetNote(Number(noteId));

  const navigate = useNavigate();
  useEffect(() => {
    if (
      note.isError &&
      isAxiosError(note.error) &&
      note.error.response?.status === 404
    ) {
      navigate('/users/me/notes');
    }
  });

  if (!user.isSuccess || note.isError) {
    return null;
  }

  if (note.isPending) {
    return <Loader />;
  }

  const extensions = [StarterKit];
  const content = note.data.content;

  // {note.isSuccess && (
  //   <div className="my-16">

  //   </div>
  // )}

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      slotBefore={<Header />}
      slotAfter={<Footer />}
      editorProps={{
        attributes: {
          class: 'h-screen py-16 prose focus:outline-none caret-primary',
        },
      }}
      autofocus="start"
      children={undefined} // needed in @tiptap/react version 2.3.1
    />
  );
};
