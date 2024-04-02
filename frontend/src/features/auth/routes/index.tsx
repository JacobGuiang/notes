import { Route, Routes } from 'react-router-dom';

import { Register } from './Register';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
    </Routes>
  );
};
