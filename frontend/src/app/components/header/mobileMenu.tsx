import Link from 'next/link';
import AuthButtons from './authButtons';
import ProfileMenu from './profileMenu';
import { useAuth } from '@/lib/auth-context';

function MobileMenu() {
  const menuId = 'mobile-menu';
  const { isLoggedIn } = useAuth();

  return (
    <nav
      id={menuId}
      className="lg:hidden relative top-full left-0 right-0 bg-primary flex flex-col items-center py-4 space-y-4 z-10 shadow-lg"
      aria-label="Navigation mobile"
      role="menu"
      tabIndex={-1}
    >
      <ul className="flex flex-col items-center space-y-4 m-0 p-0 list-none">
        <li role="none">
          <Link
            href="/"
            className="text-blanc hover:text-secondary"
            role="menuitem"
          >
            Accueil
          </Link>
        </li>
        <li role="none">
          <Link
            href="/challenges"
            className="text-blanc hover:text-secondary"
            role="menuitem"
          >
            Challenges
          </Link>
        </li>
        <li role="none">
          <Link
            href="/leaderboard"
            className="text-blanc hover:text-secondary"
            role="menuitem"
          >
            Leaderboard
          </Link>
        </li>
        <li role="none">{isLoggedIn ? <ProfileMenu /> : (
          <div className='flex flex-col gap-3'>
            <AuthButtons />
          </div>
        )}</li>
      </ul>
    </nav>
  );
}
export default MobileMenu;
