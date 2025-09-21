import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="flex items-center text-blanc focus:outline-none"
        aria-label="Ouvrir la page profil"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Image
          src={user?.avatar_url || '/images/person-1.webp'}
          alt="Avatar"
          className="w-8 h-8 rounded-full border-2 border-blanc"
          width={32}
          height={32}
          priority={false}
          fetchPriority="low"
        />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2"
          role="menu"
          tabIndex={-1}
        >
          <Link
            href="/account/dashboard"
            className="block px-4 py-2 text-noir hover:bg-gray-100"
            onClick={toggle}
            role="menuitem"
          >
            Mon Profil
          </Link>
          <button
            onClick={() => {
              logout();
              toggle();
            }}
            className="w-full text-left px-4 py-2 text-noir hover:bg-gray-100"
            role="menuitem"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
export default ProfileMenu;
