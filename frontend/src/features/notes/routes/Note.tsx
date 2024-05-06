import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Undo2, Redo2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import {
  Editor,
  EditorContent,
  useEditor,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Loader } from '@/components/ui/Loader';
import { UserNavigation } from '@/components/ui/UserNavigation';
import { useGetUser } from '@/features/auth';

import { useGetNote } from '../hooks/useGetNote';
import { useUpdateNote } from '../hooks/useUpdateNote';
import {
  TitleButton,
  HeadingButton,
  SubHeadingButton,
  BulletListButton,
  OrderedListButton,
} from '../components';

interface HeaderProps {
  editor: Editor;
  updateNote: () => void;
  showDone: boolean;
  setShowDone: (boolean: boolean) => void;
}

const Header = ({ editor, updateNote, showDone, setShowDone }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-screen z-50 bg-background">
      <div className="md:w-5/12 h-full mx-auto p-4 grid gap-4">
        <div className="flex items-center justify-between text-primary">
          <Link to="/users/me/notes" className="flex items-center">
            <ChevronLeft className="w-7 h-7 -ml-2" />
            Notes
          </Link>
          <div className="flex gap-4">
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
            <UserNavigation />
            {showDone && (
              <button
                onClick={() => {
                  updateNote();
                  setShowDone(false);
                }}
                className="font-bold"
              >
                Done
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex align-center gap-4">
            <TitleButton editor={editor} />
            <HeadingButton editor={editor} />
            <SubHeadingButton editor={editor} />
          </div>
          <div className="flex align-center gap-4">
            <BulletListButton editor={editor} />
            <OrderedListButton editor={editor} />
          </div>
        </div>
      </div>
    </header>
  );
};

export const Note = () => {
  const user = useGetUser();

  const params = useParams();

  const noteId = Number(params.noteId);
  const note = useGetNote(noteId);
  const updateNote = useUpdateNote();

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

  const [showDone, setShowDone] = useState(false);

  const extensions = [StarterKit];

  const editor = useEditor(
    {
      extensions,
      content: note.data?.content,
      onUpdate: () => {
        if (!showDone) {
          setShowDone(true);
        }
      },
      editorProps: {
        attributes: {
          class:
            'min-h-screen py-16 prose prose-editor prose-base focus:outline-none caret-primary',
        },
      },
      autofocus: 'start',
    },
    [note.data?.content]
  );

  if (!user.isSuccess || note.isError) {
    return null;
  }

  if (note.isPending || note.isFetching || !editor) {
    return <Loader />;
  }

  return (
    <>
      <Header
        editor={editor}
        updateNote={() =>
          updateNote.mutate({
            id: noteId,
            // check isEmpty to prevent saving content as '<p></p>'
            content: editor.isEmpty ? '' : editor.getHTML(),
          })
        }
        showDone={showDone}
        setShowDone={setShowDone}
      />
      <EditorContent editor={editor} />
    </>
  );
};
