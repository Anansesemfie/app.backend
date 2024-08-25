export type SessionType = {
  _id?: string;
  user?: string;
  duration?: number;
  expiredAt: string;
  external?: boolean;
  createdAt?: string;
};

export type BookType = {
  _id?: string;
  title: string;
  description: string;
  status: number;
  snippet?: string;
  authors?: string[];
  category: string[];
  languages: string[];
  folder: string;
  cover: string;
  collections: string[];
  associates: string[];
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

export type BookUpdateType = BookType & {
  owner?: string;
  uploader?: string;
  title?: string;
  description?: string;
  status?: number;
  category?: string[];
  languages?: string[];
  folder?: string;
  cover?: string;
};

export type ChapterType = {
  _id?: string;
  title: string;
  description: string;
  file: string;
  mimetype: string;
  book: string;
  createdAt?: Date;
};

export type ChapterResponseType = {
  id: string;
  title: string;
  content: string;
  book: BookType;
  createdAt: string | Date;
};
export type SeenType = {
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

export type SubscriptionsType = {
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
  account: number;
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

export type CommentType = {
  _id?: string;
  bookID: string;
  user: string;
  comment: string;
  createdAt?: string;
  deletedAt?: string;
};

export type CategoryType = {
  _id?: string;
  title: string;
  description?: string;
  createdAt?: string;
};
export type CategoryResponseType = {
  id: string;
  name: string;
};

export type LanguageType = {
  _id?: string;
  title: string;
  active: boolean;
  createdAt?: string;
};
