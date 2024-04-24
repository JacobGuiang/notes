import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/Layout';
import { useGetUser } from '@/features/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const user = useGetUser({ throwOnUnauthorized: false });

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
