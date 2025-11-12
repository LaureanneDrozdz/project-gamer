'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import BurgerButton from './burgerButton';
import DesktopNav from './desktopNav';
import ProfileMenu from './profileMenu';
import AuthButtons from './authButtons';
import MobileMenu from './mobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  return (
    <div className="bg-primary sticky top-0 z-50">
      <header className="flex justify-between items-center px-8 py-4">
        <span className="logo">GamerChallenges</span>

        {/* Burger Menu Button */}
        <BurgerButton isOpen={isMenuOpen} toggle={toggleMenu} />

        {/* Desktop Navigation */}
        <DesktopNav />
        {/* Desktop Buttons or Profile */}
        <div className="hidden lg:flex items-center space-x-2 relative">
          {isLoggedIn ? <ProfileMenu /> : <AuthButtons />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden min-h-[300px] absolute top-full left-0 right-0 bg-primary flex-col items-center py-4 space-y-4 z-10 shadow-lg ${isMenuOpen ? 'flex' : 'hidden'}`}
        >
          <MobileMenu toggle={toggleMenu} />
        </div>
      </header>
    </div>
  );
}
