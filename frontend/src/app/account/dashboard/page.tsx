"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AvatarModal } from "../../components/avatarModal/avatarModal";

export default function AccountDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [userObject, setUserObject] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/signin");
      return;
    }
    if (user) {
      apiFetch(`/user/${user.id}`)
        .then(setUserObject)
        .catch(console.error);
    }
  }, [isLoading, user, router]);

  if (isLoading) return <p>Loading…</p>;
  if (!user || !userObject) return null;

  return (
    <main className="mt-[10%] w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8">
      {/* Profile */}
      <div className="relative flex items-center gap-6">
        <img
          src={`/api/images/${user.avatar_url}`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-primary shadow"
        />
        {/* Edit button overlay */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-0 left-16 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          aria-label="Change avatar"
        >
          ✏️
        </button>

        <div>
          <h1 className="text-3xl font-bold font-logo text-primary">
            {user.name}
          </h1>
          <p className="text-secondary font-secondary">{user.email}</p>
          <p className="text-xs text-gray-600 mt-1">
            Membre depuis :{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* show modal */}
      {showModal && (
        <AvatarModal
          userId={user.id}
          defaultAvatar={user.avatar_url}
          onClose={() => setShowModal(false)}
          onUpload={(newKey) =>
            setUserObject({ ...userObject, avatar_url: newKey })
          }
        />
      )}

      {/* … rest of your dashboard … */}
      <button
        onClick={logout}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Déconnexion
      </button>
    </main>
  );
}
