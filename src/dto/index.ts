export type sessionsDTO = {
  _id?: string;
  user?: string;
  duration?: number;
  expiredAt: string;
  external?: boolean;
  createdAt?: string;
};

export type bookDTO = {
  _id?: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
  snippet?: string;
  authors?: string[];
  category: string[];
  languages: string[];
  folder: string;
  cover: string;
  collections: string[];
  owner: string;
  uploader: string;
  createdAt?: Date;
  meta?: {
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
};

export type bookUpdateDTO = bookDTO & {
  owner?: string;
  uploader?: string;
  title?: string;
  description?: string;
  status?: "Active" | "Inactive";
  category?: string[];
  languages?: string[];
  folder?: string;
  cover?: string;
};

export type chapterDTO = {
  _id?: string;
  title: string;
  description: string;
  file: string;
  mimetype: string;
  book: string;
  createdAt?: Date;
};

export type seenDTO = {
  _id?: string;
  user: string;
  bookId: string;
  seenAt?: Date;
  playedAt?: string;
  createdAt?: string;
};

export type subscriberDTO = {
  _id?: string;
  parent: string;
  user: string;
  active: boolean;
  ref: string;
  createdAt?: string;
};

export type subscriptionsDTO = {
  _id?: string;
  name: string;
  active: boolean;
  visible: boolean;
  duration: number;
  users: number;
  autorenew: boolean;
  amount: number;
  origin: string;
  accent: string;
  createdAt?: string;
};

export type UserType = {
  _id?: string;
  email: string;
  password: string;
  username: string;
  account: string;
  active: boolean;
  dp: string;
  bio: string;
  subscription?: string;
  createdAt?: string;
};

export type ReactionType = {
  _id?: string;
  bookID: string;
  user: string;
  action: "Liked" | "Disliked";
  createdAt?: string;
  deletedAt?: string;
};
