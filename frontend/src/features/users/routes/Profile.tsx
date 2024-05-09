import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { UserNavigation } from '@/components/ui/UserNavigation';
import { useGetUser } from '@/features/auth';

export const Profile = () => {
  const user = useGetUser();

  if (!user.isSuccess) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-screen h-16">
        <div className="lg:w-1/2 h-full mx-auto p-4 flex items-center justify-between">
          <Link to="/users/me/notes" className="text-primary flex items-center">
            <ChevronLeft className="w-7 h-7 -ml-2" />
            Notes
          </Link>
          <UserNavigation />
        </div>
      </header>
      <div className="mt-16">TODO: Profile</div>
    </>
  );
};
