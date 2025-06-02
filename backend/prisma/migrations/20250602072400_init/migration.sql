-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_users_id_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_users_id_fkey";

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
