import { useUser } from '@/lib/auth';

export const Profile = () => {
  const user = useUser();

  if (!user.data) {
    return null;
  }

  return (
    <div>
      <h2>TODO: Profile</h2>
    </div>
  );
};
