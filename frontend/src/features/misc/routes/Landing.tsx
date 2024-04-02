import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/notes');
  }

  return (
    <div>
      <h2>TODO: landing</h2>
      <button>login</button>
      <button>register</button>
    </div>
  );
};
