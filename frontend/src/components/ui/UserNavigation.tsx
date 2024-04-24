import * as React from 'react';
import { CircleEllipsis, CircleUserRound, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLogout } from '@/features/auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface UserNavigationProps {
  className?: string;
}

interface UserNavigationItem {
  name: string;
  to: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}

export const UserNavigation = ({ className }: UserNavigationProps) => {
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
        <button className={className} aria-label="Open user navigation">
          <CircleEllipsis className="h-7 w-7 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        {userNavigation.map((item, index, arr) => (
          <Link key={item.name} to={item.to} onClick={item.onClick}>
            <DropdownMenuItem className="px-8">
              <span className="mr-auto">{item.name}</span>
              {item.icon &&
                React.cloneElement(item.icon, {
                  className: 'ml-auto h-5 w-5',
                })}
            </DropdownMenuItem>
            {index < arr.length - 1 && <DropdownMenuSeparator />}
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
