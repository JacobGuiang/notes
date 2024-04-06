import { useNavigate } from 'react-router-dom';

import { useUser } from '@/lib/auth';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/Layout';
import { useEffect } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (user.data) {
      navigate('/users/me/notes');
    }
  });

  return (
    <AuthLayout>
      <LoginForm onSuccess={() => navigate('/users/me/notes')} />
      <div>
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary font-bold">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
};
