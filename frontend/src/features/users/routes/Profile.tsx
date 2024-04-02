import { useAuth } from '@/lib/auth';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>TODO: Profile</h2>
    </div>
  );
};
