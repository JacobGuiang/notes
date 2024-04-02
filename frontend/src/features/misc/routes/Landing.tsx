import { useNavigate } from 'react-router-dom';

import { useUser } from '@/lib/auth';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const Landing = () => {
  const navigate = useNavigate();
  const user = useUser();

  if (user.data) {
    navigate('/users/me/notes');
  }

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-primary text-8xl">Notes</h1>
      <LoginForm />
      <button>Sign up</button>
    </div>
  );
};
