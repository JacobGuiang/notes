import { useNavigate } from 'react-router-dom';

import { useUser } from '@/lib/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const user = useUser();

  if (user.data) {
    navigate('/users/me/notes');
  }

  return (
    <div>
      <h2>TODO: landing</h2>
      <button>login</button>
      <button>register</button>
    </div>
  );
};
