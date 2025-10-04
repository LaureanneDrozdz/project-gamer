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
    <div className="bg-primary relative z-50">
      <header className="flex justify-between items-center px-8 py-4">
        <span className="logo">GamerChallenges</span>

        {/* Burger Menu Button */}
        <BurgerButton isOpen={isMenuOpen} toggle={toggleMenu} />

        {/* Desktop Navigation */}
        <DesktopNav />
        {/* Desktop Buttons or Profile */}
        <div className="hidden md:flex items-center space-x-2 relative">
          {isLoggedIn ? <ProfileMenu /> : <AuthButtons />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-primary flex-col items-center py-4 space-y-4 z-10 shadow-lg ${isMenuOpen ? 'flex' : 'hidden'}`}
        >
          <MobileMenu />
        </div>
      </header>
    </div>
  );
}
