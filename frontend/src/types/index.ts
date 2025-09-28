export type Participation = {
  id: string;
  video_url: string;
  title: string;
  votes: number;
  challenge: Challenge;
  challenge_id: string;
  user_id: number;
  validated: boolean;
  created_at: string;
  description: string;
  nb_votes: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  rules: string;
  game: string;
  difficulty: string;
  user_id: string;
  validated: boolean;
  created_at: string;
  creator:
    | {
        userName: string;
      }
    | string;
  image_url: string | null;
  votes?: Vote[];
  participations?: Participation[];
};

export type Vote = {
  id: string;
  user_id: string;
  target_id: string;
  target_type: string;
  created_at: Date;
  user?: User;
  challenge?: Challenge | null;
  participation?: Participation | null;
};

export type User = {
  id: string;
  userName: string;
  email: string;
  avatar_url: string;
  created_at: Date;
  challenges?: Challenge[];
  participations?: Participation[];
  votes?: Vote[];
  role: string;
};

// export type LeaderboardEntry = {
//   imageUser: string;
//   username: string;
//   score: number;
// };

export type LeaderboardItemType = {
  userName: string;
  avatar_url: string;
  score: number;
};
