import { User } from "@/types";
import Image from "next/image";

export default function ProfileHeader({ user }: { user: User }) {
  return (
    <header
      className="flex items-center gap-6"
      aria-labelledby="profile-header-title"
    >
      <div
        className="flex-shrink-0"
        role="img"
        aria-label={`Avatar de ${user.userName}`}
      >
        <Image
          src={user.avatar_url || '/default-avatar.png'}
          alt=""
          width={80}
          height={80}
          className="w-20 h-20 rounded-full border-4 border-primary shadow object-cover"
        />
      </div>
      <div>
        <h2
          id="profile-header-title"
          className="text-3xl font-bold font-logo text-primary"
        >
          {user.userName}
        </h2>
        <p className="text-secondary font-secondary">{user.email}</p>
        <p className="text-xs text-noir/60 mt-1">
          Membre depuis :{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(user.created_at))}
        </p>
      </div>
    </header>
  );
}