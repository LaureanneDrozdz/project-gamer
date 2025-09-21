import Link from 'next/link';

function DesktopNav() {
  return (
    <nav
      className="hidden md:flex space-x-6"
      aria-label="Navigation principale"
    >
      <ul className="flex space-x-6 m-0 p-0 list-none">
        <li>
          <Link href="/" className="text-blanc hover:text-secondary">
            Accueil
          </Link>
        </li>
        <li>
          <Link href="/challenges" className="text-blanc hover:text-secondary">
            Challenges
          </Link>
        </li>
        <li>
          <Link href="/leaderboard" className="text-blanc hover:text-secondary">
            Leaderboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default DesktopNav;
