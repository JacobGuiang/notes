import { Navigate, Route, Routes } from 'react-router-dom';

import { Register } from './Register';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="*" element={<Navigate to="register" />} />
    </Routes>
  );
};
