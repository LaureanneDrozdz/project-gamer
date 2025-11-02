-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_challenge_id_fkey";

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;