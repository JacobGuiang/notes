import { Navigate, Route, Routes } from 'react-router-dom';

import { Note } from './Note';
import { Notes } from './Notes';

export const NotesRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Notes />} />
      <Route path=":noteId" element={<Note />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
