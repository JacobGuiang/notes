import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Undo2Icon,
  Redo2Icon,
  ListIcon,
  ListOrderedIcon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { isAxiosError } from 'axios';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

import { Loader } from '@/components/ui/Loader';
import { UserNavigation } from '@/components/ui/UserNavigation';
import { useGetUser } from '@/features/auth';

import { useGetNote } from '../hooks/useGetNote';
import { useUpdateNote } from '../hooks/useUpdateNote';

interface HeaderProps {
  editor: Editor;
  updateNote: () => void;
  showDone: boolean;
  setShowDone: (boolean: boolean) => void;
}

const Header = ({ editor, updateNote, showDone, setShowDone }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-screen h-32 z-50 bg-background">
      <div className="lg:w-1/2 h-full mx-auto p-4">
        <div className="flex items-center justify-between text-primary">
          <Link to="/users/me/notes" className="flex items-center">
            <ChevronLeft className="w-7 h-7 -ml-2" />
            Notes
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className={!editor.can().undo() ? 'brightness-50' : ''}
              aria-label="Undo"
            >
              <Undo2Icon className="h-7 w-7" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className={!editor.can().redo() ? 'brightness-50' : ''}
              aria-label="Redo"
            >
              <Redo2Icon className="h-7 w-7" />
            </button>
            <UserNavigation />
            {showDone && (
              <button
                onClick={() => {
                  updateNote();
                  setShowDone(false);
                }}
                className="font-bold"
                aria-label="Done"
              >
                Done
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 })
                ? 'editor-button-active'
                : 'editor-button'
            }
          >
            Title
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 })
                ? 'editor-button-active'
                : 'editor-button'
            }
          >
            Heading
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 })
                ? 'editor-button-active'
                : 'editor-button'
            }
          >
            Subheading
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold') ? 'editor-button-active' : 'editor-button'
            }
            aria-label="Bold"
          >
            <BoldIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic')
                ? 'editor-button-active'
                : 'editor-button'
            }
            aria-label="Bold"
          >
            <ItalicIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive('underline')
                ? 'editor-button-active'
                : 'editor-button'
            }
            aria-label="Underline"
          >
            <UnderlineIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike')
                ? 'editor-button-active'
                : 'editor-button'
            }
            aria-label="Strike"
          >
            <StrikethroughIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive('bulletList')
                ? 'editor-button-active'
                : 'editor-button'
            }
            aria-label="Bulleted list"
          >
            <ListIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive('orderedList')
                ? 'editor-button-active'
                : 'editor-button'
            }
            aria-label="Numbered list"
          >
            <ListOrderedIcon />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().liftListItem('listItem').run()
            }
            disabled={!editor.can().liftListItem('listItem')}
            className="editor-button"
            aria-label="Decrease indent"
          >
            <IndentDecreaseIcon />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().sinkListItem('listItem').run()
            }
            disabled={!editor.can().sinkListItem('listItem')}
            className="editor-button"
            aria-label="Increase indent"
          >
            <IndentIncreaseIcon />
          </button>
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

  const extensions = [StarterKit, Underline];

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
            'min-h-screen max-w-none py-32 prose prose-editor focus:outline-none caret-primary',
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
