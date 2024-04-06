import { AuthLayout } from '@/components/Layout';

import { useNavigate, Link } from 'react-router-dom';

import { RegisterForm } from '../components/RegisterForm';

export const Register = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <RegisterForm onSuccess={() => navigate('/users/me/notes')} />
      <div>
        Have an account?{' '}
        <Link to="/" className="text-primary font-bold">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
};
