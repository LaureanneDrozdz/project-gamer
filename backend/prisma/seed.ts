import { PrismaClient, Difficulty, Roles, TargetType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const adminUser = await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {},
    create: {
      userName: 'admin',
      email: 'admin@example.com',
      password_hash: 'Passpass1',
      avatar_url: 'https://randomuser.me/api/portraits/women/23.jpg',
      role: Roles.ADMIN,
    },
  });

  const user1 = await prisma.user.upsert({
     where: { userName: 'alice' },
     update:{}, 
    create: {
      userName: "alice",
      email: "alice@example.com",
      password_hash: "hashalice123",
      avatar_url: "https://randomuser.me/api/portraits/women/32.jpg",
      role: Roles.USER
    },
  });

  const user2 = await prisma.user.upsert({
    where: { userName: 'bob' },
     update:{},
    create: {
      userName: "bob",
      email: "bob@example.com",
      password_hash: "hashbob456",
      avatar_url: "https://randomuser.me/api/portraits/men/75.jpg",
      role: Roles.USER
    },
  });

const challengeId = "challenge_speedrun_1";
const randomImage = Math.floor(Math.random() * 1000);
const challenge1 = await prisma.challenge.upsert({
  where: { id: challengeId },
  update: {},
  create: {
    title: "Speedrun challenge",
    description: "Finish the game as fast as possible",
    rules: "No cheats, no glitches",
    game: "SuperFastGame",
    difficulty: Difficulty.MEDIUM,
    validated: true,
    image_url: `https://via.assets.so/game.webp?id=${randomImage}`,
    creator: { connect: { id: user1.id } },
  },
});


const participationId = "participation_1";
const participation1 = await prisma.participation.upsert({
  where: {
    id: participationId
  },
  update: {},
  create: {
    user: { connect: { id: user2.id } },
    challenge: { connect: { id: challenge1.id } },
    video_url: "https://www.youtube.com/watch?v=KEpjLAzTod8&ab_channel=olivierhorps",
    description: "My best run ever!",
    validated: false,
  },
});


  const voteForParticipationId = `${participation1.id}_participation`;
  await prisma.vote.upsert({
    where: { id: voteForParticipationId },
    update: {},
    create: {
      id: voteForParticipationId,
      user: { connect: { id: user1.id } },
      participation: { connect: { id: participation1.id } },
      target_type: TargetType.PARTICIPATION,
    },
  });

  const voteForChallengeId = `${challenge1.id}_challenge`;
  await prisma.vote.upsert({
    where: { id: voteForChallengeId },
    update: {},
    create: {
      id: voteForChallengeId,
      challenge: { connect: { id: challenge1.id } },
      user: { connect: { id: user2.id } },
      target_type: TargetType.CHALLENGE,
    },
  });

  console.log("✅ Seeding terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });