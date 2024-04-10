import * as React from 'react';
import { CircleEllipsis, CircleUserRound, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLogout } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface UserNavigationItem {
  name: string;
  to: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}

const UserNavigation = () => {
  const logout = useLogout();

  const userNavigation: UserNavigationItem[] = [
    { name: 'Profile', to: '/users/me', icon: <CircleUserRound /> },
    {
      name: 'Sign out',
      to: '',
      icon: <LogOut />,
      onClick: () => {
        logout.mutate();
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CircleEllipsis className="h-7 w-7 text-primary ml-auto cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        {userNavigation.map((item, i, arr) => (
          <Link key={item.name} to={item.to} onClick={item.onClick}>
            <DropdownMenuItem>
              <span className="mr-auto">{item.name}</span>
              {item.icon &&
                React.cloneElement(item.icon, {
                  className: 'ml-auto h-5 w-5',
                })}
            </DropdownMenuItem>
            {i < arr.length - 1 && <DropdownMenuSeparator />}
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen p-4">
      <header>
        <UserNavigation />
      </header>
      <main>{children}</main>
    </div>
  );
};
