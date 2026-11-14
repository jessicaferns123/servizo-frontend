'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ProviderUserDropdownProps = {
  profileImage?: string;
};

export const ProviderUserDropdown = ({ profileImage }: ProviderUserDropdownProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/provider-login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const navigateToProviderLogin = () => {
    handleNavigation('/provider-login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={profileImage || '/images/user-placeholder.jpg'} alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/provider-profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/provider-bookings')}>
            <Calendar className="mr-2 h-4 w-4" />
            My Bookings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>Customer Sign In/Sign Up</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={navigateToProviderLogin}>Provider Sign In</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
