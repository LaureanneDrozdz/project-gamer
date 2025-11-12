-- 1. Ajout des colonnes user_id (nullable pour l'instant)

ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

ALTER TABLE "Participation" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

ALTER TABLE "Vote" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- 2. Copier les données existantes dans les nouvelles colonnes

UPDATE "Challenge" SET "user_id" = "created_by" WHERE "user_id" IS NULL;

UPDATE "Participation" SET "user_id" = "users_id" WHERE "user_id" IS NULL;

-- Pour Vote, tu as deux colonnes (userId et users_id) à gérer :
-- Copier depuis userId si existant, sinon depuis users_id

UPDATE "Vote" SET "user_id" = "userId" WHERE "user_id" IS NULL AND "userId" IS NOT NULL;
UPDATE "Vote" SET "user_id" = "users_id" WHERE "user_id" IS NULL AND "users_id" IS NOT NULL;

-- 3. Supprimer les anciennes clés étrangères (pour pouvoir supprimer les colonnes)

ALTER TABLE "Challenge" DROP CONSTRAINT IF EXISTS "Challenge_created_by_fkey";

ALTER TABLE "Participation" DROP CONSTRAINT IF EXISTS "Participation_users_id_fkey";

ALTER TABLE "Vote" DROP CONSTRAINT IF EXISTS "Vote_userId_fkey";
ALTER TABLE "Vote" DROP CONSTRAINT IF EXISTS "Vote_users_id_fkey";

-- 4. Supprimer les anciennes colonnes

ALTER TABLE "Challenge" DROP COLUMN IF EXISTS "created_by";

ALTER TABLE "Participation" DROP COLUMN IF EXISTS "users_id";

ALTER TABLE "Vote" DROP COLUMN IF EXISTS "userId";
ALTER TABLE "Vote" DROP COLUMN IF EXISTS "users_id";

-- 5. Mettre user_id en NOT NULL (après s’être assuré que toutes les lignes ont une valeur)

ALTER TABLE "Challenge" ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "Participation" ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "Vote" ALTER COLUMN "user_id" SET NOT NULL;

-- 6. Ajouter les nouvelles contraintes de clé étrangère sur user_id

ALTER TABLE "Challenge"
  ADD CONSTRAINT "Challenge_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Participation"
  ADD CONSTRAINT "Participation_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Vote"
  ADD CONSTRAINT "Vote_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;